// Существа: появление, движение, клики, слияние

function getCreatureSize(level) {
  return (94 + Math.floor((level - 1) / 5) * 11 + ((level - 1) % 5) * 17) * (innerWidth < 640 ? 0.72 : 1);
}

function createCreature(level, x, y, mut) {
  const fresh = mut === undefined;
  if (fresh) mut = mutCharges > 0 ? (mutCharges--, true) : Math.random() < (level >= 2 ? 0.04 : 0.02) + state.mutLevel * 0.01;
  if (mut && fresh) { showToast('🌟 Мутант! Приносит ×3 ДНК'); sfx('mutant'); state.stats.mut = (state.stats.mut || 0) + 1; }
  const el = document.createElement('div');
  el.className = 'creature';
  el.classList.toggle('mutant', !!mut);
  el.classList.toggle('early', level <= 11);
  el.dataset.id = nextId++;
  el.dataset.level = level;
  const size = getCreatureSize(level);
  el.style.width = size + 'px';
  el.style.height = size + 'px';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.setProperty('--s', size + 'px');
  el.style.setProperty('--bd', (-Math.random() * 3).toFixed(2) + 's');
  const col = LEVELS[level - 1].color, gid = 'g' + el.dataset.id;
  const defs = `<defs><radialGradient id="${gid}" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="${shade(col, 0.5)}"/><stop offset=".55" stop-color="${col}"/><stop offset="1" stop-color="${shade(col, -0.4)}"/></radialGradient></defs>`;
  el.innerHTML =
    uniq('<svg class="art" viewBox="0 0 100 100">' + defs + '<g class="body"><g class="lit">' + ART[level - 1](`url(#${gid})`, col) + '</g></g></svg>');
  el.style.display = locOf(level) === currentLoc ? '' : 'none';

  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointerenter', () => { el.dataset.hover = '1'; });
  el.addEventListener('pointerleave', () => { delete el.dataset.hover; const c = state.creatures.find(c => c.el === el); if (c) c.wait = Math.max(c.wait, 0.6); });
  gameEl.appendChild(el);

  state.creatures.push({ id: el.dataset.id, level, el, mut, art: el.querySelector('.art'), speed: 14 + Math.random() * 12, wait: Math.random() * 2 });
  if (level > state.bestLevel) state.bestLevel = level;
  return el;
}

function removeCreature(id) {
  const idx = state.creatures.findIndex(c => c.id == id);
  if (idx !== -1) {
    state.creatures[idx].el.remove();
    state.creatures.splice(idx, 1);
  }
}

function getSpawnInterval() {
  return Math.max(6000, 22000 - state.spawnLevel * 1000) * (1 + countIn(0) / 20);
}

function spawnCreature() {
  if (countIn(0) >= capacity()) return;
  const rect = gameEl.getBoundingClientRect();
  const shopRect = document.getElementById('shop').getBoundingClientRect();
  const pad = 36;
  const shopOverlap = Math.max(0, rect.bottom - shopRect.top);

  let level = 1;
  if (Math.random() < state.chanceLevel * 0.06) level = 2;
  const size = getCreatureSize(level);

  const minX = pad;
  const minY = pad;
  const maxX = rect.width - size - pad;
  const maxY = rect.height - size - pad - shopOverlap;

  const x = minX + Math.random() * Math.max(0, maxX - minX);
  const y = minY + Math.random() * Math.max(0, maxY - minY);

  createCreature(level, x, y);
  ripple(x + size / 2, y + size / 2, LEVELS[level - 1].color);
  sfx('spawn');
  if (Math.random() < state.twinLevel * 0.06 && countIn(0) < capacity()) {
    const q = randomPos(getCreatureSize(1));
    createCreature(1, q.x, q.y);
  }
  save();
}

function startSpawnTimer() {
  clearTimeout(spawnTimer);
  spawnTimer = setTimeout(() => { spawn(); startSpawnTimer(); }, getSpawnInterval());
}

function addCreature(level) {
  if (countIn(locOf(level)) >= capacity()) return false;
  const pos = randomPos(getCreatureSize(level));
  createCreature(level, pos.x, pos.y);
  return true;
}

function randomPos(size) {
  const r = gameEl.getBoundingClientRect();
  const shopTop = document.getElementById('shop').getBoundingClientRect().top;
  const maxX = r.width - size - 36, maxY = Math.min(r.height, shopTop - r.top) - size - 36;
  return { x: 36 + Math.random() * Math.max(0, maxX - 36), y: 36 + Math.random() * Math.max(0, maxY - 36) };
}

function pullPair() {
  const by = {};
  state.creatures.forEach(c => {
    if (locOf(c.level) !== currentLoc || c.el.classList.contains('merging') || c.el.classList.contains('dragging') || c.wait > 1.2) return;
    (by[c.level] = by[c.level] || []).push(c);
  });
  const lv = Object.keys(by).filter(l => by[l].length >= 2);
  if (!lv.length) return;
  const g = by[lv[Math.floor(Math.random() * lv.length)]], a = g[0], b = g[1];
  a.wait = b.wait = 2;
  beam(a.el, b.el);
  a.tx = b.tx = undefined;
  const el = a.el;
  el.style.transition = 'left .6s ease-in, top .6s ease-in';
  el.style.left = b.el.style.left;
  el.style.top = b.el.style.top;
  setTimeout(() => { el.style.transition = ''; checkMerge(el); }, 650);
}

