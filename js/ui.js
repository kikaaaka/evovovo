// Интерфейс: обновление, окна, энциклопедия, настройки

function updateUI() {
  if (state.settings.infgems && state.gems < 999999) state.gems = 999999;
  if (lastCoins !== null && state.coins > lastCoins) {
    const chip = document.getElementById('coins').parentElement;
    chip.classList.remove('bump');
    void chip.offsetWidth;
    chip.classList.add('bump');
  }
  lastCoins = state.coins;
  document.getElementById('coins').textContent = fmt(state.coins);
  document.getElementById('maxLevel').textContent = state.maxLevelReached;

  renderShop();

    document.getElementById('btnAscend').style.display = (state.bestLevel >= LEVELS.length || state.rank > 0) ? '' : 'none';

  updateLocTabs();
  renderBuy();
  renderGemShop();
  renderGU();
  document.getElementById('gems').textContent = state.gems;
  document.getElementById('w-dna').textContent = fmt(state.coins);
  document.getElementById('w-gem').textContent = state.gems;
  updateAchBadge();
  updateGoal();
  renderShrine();
  if (document.getElementById('modalInfo').classList.contains('open')) renderInfo();
  document.getElementById('income').textContent = passiveRate() < 10 ? passiveRate().toFixed(2) : fmt(passiveRate());
}

let dexTab = 0;
function renderDex() {
  const tabs = document.getElementById('dexTabs'), box = document.getElementById('dexList');
  tabs.innerHTML = ''; box.innerHTML = '';
  document.getElementById('dexCount').textContent = Math.min(state.bestLevel, LEVELS.length);
  for (let i = 0; i <= (LEVELS.length / 5); i++) {
    const b = document.createElement('button'), isRare = i === (LEVELS.length / 5);
    const found = isRare ? Object.keys(state.rareCaught).length + '/' + RARES.length : [1, 2, 3, 4, 5].filter(j => i * 5 + j <= state.bestLevel).length + '/5';
    b.className = 'tab' + (i === dexTab ? ' active' : '');
    b.innerHTML = (isRare ? '<span class="ic">✨</span>' : IC(LOCS[i].ic)) + `<small>${found}</small>`;
    b.title = isRare ? 'Редкие гости' : LOCS[i].name + ' · ' + (i * 5 + 1) + '–' + (i * 5 + 5);
    b.onclick = () => { dexTab = i; renderDex(); };
    tabs.appendChild(b);
  }
  if (dexTab < (LEVELS.length / 5)) {
    for (let j = 1; j <= 5; j++) {
      const lvl = dexTab * 5 + j, L = LEVELS[lvl - 1], known = lvl <= state.bestLevel, card = document.createElement('div');
      card.className = 'dex-card';
      card.innerHTML = artSVG(lvl, 'dx' + lvl).replace('<svg ', '<svg class="dex-art' + (known ? '' : ' locked') + (lvl <= 11 ? ' early' : '') + '" ') +
        `<div class="dex-name">${known ? L.name : '???'}</div><div class="dex-meta">Уровень ${lvl}${known ? ', ' + LOCS[locOf(lvl)].name : ''}</div>` +
        `<div class="dex-desc">${known ? DESC[lvl - 1] + ' Даёт ' + fmt(val(lvl)) + ' ДНК за такт' : 'Ещё не изучено'}</div>`;
      box.appendChild(card);
    }
  } else {
    RARES.forEach((R, i) => {
      const known = state.rareCaught[i], card = document.createElement('div');
      card.className = 'dex-card';
      card.innerHTML = `<svg viewBox="0 0 100 100" class="dex-art${known ? '' : ' locked'}">${R.svg}</svg><div class="dex-name">${known ? R.name : '???'}</div><div class="dex-meta">${LOCS[i].name}</div><div class="dex-desc">${known ? R.desc + ' Награда растёт вместе с прогрессом.' : 'Появляется редко. Ищите в этой локации.'}</div>`;
      box.appendChild(card);
    });
  }
}

function openModal(id) {
  if (id === 'modalDex') renderDex();
  if (id === 'modalAch') { renderQuests(); renderAch(); }
  if (id === 'modalInfo') renderInfo();
  if (id === 'modalAscend') renderAscend();
  updateUI();
  document.getElementById(id).classList.add('open');
}

