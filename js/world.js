// Локации

function buildLocTabs() {
  const box = document.getElementById('locTabs');
  LOCS.forEach((L, i) => {
    const b = document.createElement('button');
    b.className = 'loc-tab' + (i === 0 ? ' active' : '');
    b.id = 'loc' + i;
    b.onclick = () => setLoc(i);
    box.appendChild(b);
  });
}

function updateLocTabs() {
  const eternal = state.bestLevel >= LEVELS.length || (state.rank || 0) > 0, lastI = LOCS.length - 1;
  LOCS.forEach((L, i) => {
    const b = document.getElementById('loc' + i), last = i === lastI;
    const locked = last ? !eternal : (i > 0 && state.maxLevelReached <= i * 5);
    b.disabled = locked;
    b.title = L.name;
    b.style.display = last ? (state.maxLevelReached > 20 ? '' : 'none') : (i > 1 && state.maxLevelReached <= (i - 1) * 5 ? 'none' : '');
    b.innerHTML = IC(locked ? 'lock' : L.ic) + (locked ? '' : '<small>' + (last ? 'ур. ' + (25 + (state.rank || 0)) : countIn(i) + '/' + capacity()) + '</small>');
  });
  const lockedNow = currentLoc === lastI ? !eternal : (currentLoc > 0 && state.maxLevelReached <= currentLoc * 5);
  if (lockedNow) setLoc(0);
}

function setLoc(i) {
  currentLoc = i;
  gameEl.dataset.loc = i;
  document.querySelectorAll('.capsule').forEach(c => { c.style.display = i === 0 ? '' : 'none'; });
  musicSet(i);
  renderShrine();
  locBanner(i);
  sfx('whoosh');
  gameEl.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 350 });
  sceneEl.innerHTML = SCENES[i];
  state.creatures.forEach(c => { c.el.style.display = locOf(c.level) === i ? '' : 'none'; });
  LOCS.forEach((L, j) => {
    const b = document.getElementById('loc' + j);
    b.classList.toggle('active', j === i);
    if (j === i) b.classList.remove('new');
  });
}

function notifyNewLocation(i) {
  if (currentLoc !== i) document.getElementById('loc' + i).classList.add('new');
  showToast('🌊 Существо переплыло в новую локацию: ' + LOCS[i].name);
}

// Название локации при переходе
function locBanner(i) {
  const b = document.createElement('div');
  b.className = 'loc-banner';
  b.innerHTML = IC(LOCS[i].ic) + '<span>' + LOCS[i].name + '</span>';
  document.body.appendChild(b);
  b.animate([{ opacity: 0, transform: 'translate(-50%,12px)' }, { opacity: 1, transform: 'translate(-50%,0)', offset: 0.2 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }], { duration: 2200 }).onfinish = () => b.remove();
}
