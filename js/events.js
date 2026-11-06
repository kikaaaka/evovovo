// События и бонусы: редкие гости, дождь ДНК, колесо, магнит, ежедневная награда

let rainT = 120 + Math.random() * 60;

const burstMult = () => (Date.now() < luckUntil ? 2 + energyTier : 1);
function addEnergy(n) {
  const now = Date.now();
  if (now >= luckUntil) energy = Math.min(100, energy + n);
  if (energy >= 100 && now >= luckUntil) {
    energy = 0;
    energyTier = now - lastBurstEnd < 90000 ? Math.min(3, energyTier + 1) : 0;
    luckUntil = now + 8000 + state.energyLevel * 1000;
    lastBurstEnd = luckUntil;
    state.stats.burst = (state.stats.burst || 0) + 1;
    state.stats.maxTier = Math.max(state.stats.maxTier || 0, 2 + energyTier);
    showToast('⚡ ВСПЛЕСК ×' + (2 + energyTier) + '! Клики и слияния дают больше');
    fxAura('#ffe27a'); sfx('burst');
  }
  document.getElementById('energyBar').style.width = (now < luckUntil ? 100 : energy) + '%';
  document.getElementById('energy').dataset.mult = now < luckUntil ? '×' + (2 + energyTier) : '';
}
function fxAura(color) {
  sfx('power');
  gameEl.animate([{ boxShadow: 'inset 0 0 0 transparent' }, { boxShadow: `inset 0 0 90px ${color}` }, { boxShadow: 'inset 0 0 0 transparent' }], { duration: 1000 });
}
function harvest() {
  const gr = gameEl.getBoundingClientRect();
  let total = 0, i = 0;
  state.creatures.forEach(c => { total += produceAmt(c) * 10; });
  const sw = document.createElement('div');
  sw.className = 'sweep';
  gameEl.appendChild(sw);
  sw.animate([{ left: '-12%' }, { left: '110%' }], { duration: 1100, easing: 'ease-in-out' });
  setTimeout(() => sw.remove(), 1100);
  state.creatures.forEach(c => {
    if (c.el.style.display === 'none') return;
    setTimeout(() => {
      const r = c.el.getBoundingClientRect();
      ripple(r.left - gr.left + r.width / 2, r.top - gr.top + r.height / 2, '#9ff0a0');
      dropDNA(r.left + r.width / 2, r.top + r.height / 2, 2);
      c.el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.22,.8)' }, { transform: 'scale(1)' }], { duration: 320 });
    }, 40 * i++);
  });
  gain(total);
  sfx('harvest');
  showToast('🌾 Урожай собран: +' + fmt(total) + ' ДНК');
}
function startMagnet(ms) {
  magnetUntil = Date.now() + ms;
  sfx('magnet');
  gameEl.classList.add('magnet-on');
  const f = document.createElement('div');
  f.className = 'magnet-field';
  f.innerHTML = '<i></i><i></i><i></i>';
  gameEl.appendChild(f);
  showToast('🧲 Магнит сводит одинаковых существ ' + Math.round(ms / 1000) + ' секунд');
  setTimeout(() => { f.remove(); if (Date.now() >= magnetUntil) gameEl.classList.remove('magnet-on'); }, ms);
}
function beam(elA, elB) {
  const g = gameEl.getBoundingClientRect(), ra = elA.getBoundingClientRect(), rb = elB.getBoundingClientRect();
  const x1 = ra.left - g.left + ra.width / 2, y1 = ra.top - g.top + ra.height / 2, x2 = rb.left - g.left + rb.width / 2, y2 = rb.top - g.top + rb.height / 2;
  const b = document.createElement('div');
  b.className = 'beam';
  b.style.cssText = `left:${x1}px;top:${y1}px;width:${Math.hypot(x2 - x1, y2 - y1)}px;transform:rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;
  gameEl.appendChild(b);
  b.animate([{ opacity: 0, transform: b.style.transform + ' scaleY(.3)' }, { opacity: 1, transform: b.style.transform + ' scaleY(1)' }, { opacity: 0, transform: b.style.transform + ' scaleY(.3)' }], { duration: 700 });
  setTimeout(() => b.remove(), 700);
  ripple(x1, y1, '#ff7ac8'); ripple(x2, y2, '#ff7ac8');
  sfx('beam');
}
function vortex() {
  const w = gameEl.clientWidth, h = Math.max(200, gameEl.clientHeight - 90), list = state.creatures.filter(c => c.el.style.display !== 'none');
  list.forEach((c, i) => {
    const a = i * 2.4, r = 30 + (i % 7) * 14, el = c.el, s = el.offsetWidth;
    c.wait = 4; c.tx = undefined;
    el.style.transition = 'left .9s cubic-bezier(.5,0,.2,1), top .9s cubic-bezier(.5,0,.2,1)';
    el.style.left = (w / 2 - s / 2 + Math.cos(a) * r) + 'px';
    el.style.top = (h / 2 - s / 2 + Math.sin(a) * r) + 'px';
    setTimeout(() => { el.style.transition = ''; }, 950);
  });
  gameEl.animate([{ filter: 'hue-rotate(0deg)' }, { filter: 'hue-rotate(60deg) brightness(1.3)' }, { filter: 'hue-rotate(0deg)' }], { duration: 1000 });
  showToast('🌀 Вихрь собрал существ в центре: сливайте!');
  sfx('vortex');
}

function spawnRare() {
  const locs = [];
  LOCS.forEach((L, i) => { if (i === 0 || state.maxLevelReached > i * 5) locs.push(i); });
  const loc = locs[Math.floor(Math.random() * locs.length)], pos = randomPos(84), R = RARES[loc];
  const el = document.createElement('div');
  el.className = 'rare';
  el.style.left = pos.x + 'px';
  el.style.top = pos.y + 'px';
  el.innerHTML = `<div class="halo"></div><svg viewBox="0 0 100 100">${R.svg}</svg><span>${R.name}</span>`;
  el.addEventListener('pointerdown', ev => {
    ev.stopPropagation();
    const dna = Math.round((100 + passiveRate() * 300 + state.bestLevel * 60) * (1 + state.rareLevel * 0.1)), gem = 2 + Math.floor(state.bestLevel / 3);
    const withGem = Math.random() < 0.5, withCreature = Math.random() < 0.15;
    const rc = el.getBoundingClientRect(), cx = rc.left + rc.width / 2, cy = rc.top + rc.height / 2;
    gain(dna); dropDNA(cx, cy, 12, true);
    if (withGem) { state.gems += gem; dropDNA(cx, cy, 5, true, '💎', 'gems'); }
    if (withCreature) addCreature(Math.max(1, Math.min(LEVELS.length - 1, Math.floor(state.bestLevel * 0.6))));
    floatText(parseFloat(el.style.left) + 42, parseFloat(el.style.top), '+' + dna + ' 🧬' + (withGem ? '  +' + gem + ' 💎' : '') + (withCreature ? ' 🎁' : ''), 'pop-lucky');
    burst(parseFloat(el.style.left) + 42, parseFloat(el.style.top) + 42, '#ffe27a');
    state.stats.rare++;
    state.rareCaught[loc] = true;
    sfx('rare');
    el.remove(); rare = null; updateUI(); save();
  });
  gameEl.appendChild(el);
  rare = { el, loc, until: Date.now() + 60000 };
  sfx('rareSpawn');
  if (loc !== currentLoc) document.getElementById('loc' + loc).classList.add('new');
}

function spawnRain() {
  showToast('☄️ Дождь ДНК! Ловите капли');
  for (let i = 0; i < 14; i++) setTimeout(() => {
    const d = document.createElement('div'), h = gameEl.clientHeight;
    d.className = 'rain-drop';
    d.textContent = '🧬';
    d.style.cssText = `left:${5 + Math.random() * 90}%;top:-30px`;
    gameEl.appendChild(d);
    const a = d.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${h + 60}px)` }], { duration: 4500 + Math.random() * 2500, easing: 'linear' });
    a.onfinish = () => d.remove();
    d.addEventListener('pointerdown', ev => {
      ev.stopPropagation();
      const n = Math.round(passiveRate() * 10 + 30), r = d.getBoundingClientRect(), g0 = gameEl.getBoundingClientRect();
      gain(n); dropDNA(r.left + 10, r.top + 10, 3); sfx('pop');
      floatText(r.left - g0.left, r.top - g0.top, '+' + fmt(n), 'pop-click');
      a.cancel(); d.remove(); updateUI();
    });
  }, i * 450);
}

