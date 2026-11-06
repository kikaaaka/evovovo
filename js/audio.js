// Звук: фоновая музыка (генерируется на лету, своя для каждой локации) и библиотека эффектов
let AC = null, master, sfxBus, musicBus, reverb, echo, sfxRev, ambBuf = null, musicTimer = null;
let audioUnlocked = false; // звук разрешён только после первого касания
function audioInit() {
  if (!AC && !audioUnlocked) return null;
  if (!AC) {
    try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    master = AC.createGain();
    const comp = AC.createDynamicsCompressor();
    master.connect(comp); comp.connect(AC.destination);
    sfxBus = AC.createGain(); sfxBus.connect(master);
    musicBus = AC.createGain(); musicBus.gain.value = 0; musicBus.connect(master);
    const len = AC.sampleRate * 2.6, buf = AC.createBuffer(2, len, AC.sampleRate);
    for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    reverb = AC.createConvolver(); reverb.buffer = buf;
    const rg = AC.createGain(); rg.gain.value = 0.55; reverb.connect(rg); rg.connect(musicBus);
    echo = AC.createDelay(2); echo.delayTime.value = 0.46;
    const fb = AC.createGain(), ef = AC.createBiquadFilter();
    fb.gain.value = 0.38; ef.type = 'lowpass'; ef.frequency.value = 1800;
    echo.connect(ef); ef.connect(fb); fb.connect(echo); ef.connect(musicBus);
    const sl = Math.floor(AC.sampleRate * 0.7), sb = AC.createBuffer(2, sl, AC.sampleRate);
    for (let c = 0; c < 2; c++) { const d = sb.getChannelData(c); for (let i = 0; i < sl; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / sl, 3); }
    sfxRev = AC.createConvolver(); sfxRev.buffer = sb;
    const sg = AC.createGain(); sg.gain.value = 0.22; sfxRev.connect(sg); sg.connect(sfxBus);
  }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
const N = s => 261.63 * Math.pow(2, s / 12); // нота: полутонов от До первой октавы
function tone(f, dur = 0.1, type = 'sine', vol = 0.05, glide = 0, delay = 0, pan) {
  if (!state.settings.sound || !audioInit()) return;
  f *= 1 + (Math.random() - 0.5) * 0.03;
  const t = AC.currentTime + delay, g = AC.createGain(), p = AC.createStereoPanner(), send = AC.createGain();
  p.pan.value = pan === undefined ? (Math.random() - 0.5) * 0.7 : pan;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * 0.7, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(p); p.connect(sfxBus); send.gain.value = 0.5; g.connect(send); send.connect(sfxRev);
  const rich = type !== 'square' && type !== 'sawtooth';
  [[1, 1, type], [1.006, 0.5, type], [2, rich ? 0.22 : 0, 'sine']].forEach(([m, a, ty]) => {
    if (!a) return;
    const o = AC.createOscillator(), og = AC.createGain();
    o.type = ty; o.frequency.setValueAtTime(f * m, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(20, glide * m), t + dur);
    og.gain.value = a; o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + 0.02);
  });
}
function noise(dur = 0.2, vol = 0.04, freq = 1200, delay = 0) {
  if (!state.settings.sound || !audioInit()) return;
  const t = AC.currentTime + delay, n = Math.floor(AC.sampleRate * dur), b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
  s.buffer = b; f.type = 'bandpass'; f.frequency.value = freq; g.gain.value = vol;
  s.connect(f); f.connect(g); g.connect(sfxBus); s.start(t);
}
function beep(f, d = 0.08, type = 'sine', v = 0.05) { tone(f, d, type, v); } // старые вызовы идут через новую шину
const SFX = {
  ui: () => tone(700, 0.05, 'triangle', 0.025, 520),
  click: l => { l = l || 1; const s = [0, 2, 4, 7, 9][l % 5] + 12 * Math.floor((l % 10) / 5); tone(N(s + 7), 0.14, 'triangle', 0.055, N(s + 6.8)); noise(0.03, 0.02, 3500); },
  lucky: () => [0, 4, 7, 12, 16, 19].forEach((s, i) => tone(N(s + 12), 0.2, 'triangle', 0.05, 0, i * 0.055)),
  pull: () => tone(280, 0.3, 'sawtooth', 0.02, 700),
  merge: () => { noise(0.3, 0.05, 500); tone(N(0), 0.25, 'sine', 0.08, N(12)); tone(N(12), 0.45, 'triangle', 0.05, 0, 0.1); tone(N(16), 0.45, 'triangle', 0.04, 0, 0.16); tone(N(19), 0.5, 'sine', 0.03, 0, 0.22); },
  coin: () => tone(1100 + Math.random() * 500, 0.08, 'square', 0.012, 1900),
  buy: () => { tone(N(12), 0.08, 'square', 0.028); tone(N(19), 0.22, 'square', 0.028, 0, 0.08); noise(0.05, 0.02, 5000, 0.08); },
  spawn: () => { tone(260, 0.16, 'sine', 0.06, 640); noise(0.05, 0.02, 900); },
  discover: () => [0, 4, 7, 12, 16, 24].forEach((s, i) => { tone(N(s + 12), 0.6, 'triangle', 0.06, 0, i * 0.13); tone(N(s), 0.6, 'sine', 0.04, 0, i * 0.13); }),
  rare: () => [12, 19, 24, 28, 31].forEach((s, i) => tone(N(s), 0.3, 'sine', 0.05, 0, i * 0.07)),
  rareSpawn: () => { tone(N(24), 0.5, 'sine', 0.04); tone(N(31), 0.6, 'sine', 0.03, 0, 0.12); },
  quest: () => { tone(N(12), 0.12, 'triangle', 0.05); tone(N(16), 0.12, 'triangle', 0.05, 0, 0.1); tone(N(19), 0.3, 'triangle', 0.05, 0, 0.2); },
  prestige: () => { noise(1.2, 0.05, 400); [0, 7, 12, 16, 19, 24].forEach((s, i) => tone(N(s), 1.1, 'triangle', 0.05, 0, i * 0.12)); },
  tick: i => tone(500 + ((i || 0) % 2) * 150, 0.035, 'square', 0.03),
  win: () => [0, 4, 7, 12, 16].forEach((s, i) => tone(N(s + 12), 0.35, 'triangle', 0.06, 0, i * 0.1)),
  harvest: () => { noise(0.9, 0.035, 1800); [0, 4, 7, 12].forEach((s, i) => tone(N(s + 12), 0.25, 'sine', 0.04, 0, i * 0.09)); },
  vortex: () => { noise(0.9, 0.05, 300); tone(160, 0.9, 'sine', 0.07, 640); },
  magnet: () => { tone(110, 1.2, 'sawtooth', 0.025, 330); tone(220, 1.2, 'sine', 0.04, 660); },
  beam: () => { tone(300, 0.35, 'sawtooth', 0.02, 900); tone(900, 0.35, 'sine', 0.02, 300, 0.02); },
  pop: () => tone(500 + Math.random() * 300, 0.09, 'sine', 0.06, 150),
  burst: () => { noise(0.6, 0.05, 2500); [0, 7, 12, 19, 24].forEach((s, i) => tone(N(s + 12), 0.3, 'sawtooth', 0.03, 0, i * 0.05)); },
  power: () => { tone(N(0), 0.5, 'sawtooth', 0.03, N(24)); tone(N(7), 0.5, 'sine', 0.04, N(31)); },
  ready: () => { tone(N(24), 0.1, 'sine', 0.035); tone(N(31), 0.18, 'sine', 0.035, 0, 0.09); },
  tip: () => tone(N(19), 0.12, 'sine', 0.04, N(24)),
  mutant: () => { tone(N(12), 0.6, 'sawtooth', 0.03, N(24)); tone(N(15), 0.6, 'sine', 0.04, N(27)); noise(0.3, 0.03, 3000); },
  combo: c => { const b = Math.min(c || 2, 6); [0, 4, 7].forEach((s, i) => tone(N(s + 12 + b * 2), 0.13, 'triangle', 0.05, 0, i * 0.045)); },
  whoosh: () => { noise(0.5, 0.045, 800); tone(200, 0.5, 'sine', 0.04, 500); }
};
const SFX_GAP = { coin: 45, click: 40, pop: 50, ui: 40, combo: 80, tick: 0 }, sfxLast = {};
function sfx(name, arg) {
  if (!state.settings.sound || !SFX[name]) return;
  const now = performance.now();
  if (SFX_GAP[name] !== undefined && now - (sfxLast[name] || 0) < SFX_GAP[name]) return;
  sfxLast[name] = now;
  try { SFX[name](arg); } catch (e) {}
}

