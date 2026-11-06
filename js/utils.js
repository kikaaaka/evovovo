// Формулы экономики и вспомогательные функции

const shade = (hex, t) => {
  const n = parseInt(hex.slice(1), 16), m = t < 0 ? 0 : 255, a = Math.abs(t);
  const ch = v => Math.round(v + (m - v) * a);
  return `rgb(${ch(n >> 16 & 255)},${ch(n >> 8 & 255)},${ch(n & 255)})`;
};

const val = l => Math.pow(2.1, l - 1);

const fmt = n => {
  n = Math.floor(n);
  for (const [v, u] of [[1e15, 'Qa'], [1e12, 'T'], [1e9, 'B'], [1e6, 'M'], [1e3, 'K']]) if (n >= v) return (n / v).toFixed(n / v < 10 ? 2 : 1) + u;
  return String(n);
};


const sgv = k => (state.sg && state.sg[k]) || 0;
const mult = () => Math.pow(1.15, state.rank || 0) * (1 + sgv('sg_mult') * 0.25);

const tickInterval = () => Math.max(1.2, 4 - state.speedLevel * 0.3) / (boostMul() * (1 + sgv('sg_tick') * 0.06));

const produceAmt = c => val(c.level) * (c.mut ? 3 : 1) * mult() * (1 + state.incomeLevel * 0.2) * (1 + state.gemMult * 0.25);




const boostMul = () => (Date.now() < boostUntil ? 3 : 1);

function locOf(level) { return Math.floor((level - 1) / 5); }

function gain(n) { state.coins += n; state.stats.earned += n; }

function passiveRate() { return state.creatures.reduce((sum, c) => sum + produceAmt(c), 0) / tickInterval(); }

// localStorage может быть недоступен (песочница, приватный режим): тогда игра работает без сохранений
const store = {
  get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  del: k => { try { localStorage.removeItem(k); } catch (e) {} }
};
