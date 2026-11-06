// Достижения

const achVal = k => {
  if (k === 'best') return state.bestLevel;
  if (k === 'rank') return state.rank || 0;
  if (k === 'mutNow') return state.creatures.filter(c => c.mut).length;
  if (k === 'coinsNow') return state.coins;
  if (k === 'gemsNow') return state.gems;
  if (k === 'full') return Math.max(...LOCS.map((L, i) => countIn(i)));
  if (k === 'streak') return state.daily.streak;
  if (k === 'rareAll') return Object.keys(state.rareCaught).length;
  if (k === 'locs') return Math.floor((state.bestLevel - 1) / 5) + 1;
  return state.stats[k] || 0;
};

function updateAchBadge() {
  const n = ACH.filter(a => !state.ach[a.id] && achVal(a.key) >= a.n).length + state.quests.list.filter(q => !q.claimed && qProg(q) >= q.goal).length;
  document.getElementById('achLabel').textContent = 'Достижения' + (n ? ' (' + n + ')' : '');
  document.getElementById('btnAch').classList.toggle('alert', n > 0);
}

function renderAch() {
  const box = document.getElementById('achList');
  box.innerHTML = '';
  ACH.forEach(a => {
    const val = achVal(a.key), done = val >= a.n, got = state.ach[a.id];
    const d = document.createElement('div');
    d.className = 'ach' + (got ? ' got' : '');
    d.innerHTML = `<div class="ach-ico">${a.icon}</div><div class="ach-body"><div class="ach-title">${a.title}</div><div class="ach-bar"><i style="width:${Math.min(100, val / a.n * 100)}%"></i></div></div>`;
    const b = document.createElement('button');
    b.textContent = got ? '✔' : done ? 'Забрать ' + a.gems + ' 💎' : a.gems + ' 💎';
    b.disabled = got || !done;
    b.onclick = () => { state.ach[a.id] = true; state.gems += a.gems; renderAch(); updateUI(); save(); };
    d.appendChild(b);
    box.appendChild(d);
  });
}