// ---------- Музыка: у каждой локации своя гамма, тембр и темп ----------
const MODES = [
  { bar: 8.5, root: 0, scale: [0, 2, 4, 7, 9], chords: [[0, 7, 16], [5, 12, 16], [7, 14, 19], [2, 9, 16]], pad: 'sine', mel: 'triangle', cut: 1400, notes: 3 },
  { bar: 10, root: -4, scale: [0, 3, 5, 7, 10], chords: [[0, 7, 15], [-2, 5, 12], [3, 10, 15], [-4, 3, 10]], pad: 'triangle', mel: 'sine', cut: 700, notes: 2 },
  { bar: 7.5, root: 2, scale: [0, 2, 4, 6, 7, 9, 11], chords: [[0, 7, 14], [4, 11, 16], [6, 13, 18], [2, 9, 16]], pad: 'sine', mel: 'triangle', cut: 2200, notes: 4 },
  { bar: 8, root: -2, scale: [0, 2, 4, 5, 7, 9, 11], chords: [[0, 7, 16], [5, 12, 17], [7, 14, 19], [4, 11, 16]], pad: 'triangle', mel: 'triangle', cut: 1800, notes: 3 },
  { bar: 11, root: -7, scale: [0, 2, 7, 9, 12], chords: [[0, 7, 14], [2, 9, 16], [-3, 4, 11], [0, 5, 12]], pad: 'sine', mel: 'sine', cut: 2600, notes: 2 }
];
let musicLoc = 0, musicBarN = 0, nextBar = 0;
const musicWanted = () => state.settings.music !== false;
function musicSet(i) { musicLoc = i % MODES.length; }
function padNote(f, t, dur, M, v = 1) {
  [-7, 7].forEach((det, i) => {
    const o = AC.createOscillator(), g = AC.createGain(), fl = AC.createBiquadFilter(), p = AC.createStereoPanner(), lfo = AC.createOscillator(), lg = AC.createGain();
    o.type = M.pad; o.frequency.value = f; o.detune.value = det;
    lfo.frequency.value = 0.12 + Math.random() * 0.2; lg.gain.value = 9; lfo.connect(lg); lg.connect(o.detune);
    p.pan.value = i ? 0.55 : -0.55;
    const c0 = M.cut + Math.min(1500, state.bestLevel * 40) + (Date.now() < luckUntil ? 1200 : 0);
    fl.type = 'lowpass'; fl.frequency.setValueAtTime(c0 * 0.45, t); fl.frequency.linearRampToValueAtTime(c0, t + dur * 0.5); fl.frequency.linearRampToValueAtTime(c0 * 0.5, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.045 * v, t + 2.4); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(fl); fl.connect(g); g.connect(p); p.connect(musicBus); p.connect(reverb);
    o.start(t); lfo.start(t); o.stop(t + dur + 0.1); lfo.stop(t + dur + 0.1);
  });
}
function melNote(f, t, M) {
  const o = AC.createOscillator(), o2 = AC.createOscillator(), g = AC.createGain(), p = AC.createStereoPanner(), vel = 0.03 + Math.random() * 0.04;
  o.type = M.mel; o.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f * 2; p.pan.value = Math.random() * 1.4 - 0.7;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vel, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
  o.connect(g); o2.connect(g); g.connect(p); p.connect(musicBus); p.connect(reverb); p.connect(echo);
  o.start(t); o2.start(t); o.stop(t + 1.7); o2.stop(t + 1.7);
}
function ambience(t, len) {
  if (!ambBuf) { ambBuf = AC.createBuffer(1, AC.sampleRate * 4, AC.sampleRate); let l = 0; const d = ambBuf.getChannelData(0); for (let i = 0; i < d.length; i++) { l = (l + (Math.random() * 2 - 1) * 0.02) * 0.985; d[i] = l * 8; } }
  const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(), p = AC.createStereoPanner();
  s.buffer = ambBuf; s.loop = true; f.type = 'bandpass'; f.frequency.value = [500, 260, 700, 900, 340, 420][musicLoc]; f.Q.value = 0.8;
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05, t + len * 0.5); g.gain.linearRampToValueAtTime(0.0001, t + len + 1);
  p.pan.setValueAtTime(-0.5, t); p.pan.linearRampToValueAtTime(0.5, t + len);
  s.connect(f); f.connect(g); g.connect(p); p.connect(musicBus); p.connect(reverb); s.start(t); s.stop(t + len + 1.2);
  for (let k = 0; k < 3 + Math.floor(Math.random() * 4); k++) {
    const w = t + Math.random() * len, o = AC.createOscillator(), og = AC.createGain(), op = AC.createStereoPanner();
    o.type = 'sine'; op.pan.value = Math.random() * 1.6 - 0.8; og.gain.setValueAtTime(0.0001, w);
    if (musicLoc >= 4) { o.frequency.setValueAtTime(2000 + Math.random() * 2500, w); og.gain.exponentialRampToValueAtTime(0.012, w + 0.01); og.gain.exponentialRampToValueAtTime(0.0001, w + 1.4); }
    else if (musicLoc === 3) { o.frequency.setValueAtTime(2200, w); o.frequency.exponentialRampToValueAtTime(3200, w + 0.08); o.frequency.exponentialRampToValueAtTime(2400, w + 0.16); og.gain.exponentialRampToValueAtTime(0.012, w + 0.03); og.gain.exponentialRampToValueAtTime(0.0001, w + 0.2); }
    else { const b = 350 + Math.random() * 500; o.frequency.setValueAtTime(b, w); o.frequency.exponentialRampToValueAtTime(b * 2.6, w + 0.09); og.gain.exponentialRampToValueAtTime(0.02, w + 0.02); og.gain.exponentialRampToValueAtTime(0.0001, w + 0.12); }
    o.connect(og); og.connect(op); op.connect(musicBus); op.connect(reverb); o.start(w); o.stop(w + 1.5);
  }
}
function scheduleBar(t) {
  const M = MODES[musicLoc], hot = Date.now() < luckUntil, ch = M.chords[musicBarN++ % M.chords.length], len = M.bar * (hot ? 0.8 : 1);
  ch.forEach(s => padNote(N(M.root + s - 12), t, len + 3, M));
  padNote(N(M.root + ch[0] - 24), t, len + 1.5, M, 0.5);
  const cnt = M.notes + (hot ? 4 : 0) + Math.floor(Math.min(3, state.bestLevel / 8));
  for (let k = 0; k < cnt; k++) {
    const when = t + (k + Math.random() * 0.6) * (len / cnt), deg = M.scale[Math.floor(Math.random() * M.scale.length)];
    melNote(N(M.root + deg + (Math.random() < 0.35 ? 12 : 0) + 12), when, M);
  }
  ambience(t, len);
  nextBar = t + len;
}
function musicLoop() {
  if (!AC || !musicWanted() || AC.state !== 'running') return;
  while (nextBar < AC.currentTime + 1.5) scheduleBar(Math.max(nextBar, AC.currentTime + 0.1));
}
function applyAudioSettings() {
  const mv = document.getElementById('set-mvol');
  if (mv) mv.value = Math.round((state.settings.mvol === undefined ? 0.5 : state.settings.mvol) * 100);
  if (AC) musicBus.gain.setTargetAtTime(musicWanted() ? (state.settings.mvol === undefined ? 0.5 : state.settings.mvol) * 0.9 : 0, AC.currentTime, 0.4);
}
function audioStart() { // запускается после первого касания (требование браузеров)
  audioUnlocked = true;
  if (!audioInit()) return;
  if (!musicTimer) { nextBar = AC.currentTime + 0.3; musicTimer = setInterval(musicLoop, 400); }
  applyAudioSettings(); musicLoop();
}
window.addEventListener('pointerdown', audioStart, { once: true });
window.addEventListener('keydown', audioStart, { once: true });
document.addEventListener('visibilitychange', () => { if (AC) { if (document.hidden) AC.suspend(); else AC.resume(); } });
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('button');
  if (b && !b.closest('#bonuses')) sfx(b.closest('.shop-item') ? 'buy' : 'ui');
});
const mvolEl = document.getElementById('set-mvol');
mvolEl.addEventListener('input', e => { state.settings.mvol = e.target.value / 100; applyAudioSettings(); });
mvolEl.addEventListener('change', () => save());

MODES.push({ bar: 12, root: -5, scale: [0, 4, 7, 11, 14], chords: [[0, 7, 16], [4, 11, 19], [-1, 6, 14], [2, 9, 16]], pad: 'sine', mel: 'sine', cut: 3000, notes: 2 });
