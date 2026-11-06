// Магазин: улучшения, покупка существ, кристальный магазин

let shopBuilt = false;

const shopCost = it => Math.round(it.base * Math.pow(it.g || 1.5, state[it.key]));

function renderShop() {
  if (!shopBuilt) {
    shopBuilt = true;
    const list = document.getElementById('shopList');
    SHOP.forEach(it => {
      const d = document.createElement('div');
      d.className = 'shop-item up-card';
      d.style.setProperty('--c', it.color);
      d.innerHTML = `<div class="si-ico">${it.icon}</div><div class="si-body"><div class="shop-title">${it.title}</div><div class="shop-desc">${it.desc}</div><div class="sbar"><i id="bar-${it.key}"></i></div><div class="shop-lvl">Ур. <span id="lvl-${it.key}">0</span></div></div><button id="buy-${it.key}"></button>`;
      d.querySelector('button').onclick = () => {
        const c = shopCost(it);
        if (state.coins < c || (it.max && state[it.key] >= it.max) || state.bestLevel < (it.req || 0)) return;
        state.coins -= c;
        state[it.key]++;
        state.stats.bought++;
        if (it.key === 'spawnLevel') startSpawnTimer();
        updateUI(); save();
      };
      it.el = d;
      list.appendChild(d);
    });
  }
  const lockedReqs = SHOP.filter(i => state.bestLevel < (i.req || 0)).map(i => i.req), nextReq = lockedReqs.length ? Math.min(...lockedReqs) : -1;
  SHOP.forEach(it => {
    const req = it.req || 0, lock = state.bestLevel < req, c = shopCost(it), lv = state[it.key], b = document.getElementById('buy-' + it.key);
    const maxed = it.max && lv >= it.max;
    it.el.style.display = (!lock || req === nextReq) ? '' : 'none';
    it.el.classList.toggle('locked', lock);
    document.getElementById('lvl-' + it.key).textContent = lv + (it.max ? '/' + it.max : '');
    document.getElementById('bar-' + it.key).style.width = (it.max ? lv / it.max * 100 : Math.min(100, lv * 8)) + '%';
    b.textContent = lock ? '🔒 уровень ' + req : maxed ? 'Максимум' : fmt(c) + ' 🧬';
    b.disabled = lock || maxed || state.coins < c;
  });
}

const buyList = () => {
  const out = [];
  for (let l = 1; l <= shopMax(); l++) out.push({ lvl: l, cost: Math.round(60 * val(l)) });
  return out;
};

let BUYS = buyList();

let buyBuilt = false, capsuleReady = 0;

// цена в кристаллах: фиксированно ~0.8 за уровень (динозавр = 14, существо 25 уровня = 20)
function gemPrice(l) { return Math.ceil(l * 0.8); } // фиксированная цена, не растёт
function renderBuy() {
  const list = document.getElementById('buyList'), nb = buyList();
  if (nb.length !== BUYS.length) { BUYS = nb; buyBuilt = false; list.innerHTML = ''; }
  if (!buyBuilt) {
    buyBuilt = true;
    const card = (id, art, title, desc, btns) => {
      const d = document.createElement('div');
      d.className = 'shop-item creature-card';
      d.id = 'gw-' + id;
      d.style.setProperty('--c', '#9fd8ff');
      d.innerHTML = `<div class="si-art">${art}</div><div class="si-body"><div class="shop-title">${title}</div><div class="shop-desc">${desc}</div></div><div class="si-btns">${btns}</div>`;
      list.appendChild(d);
      return d;
    };
    card('capsule', '<span class="big">🎁</span>', 'Капсула', 'Бесплатное существо раз в 30 секунд', '<button id="gb-capsule"></button>').querySelector('button').onclick = () => {
      if (Date.now() >= capsuleReady && addCreature(Math.random() < 0.25 ? 2 : 1)) { capsuleReady = Date.now() + 30000; updateUI(); save(); }
    };
    BUYS.forEach(b => {
      const d = card('c' + b.lvl, artSVG(b.lvl, 'sb' + b.lvl), LEVELS[b.lvl - 1].name, 'Ур. ' + b.lvl + ' · ' + fmt(val(b.lvl)) + ' ДНК за такт · ' + LOCS[locOf(b.lvl)].name, `<button id="gb-c${b.lvl}"></button><button class="gem-b" id="gc-c${b.lvl}"></button>`);
      d.querySelector('#gb-c' + b.lvl).onclick = () => {
        if (state.coins >= buyCost(b.lvl) && addCreature(b.lvl)) { state.coins -= buyCost(b.lvl); state.buys[b.lvl] = (state.buys[b.lvl] || 0) + 1; state.stats.buyCreatures = (state.stats.buyCreatures || 0) + 1; updateUI(); save(); }
      };
      d.querySelector('#gc-c' + b.lvl).onclick = () => {
        if (state.gems >= gemPrice(b.lvl) && addCreature(b.lvl)) { state.gems -= gemPrice(b.lvl); state.gbuys[b.lvl] = (state.gbuys[b.lvl] || 0) + 1; state.stats.buyCreatures = (state.stats.buyCreatures || 0) + 1; updateUI(); save(); }
      };
    });
  }
  const left = Math.ceil((capsuleReady - Date.now()) / 1000), cb = document.getElementById('gb-capsule'), full0 = countIn(0) >= capacity();
  cb.textContent = full0 ? 'Нет места' : left > 0 ? 'Через ' + left + ' с' : 'Забрать';
  cb.disabled = full0 || left > 0;
  BUYS.forEach(b => {
    const full = countIn(locOf(b.lvl)) >= capacity(), bd = document.getElementById('gb-c' + b.lvl), bg = document.getElementById('gc-c' + b.lvl);
    bd.textContent = full ? 'Нет места' : fmt(buyCost(b.lvl)) + ' 🧬';
    bd.disabled = full || state.coins < buyCost(b.lvl);
    bg.textContent = full ? 'Нет места' : gemPrice(b.lvl) + ' 💎';
    bg.disabled = full || state.gems < gemPrice(b.lvl);
  });
}