function creatureClick(el, px, py) {
  const c = state.creatures.find(c => c.el === el);
  if (!c) return;
  const mate = state.creatures.find(o => o !== c && o.level === c.level && o.el.style.display !== 'none' && !o.el.classList.contains('merging') &&
    Math.hypot(parseFloat(o.el.style.left) - parseFloat(el.style.left), parseFloat(o.el.style.top) - parseFloat(el.style.top)) < el.offsetWidth * 1.4);
  if (mate) {
    mate.wait = c.wait = 2; mate.tx = c.tx = undefined;
    mate.el.style.transition = 'left .35s ease-in, top .35s ease-in';
    mate.el.style.left = el.style.left; mate.el.style.top = el.style.top;
    sfx('pull');
    setTimeout(() => { mate.el.style.transition = ''; checkMerge(el); }, 380);
    return;
  }
  const lucky = Math.random() < 0.05 + state.luckyLevel * 0.02 + (Date.now() < luckBoostUntil ? 0.45 : 0) + (state.gu.gu_lucky || 0) * 0.03;
  let v = val(c.level) * 1.5 * (c.mut ? 3 : 1) * mult() * (1 + state.clickLevel * 0.25) * (1 + state.gemMult * 0.25) * burstMult() * (1 + sgv('sg_click') * 0.5);
  v = Math.max(1, Math.round(lucky ? v * 10 : v));
  gain(v);
  addEnergy(2.2 + state.energyLevel * 0.6);
  state.stats.clicks++;
  if (lucky) state.stats.lucky++;
  const r = gameEl.getBoundingClientRect();
  floatText(px - r.left, py - r.top, (lucky ? '🍀 +' : '+') + fmt(v), lucky ? 'pop-lucky' : 'pop-click');
  el.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.2,.8)' }, { transform: 'scale(.92,1.12)' }, { transform: 'scale(1,1)' }], { duration: 280 });
  ripple(px - r.left, py - r.top, lucky ? '#ffd23f' : '#9ff0e0');
  dropDNA(px, py, lucky ? 9 : 3, lucky);
  sfx('click', c.level);
  if (lucky) {
    sfx('lucky');
    gameEl.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-4px,2px)' }, { transform: 'translate(4px,-2px)' }, { transform: 'translate(0,0)' }], { duration: 220 });
  }
  updateUI();
}

function onPointerDown(e) {
  if (isDragging) return;
  e.preventDefault();
  isDragging = true;
  dragEl = e.currentTarget;
  clickStart = { x: e.clientX, y: e.clientY };
  lastAction = Date.now();
  dragEl.setPointerCapture(e.pointerId);

  const rect = dragEl.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  dragEl.addEventListener('pointermove', onPointerMove);
  dragEl.addEventListener('pointerup', onPointerUp);
  dragEl.addEventListener('pointercancel', onPointerUp);
}

function onPointerMove(e) {
  if (!isDragging) return;
  if (!dragEl.classList.contains('dragging')) {
    if (Math.hypot(e.clientX - clickStart.x, e.clientY - clickStart.y) < 8) return;
    dragEl.classList.add('dragging');
  }
  const gameRect = gameEl.getBoundingClientRect();
  let x = e.clientX - gameRect.left - offsetX;
  let y = e.clientY - gameRect.top - offsetY;

  const size = dragEl.offsetWidth;
  x = Math.max(0, Math.min(x, gameRect.width - size));
  y = Math.max(0, Math.min(y, gameRect.height - size));

  dragEl.style.left = x + 'px';
  dragEl.style.top = y + 'px';
}

function onPointerUp(e) {
  if (!isDragging) return;
  isDragging = false;
  dragEl.classList.remove('dragging');
  dragEl.releasePointerCapture(e.pointerId);

  dragEl.removeEventListener('pointermove', onPointerMove);
  dragEl.removeEventListener('pointerup', onPointerUp);
  dragEl.removeEventListener('pointercancel', onPointerUp);

  const isClick = Math.hypot(e.clientX - clickStart.x, e.clientY - clickStart.y) < 8;
  if (isClick) creatureClick(dragEl, e.clientX, e.clientY); else checkMerge(dragEl);
  save();
  dragEl = null;
}