function dailyReward() {
  const t = new Date().toISOString().slice(0, 10), y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  if (state.daily.last === t) return;
  state.daily.streak = state.daily.last === y ? state.daily.streak + 1 : 1;
  state.daily.last = t;
  const n = Math.round(passiveRate() * 120 + 200) * Math.min(state.daily.streak, 7), g = state.daily.streak % 7 === 0 ? 5 : 1;
  gain(n); state.gems += g;
  showToast('📅 День ' + state.daily.streak + ' подряд: +' + fmt(n) + ' ДНК, +' + g + ' 💎');
  updateUI(); save();
}

function offlineReward() {
  if (!state.lastSeen || (state.offlineLevel < 1 && !state.gu.gu_offline)) return;
  const away = (Date.now() - state.lastSeen) / 1000;
  if (away < 60) return;
  const n = Math.round(passiveRate() * Math.min(away, 900 * state.offlineLevel + 3600 * (state.gu.gu_offline || 0)) * 0.5);
  if (n > 0) { gain(n); updateUI(); showToast('🌙 Пока вас не было: +' + n + ' ДНК'); }
}

function spinWheel() {
  const segs = [
    ['💎', '+3 кристалла', '#2f8fff', () => { state.gems += 3; }],
    ['🧬', 'Куча ДНК', '#22c79a', () => gain(Math.round(passiveRate() * 120 + 100))],
    ['⚡', 'Доход ×3 на 60 с', '#f0b020', () => { boostUntil = Date.now() + 60000; }],
    ['💎', '+6 кристаллов', '#6c5cf0', () => { state.gems += 6; }],
    ['🎁', 'Три капсулы', '#f0589a', () => { for (let i = 0; i < 3; i++) spawn(); }],
    ['🐟', 'Редкое существо', '#f07a4a', () => addCreature(Math.max(1, Math.min(LEVELS.length - 1, Math.floor(state.bestLevel * 0.7))))],
    ['🧪', 'Мутанты ×3', '#a050f0', () => { mutCharges = 3; }],
    ['🍀', 'Удача 20 с', '#40c050', () => { luckBoostUntil = Date.now() + 20000; }]
  ];
  const n = segs.length, idx = Math.floor(Math.random() * n), seg = 360 / n;
  const ov = document.createElement('div');
  ov.className = 'wheel-ov';
  const grad = segs.map((s, i) => `${s[2]} ${i * seg}deg ${(i + 1) * seg}deg`).join(',');
  ov.innerHTML = `<div class="wheel-box"><div class="wheel-ptr"></div><div class="wheel" style="background:conic-gradient(${grad})">${segs.map((s, i) => `<span style="transform:rotate(${i * seg + seg / 2}deg) translateY(-84px)">${s[0]}</span>`).join('')}<div class="wheel-hub">🎡</div></div><div class="wheel-res">Крутим...</div></div>`;
  document.body.appendChild(ov);
  const target = 360 * 6 + (360 - (idx * seg + seg / 2));
  ov.querySelector('.wheel').animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${target}deg)` }], { duration: 4200, easing: 'cubic-bezier(.15,.7,.1,1)', fill: 'forwards' });
  let t = 0;
  for (let i = 0; i < 26; i++) { t += 50 + i * i * 0.95; setTimeout(() => sfx('tick', i), t); }
  setTimeout(() => {
    segs[idx][3]();
    state.stats.wheel = (state.stats.wheel || 0) + 1;
    ov.querySelector('.wheel-res').textContent = segs[idx][0] + ' ' + segs[idx][1] + '!';
    ov.classList.add('done');
    sfx('win');
    updateUI(); save();
  }, 4300);
  setTimeout(() => ov.remove(), 6300);
}

const bonusTotal = {};
function buildBonuses() {
  const box = document.getElementById('bonuses');
  BONUS.forEach(b => {
    const el = document.createElement('button');
    el.id = 'bn-' + b.id; el.className = 'bonus'; el.title = b.name;
    el.style.setProperty('--c', b.color);
    el.innerHTML = `<span>${IC(b.id)}</span><small></small><i class="act"></i>`;
    el.onclick = () => {
      if (Date.now() < (bonusReady[b.id] || 0)) return;
      const cd = b.cd * 1000 * (1 - state.cdLevel * 0.05);
      bonusReady[b.id] = Date.now() + cd; bonusTotal[b.id] = cd;
      state.stats.bonuses++; b.run(); updateBonuses(); updateUI();
    };
    box.appendChild(el);
  });
  updateBonuses();
}

function updateBonuses() {
  const now = Date.now(), act = { boost: boostUntil, luck: luckBoostUntil };
  BONUS.forEach(b => {
    const el = document.getElementById('bn-' + b.id), left = Math.ceil(((bonusReady[b.id] || 0) - now) / 1000);
    el.style.display = state.bestLevel >= b.req ? '' : 'none';
    if (el.disabled && left <= 0) sfx('ready');
    el.disabled = left > 0;
    el.style.setProperty('--p', left > 0 ? 1 - (left * 1000) / (bonusTotal[b.id] || left * 1000) : 1);
    el.querySelector('small').textContent = left > 0 ? left : '';
    const a = act[b.id] || 0, on = b.id === 'mutagen' ? mutCharges > 0 : a > now;
    el.classList.toggle('active', on);
    el.querySelector('.act').textContent = b.id === 'mutagen' ? (mutCharges > 0 ? '×' + mutCharges : '') : (a > now ? Math.ceil((a - now) / 1000) : '');
  });
}