let gemBuilt = false;

function renderGemShop() {
  const box = document.getElementById('gemList');
  if (!gemBuilt) {
    gemBuilt = true;
    const mk = (id, art, title, desc, fn) => {
      const d = document.createElement('div');
      d.className = 'shop-item creature-card';
      d.id = 'gw-' + id;
      d.style.setProperty('--c', '#b8e8ff');
      d.innerHTML = `<div class="si-art">${art}</div><div class="si-body"><div class="shop-title">${title}</div><div class="shop-desc">${desc}</div></div><button id="gg-${id}"></button>`;
      d.querySelector('button').onclick = () => { fn(); updateUI(); save(); };
      box.appendChild(d);
    };
    mk('ad1', '<span class="big">📺</span>', 'Реклама: +3 💎', 'Награда за просмотр, раз в 3 минуты', () => {
      if (Date.now() < adReady) return;
      showRewarded(() => { state.gems += 3; adReady = Date.now() + 180000; updateUI(); save(); });
    });
    GEMBUY.forEach(g => mk('c' + g.lvl, artSVG(g.lvl, 'gb' + g.lvl), LEVELS[g.lvl - 1].name, 'Ур. ' + g.lvl + ' · ' + LOCS[locOf(g.lvl)].name, () => {
      if (state.gems >= g.cost && addCreature(g.lvl)) state.gems -= g.cost;
    }));
    mk('mult', '<span class="big">🧬</span>', 'Золотой геном', '+25% ко всей ДНК навсегда, не сбрасывается', () => {
      const c = 15 + state.gemMult * 10;
      if (state.gemMult < 10 && state.gems >= c) { state.gems -= c; state.gemMult++; }
    });
  }
  GEMBUY.forEach(g => {
    document.getElementById('gw-c' + g.lvl).style.display = state.bestLevel >= g.lvl - 4 ? '' : 'none';
    const b = document.getElementById('gg-c' + g.lvl), full = countIn(locOf(g.lvl)) >= capacity();
    b.textContent = full ? 'Нет места' : g.cost + ' 💎';
    b.disabled = full || state.gems < g.cost;
  });
  const ab = document.getElementById('gg-ad1'), aleft = Math.ceil((adReady - Date.now()) / 1000);
  ab.textContent = aleft > 0 ? 'Через ' + aleft + ' с' : 'Смотреть';
  ab.disabled = aleft > 0;
  const cm = 15 + state.gemMult * 10, mb = document.getElementById('gg-mult');
  mb.textContent = state.gemMult >= 10 ? 'Максимум' : cm + ' 💎 (ур. ' + state.gemMult + ')';
  mb.disabled = state.gemMult >= 10 || state.gems < cm;
}

// цена существа растёт на 30% после каждой покупки (сбрасывается при престиже)
function buyCost(l) { return Math.round(60 * val(l) * Math.pow(1.3, state.buys[l] || 0)); }

// ---------- Особые улучшения за кристаллы (не сбрасываются престижем) ----------
let guBuilt = false;
function renderGU() {
  const box = document.getElementById('guList');
  if (!guBuilt) {
    guBuilt = true;
    GU.forEach(it => {
      const d = document.createElement('div');
      d.className = 'shop-item up-card';
      d.style.setProperty('--c', it.color);
      d.innerHTML = `<div class="si-ico">${it.icon}</div><div class="si-body"><div class="shop-title">${it.title}</div><div class="shop-desc">${it.desc}</div><div class="sbar"><i id="gubar-${it.key}"></i></div><div class="shop-lvl">Ур. <span id="gul-${it.key}">0</span>/${it.max}</div></div><button id="gub-${it.key}"></button>`;
      d.querySelector('button').onclick = () => {
        const l = state.gu[it.key] || 0, c = it.cost(l);
        if (l < it.max && state.gems >= c) { state.gems -= c; state.gu[it.key] = l + 1; updateUI(); save(); }
      };
      box.appendChild(d);
    });
  }
  GU.forEach(it => {
    const l = state.gu[it.key] || 0, c = it.cost(l), b = document.getElementById('gub-' + it.key);
    document.getElementById('gul-' + it.key).textContent = l;
    document.getElementById('gubar-' + it.key).style.width = l / it.max * 100 + '%';
    b.textContent = l >= it.max ? 'Максимум' : c + ' 💎';
    b.disabled = l >= it.max || state.gems < c;
  });
}

// Максимальный уровень существа в магазине: 80% от лучшего, +1 за каждое вознесение, не больше 25
function shopMax() { return Math.min(LEVELS.length, Math.max(6, Math.floor(state.bestLevel * 0.8)) + (state.rank || 0)); }
