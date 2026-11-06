// Задания дня: 3 случайных задания, награда в кристаллах
const QUEST_T = [
  ['merges', 'Слейте существ', n => 8 + n * 2],
  ['clicks', 'Кликните по существам', n => 30 + n * 6],
  ['earned', 'Заработайте ДНК', () => Math.round(Math.max(500, passiveRate() * 900))],
  ['bonuses', 'Используйте бонусы', () => 3],
  ['rare', 'Поймайте редкого гостя', () => 1],
  ['lucky', 'Совершите счастливые клики', () => 3],
  ['bought', 'Купите улучшения', () => 4]
];
const qProg = q => Math.max(0, Math.floor((state.stats[q.key] || 0) - q.base));
function ensureQuests() {
  const day = new Date().toISOString().slice(0, 10);
  if (state.quests.day === day && state.quests.list.length) return;
  const pool = QUEST_T.slice().sort(() => Math.random() - 0.5).slice(0, 3);
  state.quests = { day, chest: false, list: pool.map(([key, label, g]) => ({ key, label, goal: g(state.bestLevel), base: state.stats[key] || 0, claimed: false, done: false })) };
  save();
}
function questCheck() {
  ensureQuests();
  state.quests.list.forEach(q => {
    if (!q.done && qProg(q) >= q.goal) { q.done = true; showToast('✅ Задание выполнено! Награда в «Достижениях»'); sfx('quest'); updateAchBadge(); }
  });
}
function renderQuests() {
  ensureQuests();
  const box = document.getElementById('questList');
  box.innerHTML = '';
  state.quests.list.forEach(q => {
    const p = Math.min(qProg(q), q.goal), done = qProg(q) >= q.goal, d = document.createElement('div');
    d.className = 'ach' + (q.claimed ? ' got' : '');
    d.innerHTML = `<div class="ach-ico">📅</div><div class="ach-body"><div class="ach-title"><span>${q.label}</span> <small>${fmt(p)}/${fmt(q.goal)}</small></div><div class="ach-bar"><i style="width:${p / q.goal * 100}%"></i></div></div>`;
    const b = document.createElement('button');
    b.textContent = q.claimed ? '✔' : done ? 'Забрать 2 💎' : '2 💎';
    b.disabled = q.claimed || !done;
    b.onclick = () => {
      q.claimed = true; state.gems += 2;
      if (state.quests.list.every(x => x.claimed) && !state.quests.chest) { state.quests.chest = true; state.gems += 3; showToast('🎁 Все задания дня выполнены: +3 💎'); }
      renderQuests(); updateUI(); save();
    };
    d.appendChild(b);
    box.appendChild(d);
  });
}
