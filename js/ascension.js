// Престиж и древо генома

// ---------- Вознесение: слияние двух существ 25 уровня ----------
function ascendPair(el, c) {
  el.classList.add('merging'); c.el.classList.add('merging');
  const x = parseFloat(el.style.left), y = parseFloat(el.style.top), id1 = el.dataset.id, id2 = c.id;
  setTimeout(() => {
    removeCreature(id1); removeCreature(id2);
    state.rank = (state.rank || 0) + 1;
    const dust = 1 + Math.floor(state.rank / 3);
    state.dust = (state.dust || 0) + dust;
    for (let i = 0; i < 4; i++) setTimeout(() => burst(x + 60 + (Math.random() - 0.5) * 120, y + 60 + (Math.random() - 0.5) * 120, ['#ffd23f', '#b07aff', '#7fffd4', '#ff7ac8'][i], 3), i * 160);
    showAscension(state.rank, dust);
    updateUI(); save();
  }, 280);
}
function showAscension(rank, dust) {
  const d = document.createElement('div');
  d.className = 'discover';
  d.innerHTML = `<div class="rays"></div><div class="dc-card"><div class="dc-top">✦ ВОЗНЕСЕНИЕ ✦</div><div class="dc-art">${artSVG(25, 'asc')}</div><div class="dc-name">Ранг ${rank}: ${rankTitle(rank)}</div><div class="dc-desc">Два высших разума слились и вознеслись.</div><div class="dc-gem">+${dust} ✦ звёздной пыли</div><div class="dc-hint">Нажмите, чтобы продолжить</div></div>`;
  d.onclick = () => d.remove();
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 7000);
  sfx('prestige'); submitScore();
}
let sgBuilt = false;
function renderAscend() {
  const box = document.getElementById('sgList');
  if (!sgBuilt) {
    sgBuilt = true;
    SG.forEach(it => {
      const d = document.createElement('div');
      d.className = 'shop-item up-card';
      d.style.setProperty('--c', it.color);
      d.innerHTML = `<div class="si-ico">${it.icon}</div><div class="si-body"><div class="shop-title">${it.title}</div><div class="shop-desc">${it.desc}</div><div class="sbar"><i id="sgbar-${it.key}"></i></div><div class="shop-lvl">Ур. <span id="sgl-${it.key}">0</span>/${it.max}</div></div><button id="sgb-${it.key}"></button>`;
      d.querySelector('button').onclick = () => {
        const l = state.sg[it.key] || 0, cost = it.cost(l);
        if (l < it.max && state.dust >= cost) { state.dust -= cost; state.sg[it.key] = l + 1; updateUI(); save(); renderAscend(); }
      };
      box.appendChild(d);
    });
  }
  SG.forEach(it => {
    const l = state.sg[it.key] || 0, cost = it.cost(l), b = document.getElementById('sgb-' + it.key);
    document.getElementById('sgl-' + it.key).textContent = l;
    document.getElementById('sgbar-' + it.key).style.width = l / it.max * 100 + '%';
    b.textContent = l >= it.max ? 'Максимум' : cost + ' ✦';
    b.disabled = l >= it.max || (state.dust || 0) < cost;
  });
  const r = state.rank || 0, have = state.creatures.filter(c => c.level === LEVELS.length).length;
  document.getElementById('ascInfo').innerHTML = `<div class="row"><span>✦ Ранг</span><b>${r}${r ? ' · ' + rankTitle(r) : ''}</b></div><div class="row"><span>✦ Звёздная пыль</span><b>${state.dust || 0}</b></div><div class="row"><span>🌌 Множитель вознесения</span><b>×${Math.pow(1.15, r).toFixed(2)}</b></div><div class="row"><span>Макс. уровень в магазине</span><b>${shopMax()}</b></div><div class="row"><span>Высших существ на поле</span><b>${have}/2</b></div><p class="hint">Слейте двух существ 25 уровня: они вознесутся. Ранг растёт, а ДНК умножается на 1,15 за каждый ранг навсегда. Звёздную пыль можно тратить на звёздные дары.</p>`;
}

// Вознесённый: единственное существо локации «Вечность», его уровень равен 25 + число вознесений
function renderShrine() {
  let el = document.getElementById('shrine');
  if (!el) { el = document.createElement('div'); el.id = 'shrine'; el.className = 'shrine'; gameEl.appendChild(el); el.addEventListener('pointerdown', shrineClick); }
  const r = state.rank || 0, size = Math.min(420, 280 + r * 10);
  el.style.width = el.style.height = size + 'px';
  el.style.display = currentLoc === LOCS.length - 1 ? '' : 'none';
  const key = r + ':' + size;
  if (el.dataset.k !== key) {
    el.dataset.k = key;
    let rings = '';
    for (let i = 0; i < Math.min(r, 12); i++) rings += `<ellipse cx="50" cy="50" rx="${52 + i * 2}" ry="${16 + i * 2.4}" transform="rotate(${i * 27} 50 50)" fill="none" stroke="hsl(${(i * 40) % 360},90%,75%)" stroke-opacity=".5" stroke-width=".7"/>`;
    el.innerHTML = `<div class="sh-art" style="filter:hue-rotate(${r * 14}deg) saturate(1.2) brightness(1.1) drop-shadow(0 0 18px rgba(255,233,160,.6))">${artSVG(25, 'shr').replace('</svg>', `<g class="spin">${rings}</g></svg>`)}</div><div class="sh-name">Вознесённый · ур. ${25 + r}</div><div class="sh-hint">Слейте двух существ 25 уровня в «Космосе»</div>`;
  }
}
function shrineClick(e) {
  const r = state.rank || 0, n = Math.round(passiveRate() * (4 + r) + 50), g = gameEl.getBoundingClientRect();
  gain(n); state.stats.clicks++;
  dropDNA(e.clientX, e.clientY, 5 + Math.min(r, 8), true);
  floatText(e.clientX - g.left, e.clientY - g.top, '+' + fmt(n), 'pop-lucky');
  ripple(e.clientX - g.left, e.clientY - g.top, '#ffe9a0');
  sfx('rare'); updateUI();
}
