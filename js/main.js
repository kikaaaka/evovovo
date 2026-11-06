// Игровой цикл и запуск

let lastT = 0, uiAcc = 0, saveAcc = 0, fpsAcc = 0, fpsN = 0;

function tick(t) {
  const dt = Math.min(0.1, (t - (lastT || t)) / 1000);
  lastT = t;
  fpsAcc += dt; fpsN++;
  if (fpsAcc >= 6) {
    const avg = fpsAcc / fpsN; fpsAcc = 0; fpsN = 0;
    if (avg > 0.045 && state.settings.hq !== false && state.creatures.length > 6) { state.settings.hq = false; applySettings(); showToast('Графика упрощена для плавной игры'); save(); }
  }
  const gr = gameEl.getBoundingClientRect();
  const maxBottom = Math.min(gr.height, document.getElementById('shop').getBoundingClientRect().top - gr.top);
  for (const c of state.creatures) {
    const el = c.el;
    if (el.style.display === 'none' || el.classList.contains('dragging') || el.classList.contains('merging') || el.dataset.hover) continue;
    if (!state.settings.move) continue;
    if (c.wait > 0) { c.wait -= dt; continue; }
    const size = el.offsetWidth;
    const x = parseFloat(el.style.left), y = parseFloat(el.style.top);
    if (c.tx === undefined) {
      c.tx = 8 + Math.random() * Math.max(0, gr.width - size - 16);
      c.ty = 8 + Math.random() * Math.max(0, maxBottom - size - 16);
    }
    const dx = c.tx - x, dy = c.ty - y, d = Math.hypot(dx, dy);
    if (d < 3) { c.tx = undefined; c.wait = 1.5 + Math.random() * 4.5; c.art.style.transform = ''; continue; }
    if (Math.random() < dt * 0.12) { c.wait = 1 + Math.random() * 3; c.art.style.transform = ''; continue; }
    const step = Math.min(d, c.speed * dt);
    el.style.left = (x + dx / d * step) + 'px';
    el.style.top = (y + dy / d * step) + 'px';
    c.art.style.transform = 'rotate(' + (dx / d * 9).toFixed(1) + 'deg)';
  }
  const iv = tickInterval();
  for (const c of state.creatures) {
    c.tk = (c.tk === undefined ? Math.random() * iv : c.tk) - dt;
    if (c.tk > 0) continue;
    c.tk += iv;
    const n = produceAmt(c);
    gain(n);
    if (c.el.style.display !== 'none') {
      const rr = c.el.getBoundingClientRect();
      floatText(rr.left - gr.left + rr.width / 2, rr.top - gr.top, '+' + fmt(n), 'pop-small');
      dropDNA(rr.left + rr.width / 2, rr.top + rr.height / 2, 1 + Math.min(3, Math.floor(c.level / 6)));
    }
  }
  if ((rainT -= dt) <= 0) { spawnRain(); rainT = 180 + Math.random() * 120; }
  if ((bubT -= dt) <= 0) { bubT = 0.7 + Math.random() * 1.3; spawnBubble(gr.height); }
  if (state.autoLevel > 0 && (autoT += dt) >= Math.max(1.5, 16 - state.autoLevel * 1.8 - (state.gu.gu_magnet || 0) * 1.5)) { autoT = 0; for (let k = 0; k < 1 + Math.floor(state.autoLevel / 3) + (state.gu.gu_magnet || 0); k++) pullPair(); }
  if ((rareT -= dt) <= 0 && !rare) { spawnRare(); rareT = (90 + Math.random() * 120) * Math.pow(0.92, state.rareLevel) * Math.pow(0.85, sgv('sg_rare')); }
  if (rare) { rare.el.style.display = rare.loc === currentLoc ? '' : 'none'; if (Date.now() > rare.until) { rare.el.remove(); rare = null; } }
  uiAcc += dt; saveAcc += dt;
  if (uiAcc >= 1) { uiAcc = 0; state.stats.time = (state.stats.time || 0) + 1;
  if (state.stats.time % 60 === 0) for (const k in state.buys) if (state.buys[k] > 0) state.buys[k]--;
  if (sgv('sg_gem') && state.stats.time % 60 === 0) state.gems += sgv('sg_gem'); lastCoins = state.coins; updateUI(); updateBonuses(); hintCheck(); tipCheck(); questCheck(); energy = Math.max(0, energy - 0.8); addEnergy(0); }
  if (saveAcc >= 5) { saveAcc = 0; save(); }
  requestAnimationFrame(tick);
}

sceneEl.className = 'scene';

gameEl.prepend(sceneEl);

// Старт
applyLang();
SHOP.forEach(it => { Object.assign(it, SHOP_META[it.key] || {}); if (state[it.key] === undefined) state[it.key] = 0; });

buildLocTabs();

const restored = load();
for (let i = 0; i < (state.capsules || 0); i++) makeCapsule();

startSpawnTimer();

if (state.settings.sound === undefined) state.settings.sound = true;
if (state.settings.hq === undefined) state.settings.hq = true;
if (state.settings.music === undefined) state.settings.music = true;

document.getElementById('lpHead').onclick = () => {
  const pnl = document.getElementById('locPanel');
  pnl.classList.toggle('collapsed');
};

document.querySelectorAll('[data-ic]').forEach(e => { e.innerHTML = IC(e.dataset.ic); });

sceneEl.innerHTML = SCENES[0];

applySettings();

buildBonuses();

offlineReward();

setTimeout(dailyReward, 3200);

[['btnShop', 'modalShop'], ['btnDex', 'modalDex'], ['btnInfo', 'modalInfo'], ['btnAscend', 'modalAscend'], ['btnAch', 'modalAch'], ['btnSettings', 'modalSettings']]
  .forEach(([b, m]) => { document.getElementById(b).onclick = () => openModal(m); });

document.querySelectorAll('[data-close]').forEach(b => { b.onclick = closeModals; });

document.querySelectorAll('.modal').forEach(m => m.addEventListener('pointerdown', e => { if (e.target === m) closeModals(); }));

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });

['pops', 'move', 'sound', 'hq', 'music', 'infgems'].forEach(k => {
  document.getElementById('set-' + k).onchange = e => { if (k === 'infgems') setInfGems(e.target.checked); else { state.settings[k] = e.target.checked; applySettings(); updateUI(); save(); } };
});

document.querySelectorAll('.tab').forEach(t => { t.onclick = () => {
  document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === t));
  document.querySelectorAll('.pane').forEach(p => p.classList.toggle('hidden', p.id !== t.dataset.pane));
}; });
document.getElementById('topBtn').onclick = showTop;
document.querySelectorAll('[data-lang]').forEach(b => { b.classList.toggle('active', b.dataset.lang === LANG); b.onclick = () => { store.set('lang', b.dataset.lang); location.reload(); }; });
document.getElementById('gemsOffBtn').onclick = () => setInfGems(false);
document.getElementById('resetBtn').onclick = () => {
  askConfirm('Удалить весь прогресс и начать заново?', () => { store.del('microbeEvolution'); location.reload(); });
};

requestAnimationFrame(tick);

if (!restored) {
  for (let i = 0; i < 4; i++) spawnCreature();
}
  
