// Эффекты: звук, всплывающие числа, частицы, тосты

let actx;

function beep(f, d = 0.08, type = 'sine', v = 0.05) {
  if (!state.settings.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) {}
}

function bumpChip() {
  const chip = document.getElementById('coins').parentElement;
  chip.classList.remove('bump'); void chip.offsetWidth; chip.classList.add('bump');
}

// капли ДНК выпадают из существа и летят к счётчику (координаты окна)
function dropDNA(cx, cy, n, big, emoji, tid) {
  if (!state.settings.pops) return;
  const t = document.getElementById(tid || 'coins').getBoundingClientRect(), tx = t.left + t.width / 2, ty = t.top + t.height / 2;
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    d.className = 'dna-drop' + (big ? ' big' : '');
    d.textContent = emoji || '🧬';
    d.style.cssText = `left:${cx}px;top:${cy}px`;
    document.body.appendChild(d);
    const dx = (Math.random() - 0.5) * 100, up = -(30 + Math.random() * 40);
    const a = d.animate([
      { transform: 'translate(-50%,-50%) scale(.3)', opacity: 0 },
      { transform: `translate(calc(-50% + ${dx * 0.6}px),calc(-50% + ${up}px)) scale(1.15)`, opacity: 1, offset: 0.25 },
      { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${up + 55}px)) scale(1)`, opacity: 1, offset: 0.5 },
      { transform: `translate(calc(-50% + ${tx - cx}px),calc(-50% + ${ty - cy}px)) scale(.5)`, opacity: 0.9 }
    ], { duration: 950 + Math.random() * 300, delay: i * 70, easing: 'ease-in-out', fill: 'backwards' });
    a.onfinish = () => { d.remove(); bumpChip(); sfx('coin'); };
  }
}

function ripple(x, y, color) {
  const r = document.createElement('div');
  r.className = 'ring';
  r.style.cssText = `left:${x}px;top:${y}px;border-color:${color}`;
  gameEl.appendChild(r);
  r.animate([{ transform: 'translate(-50%,-50%) scale(.3)', opacity: 0.9 }, { transform: 'translate(-50%,-50%) scale(1.8)', opacity: 0 }], { duration: 500, easing: 'ease-out' });
  setTimeout(() => r.remove(), 500);
}

function spawnBubble(h) {
  if (gameEl.querySelectorAll('.bubble').length > 14) return;
  const b = document.createElement('div'), sz = 4 + Math.random() * 9;
  b.className = 'bubble';
  b.style.cssText = `left:${Math.random() * 100}%;bottom:-20px;width:${sz}px;height:${sz}px`;
  gameEl.appendChild(b);
  const a = b.animate([{ transform: 'translate(0,0)', opacity: 0 }, { opacity: 0.8, offset: 0.1 }, { transform: `translate(${(Math.random() - 0.5) * 60}px,-${h + 40}px)`, opacity: 0 }], { duration: 8000 + Math.random() * 6000, easing: 'linear' });
  a.onfinish = () => b.remove();
}

function floatText(x, y, text, cls) {
  if (!state.settings.pops) return;
  const e = document.createElement('div');
  e.className = 'coin-pop ' + cls;
  e.textContent = text;
  e.style.left = x + 'px';
  e.style.top = y + 'px';
  gameEl.appendChild(e);
  setTimeout(() => e.remove(), 900);
}

function burst(x, y, color, drops) {
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, d = document.createElement('div');
    d.className = 'spark';
    d.style.cssText = `left:${x}px;top:${y}px;background:${color}`;
    gameEl.appendChild(d);
    d.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * 80}px),calc(-50% + ${Math.sin(a) * 80}px)) scale(.2)`, opacity: 0 }], { duration: 650, easing: 'ease-out' });
    setTimeout(() => d.remove(), 650);
  }
  const r = document.createElement('div');
  r.className = 'ring';
  r.style.cssText = `left:${x}px;top:${y}px;border-color:${color}`;
  gameEl.appendChild(r);
  r.animate([{ transform: 'translate(-50%,-50%) scale(.2)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(2.6)', opacity: 0 }], { duration: 600, easing: 'ease-out' });
  setTimeout(() => r.remove(), 600);
  sfx('merge');
  if (drops) { const gr = gameEl.getBoundingClientRect(); dropDNA(gr.left + x, gr.top + y, drops); }
}

function showCoinPop(x, y, amount) {
  if (!state.settings.pops) return;
  const pop = document.createElement('div');
  pop.className = 'coin-pop';
  pop.textContent = '+' + fmt(Math.round(amount));
  pop.style.left = x + 'px';
  pop.style.top = y + 'px';
  gameEl.appendChild(pop);
  setTimeout(() => pop.remove(), 900);
}

function showToast(text) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  gameEl.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

function showDiscovery(level) {
  const L = LEVELS[level - 1], reward = 1 + Math.floor(level / 5);
  state.gems += reward;
  submitScore();
  sfx('discover');
  const d = document.createElement('div');
  d.className = 'discover';
  d.innerHTML = `<div class="rays"></div><div class="dc-card"><div class="dc-top">✨ Новый вид! ✨</div><div class="dc-art">${artSVG(level, 'dsc')}</div><div class="dc-name">${L.name}</div><div class="dc-desc">${DESC[level - 1]}</div><div class="dc-gem">+${reward} 💎</div><div class="dc-hint">Нажмите, чтобы продолжить</div></div>`;
  d.onclick = () => d.remove();
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 6000);
  updateUI(); save();
}

// Искры за курсором (не чаще раза в 45 мс)
let lastSparkle = 0;
document.addEventListener('pointermove', e => {
  const now = performance.now();
  if (now - lastSparkle < 45 || e.pointerType === 'touch' || !e.target.closest || !e.target.closest('#game')) return;
  lastSparkle = now;
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px`;
  document.body.appendChild(s);
  s.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 0.9 }, { transform: `translate(${(Math.random() - 0.5) * 24}px,${14 + Math.random() * 16}px) scale(.2)`, opacity: 0 }], { duration: 650 }).onfinish = () => s.remove();
});