function closeModals() { document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open')); }

function applySettings() {
  gameEl.classList.toggle('hq', state.settings.hq !== false);
  document.getElementById('gemsOffBtn').disabled = !state.settings.infgems;
  applyAudioSettings();
  ['pops', 'move', 'sound', 'hq', 'music', 'infgems'].forEach(k => { document.getElementById('set-' + k).checked = state.settings[k]; });
}

function askConfirm(text, yes) {
  const m = document.createElement('div');
  m.className = 'modal open';
  m.style.zIndex = 500;
  m.innerHTML = `<div class="panel" style="max-width:380px"><p style="margin-bottom:14px;line-height:1.45">${text}</p><div class="row2"><button class="cf-no">Отмена</button><button class="cf-yes">Подтвердить</button></div></div>`;
  document.body.appendChild(m);
  m.querySelector('.cf-no').onclick = () => m.remove();
  m.querySelector('.cf-yes').onclick = () => { m.remove(); yes(); };
}

// Цель: что нужно сделать, чтобы открыть следующий вид
function updateGoal() {
  document.documentElement.style.setProperty('--uih', document.getElementById('ui').offsetHeight + 'px');
  const el = document.getElementById('goal'), L = state.bestLevel;
  if (L >= LEVELS.length) { el.textContent = '✦ Слейте двух высших существ ради Вознесения'; return; }
  const have = Math.min(2, state.creatures.filter(c => c.level === L).length), key = L + ':' + have;
  if (el.dataset.k === key) return;
  el.dataset.k = key;
  el.innerHTML = `<span class="g-art">${artSVG(L + 1, 'goalart')}</span><span>Откройте новый вид: слейте 2× ${LEVELS[L - 1].name} <b>${have}/2</b></span>`;
}
// Подсветка пары для слияния, если игрок долго бездействует
function hintCheck() {
  if (Date.now() - lastAction < 9000) return;
  lastAction = Date.now() - 4000;
  const by = {};
  state.creatures.forEach(c => { if (locOf(c.level) === currentLoc) (by[c.level] = by[c.level] || []).push(c); });
  const lv = Object.keys(by).filter(l => by[l].length >= 2).sort((x, y) => y - x)[0];
  if (!lv) return;
  by[lv].slice(0, 2).forEach(c => { c.el.classList.add('hint'); setTimeout(() => c.el.classList.remove('hint'), 2800); });
}
// Короткое обучение: каждая подсказка показывается один раз
const TIPS = [
  ['t0', () => document.querySelector('.capsule'), 'Нажмите на светящуюся капсулу: из неё появится существо!'],
  ['t1', () => true, 'Нажмите на существо, чтобы получить ДНК 🧬'],
  ['t2', () => state.stats.clicks >= 1, 'Подведите существо к такому же, и они сольются в новый вид. Или нажмите на существо рядом с парой!'],
  ['t3', () => state.coins >= 60, 'Хватает ДНК на улучшение: загляните в 🛒 Магазин'],
  ['t4', () => state.stats.clicks >= 15, 'Клики заполняют шкалу энергии вверху: полная шкала даёт ВСПЛЕСК ×2'],
  ['t5', () => state.stats.merges >= 3, 'Слева бонусы: Урожай и Ускорение помогут расти быстрее'],
  ['t6', () => state.maxLevelReached >= 6, 'Открыта новая локация! Переключайтесь кнопками справа']
];
function tipCheck() {
  const box = document.getElementById('tip');
  if (!box.hidden || Date.now() - tipAt < 12000) return;
  const t = TIPS.find(t => !state.tips[t[0]] && t[1]());
  if (!t) return;
  state.tips[t[0]] = 1; tipAt = Date.now();
  box.textContent = t[2]; box.hidden = false; sfx('tip');
  setTimeout(() => { box.hidden = true; }, 8000);
  box.onclick = () => { box.hidden = true; };
  save();
}

function renderInfo() {
  const s = state.stats, tm = s.time || 0, mut = state.creatures.filter(c => c.mut).length;
  const rows = [
    ['⏱️ Время в игре', Math.floor(tm / 3600) + 'ч ' + Math.floor(tm % 3600 / 60) + 'м'], ['🔗 Слияний', fmt(s.merges || 0)], ['👆 Кликов', fmt(s.clicks || 0)],
    ['🍀 Счастливых кликов', fmt(s.lucky || 0)], ['🥚 Капсул открыто', fmt(s.opened || 0)], ['🧬 ДНК за всё время', fmt(s.earned || 0)],
    ['💧 Производство', (passiveRate() < 10 ? passiveRate().toFixed(2) : fmt(passiveRate())) + ' /с'], ['🌟 Мутантов сейчас', mut], ['✨ Редких гостей', Object.keys(state.rareCaught).length + '/' + RARES.length],
    ['⚡ Всплесков энергии', s.burst || 0], ['🔥 Рекорд комбо', '×' + (s.maxCombo || 0)], ['🎡 Прокруток колеса', s.wheel || 0], ['📅 Серия дней', state.daily.streak],
    ['🧬 Золотой геном', '×' + (1 + state.gemMult * 0.25).toFixed(2)], ['✦ Ранг вознесения', state.rank || 0], ['✦ Звёздная пыль', state.dust || 0]
  ];
  document.getElementById('infoStats').innerHTML = rows.map(r => `<div class="row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
}

// Бесконечные кристаллы (тест): при включении запоминаем настоящий запас, при выключении возвращаем его
function setInfGems(on) {
  if (on && !state.settings.infgems) state.gemsBackup = state.gems;
  if (!on && state.settings.infgems) { state.gems = state.gemsBackup || 0; state.gemsBackup = 0; }
  state.settings.infgems = on;
  applySettings(); updateUI(); save();
}
