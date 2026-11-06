// Облачные сохранения и таблица лидеров Яндекс Игр (работает, когда подключён SDK)
let cloudPlayer = null, lbReady = null, cloudDirty = false, cloudAt = 0;
function cloudInit(sdk) {
  sdk.getPlayer().then(p => { cloudPlayer = p; return p.getData(['save']); }).then(d => {
    const raw = d && d.save;
    if (!raw) { cloudDirty = true; return; }
    let cloud;
    try { cloud = JSON.parse(raw); } catch (e) { return; }
    const local = JSON.parse(store.get('microbeEvolution') || '{}');
    if ((cloud.lastSeen || 0) > (local.lastSeen || 0) + 5000) { store.set('microbeEvolution', raw); location.reload(); }
    else cloudDirty = true;
  }).catch(() => {});
  sdk.getLeaderboards().then(lb => { lbReady = lb; }).catch(() => {});
}
function cloudSync(force) {
  if (!cloudPlayer || (!cloudDirty && !force) || (!force && Date.now() - cloudAt < 30000)) return;
  cloudAt = Date.now(); cloudDirty = false;
  cloudPlayer.setData({ save: store.get('microbeEvolution') }).catch(() => { cloudDirty = true; });
}
setInterval(cloudSync, 15000);
document.addEventListener('visibilitychange', () => { if (document.hidden) cloudSync(true); });
const myScore = () => state.bestLevel * 100 + Math.min(99, state.rank || 0);
function submitScore() { if (lbReady) lbReady.setLeaderboardScore('evolution', myScore()).catch(() => {}); }
function showTop() {
  openModal('modalTop');
  const box = document.getElementById('topList');
  box.textContent = 'Загрузка...';
  if (!lbReady) { box.textContent = 'Рейтинг доступен на Яндекс Играх. Ваш результат: ' + myScore(); return; }
  submitScore();
  lbReady.getLeaderboardEntries('evolution', { quantityTop: 10, includeUser: true, quantityAround: 2 }).then(r => {
    box.innerHTML = r.entries.map(e => `<div class="row"><span>${e.rank}. ${e.player.publicName || 'Игрок'}</span><b>${e.score}</b></div>`).join('') || 'Пока пусто';
  }).catch(() => { box.textContent = 'Не удалось загрузить рейтинг'; });
}