function checkMerge(el) {
  if (!el || el.classList.contains('merging')) return;
  const level = parseInt(el.dataset.level);
  const rect1 = el.getBoundingClientRect();

  for (let c of state.creatures) {
    if (c.el === el) continue;
    if (c.level !== level) continue;
    if (c.el.classList.contains('merging')) continue;

    const rect2 = c.el.getBoundingClientRect();
    const size1 = el.offsetWidth / 2;
    const size2 = c.el.offsetWidth / 2;
    const dx = (rect1.left + size1) - (rect2.left + size2);
    const dy = (rect1.top + size1) - (rect2.top + size2);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < (size1 + size2) * 0.7) {
      const newLevel = level + 1;
      if (newLevel > LEVELS.length) { ascendPair(el, c); return; }

      const x = (parseFloat(el.style.left) + parseFloat(c.el.style.left)) / 2;
      const y = (parseFloat(el.style.top) + parseFloat(c.el.style.top)) / 2;

      const id1 = el.dataset.id;
      const id2 = c.id;
      el.classList.add('merging');
      c.el.classList.add('merging');

      setTimeout(() => {
        const isNew = newLevel > state.bestLevel;
        burst(x + getCreatureSize(level) / 2, y + getCreatureSize(level) / 2, LEVELS[newLevel - 1].color, 6);
        removeCreature(id1);
        removeCreature(id2);
        if (locOf(newLevel) !== locOf(level)) {
          const pos = randomPos(getCreatureSize(newLevel));
          createCreature(newLevel, pos.x, pos.y);
          notifyNewLocation(locOf(newLevel));
        } else {
          createCreature(newLevel, x, y);
        }

        const base = val(level) * 3;
        let earned = base * (1 + state.coinLevel * 0.25) * mult() * (1 + state.gemMult * 0.25);
        if (Math.random() < state.luckLevel * 0.04) earned *= 2;
        const nowT = Date.now();
        combo = nowT - lastMerge < 5000 + state.comboLevel * 800 ? Math.min(combo + 1, 6) : 1;
        lastMerge = nowT;
        earned *= 1 + (combo - 1) * (0.25 + state.comboLevel * 0.03);
        if (combo > 1) floatText(x + getCreatureSize(newLevel) / 2, y - 34, '🔥 Комбо ×' + combo, 'pop-lucky');
        earned *= burstMult();
        if (combo > 1) sfx('combo', combo);
        state.stats.maxCombo = Math.max(state.stats.maxCombo || 0, combo);
        gain(earned);
        showCoinPop(x + getCreatureSize(newLevel) / 2, y, earned);
        state.stats.merges++;
        addEnergy(6);
        if (isNew) showDiscovery(newLevel);

        if (newLevel > state.maxLevelReached) {
          state.maxLevelReached = newLevel;
        }

        updateUI();
        save();
      }, 280);

      return;
    }
  }
}

function countIn(loc) { return state.creatures.filter(c => locOf(c.level) === loc).length + (loc === 0 ? document.querySelectorAll('.capsule').length : 0); } // капсулы занимают место, как существа

function capacity() { return 18; }

// Новые существа появляются в капсулах: нужно кликнуть, чтобы открыть
function makeCapsule() {
  const pos = randomPos(58), el = document.createElement('div');
  el.className = 'capsule';
  el.style.left = pos.x + 'px';
  el.style.top = pos.y + 'px';
  el.style.display = currentLoc === 0 ? '' : 'none';
  el.innerHTML = '<svg viewBox="0 0 60 60"><defs><radialGradient id="capG" cx=".35" cy=".3"><stop offset="0" stop-color="#e8fff8" stop-opacity=".9"/><stop offset=".6" stop-color="#4fd8b0" stop-opacity=".55"/><stop offset="1" stop-color="#1a8a7a" stop-opacity=".85"/></radialGradient></defs><circle cx="30" cy="30" r="26" fill="url(#capG)" stroke="#bffff0" stroke-opacity=".7" stroke-width="2"/><path d="M22 14c0 9 16 9 16 18s-16 9-16 18M38 14c0 9-16 9-16 18s16 9 16 18M24 24h12M24 40h12" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="21" cy="17" rx="7" ry="4" fill="#fff" opacity=".45" transform="rotate(-30 21 17)"/></svg>';
  el.addEventListener('pointerdown', ev => { ev.stopPropagation(); openCapsule(el); });
  gameEl.appendChild(el);
  const ao = state.gu.gu_auto || 0;
  if (ao) { const iv = setInterval(() => { if (!el.isConnected) clearInterval(iv); else openCapsule(el); }, (ao >= 2 ? 5 : 10) * 1000); }
}
function openCapsule(el) {
  if (el.dataset.o) return;
  el.dataset.o = 1;
  pendingOpen++;
  const x = parseFloat(el.style.left), y = parseFloat(el.style.top);
  el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3) rotate(8deg)' }, { transform: 'scale(.2)', opacity: 0 }], { duration: 320 });
  burst(x + 29, y + 29, '#7fffd4');
  sfx('pop');
  setTimeout(() => {
    el.remove();
    pendingOpen--;
    const level = Math.random() < state.chanceLevel * 0.06 ? 2 : 1;
    createCreature(level, Math.max(0, x - 8), Math.max(0, y - 8));
    if (Math.random() < state.twinLevel * 0.06 && countIn(0) < capacity()) { const p = randomPos(getCreatureSize(1)); createCreature(1, p.x, p.y); }
    state.stats.opened = (state.stats.opened || 0) + 1;
    updateUI(); save();
  }, 300);
}
function spawn() {
  if (countIn(0) >= capacity()) return; // капсулы и существа делят одни и те же места
  makeCapsule();
  sfx('spawn');
}
