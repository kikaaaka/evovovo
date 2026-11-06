// Графика: SVG-рисунки существ, иконки, сцены локаций

// ---------- Рисунки существ (SVG 100x100) ----------
const k = (w = 3) => `stroke="#24304a" stroke-opacity=".85" stroke-width="${w * 0.6}" stroke-linecap="round" stroke-linejoin="round"`;

const dot = (x, y, r, f, o = 0.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" opacity="${o}"/>`;

const hi = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity="0.4"/>`;

const path = (d, f, w = 3) => `<path d="${d}" fill="${f}" ${k(w)}/>`;

const limb = (d, w, col) => `<g class="wag"><path d="${d}" fill="none" stroke="#24304a" stroke-width="${w + 3}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/></g>`;

const ART = [
  // 1 Микроб: шипастый шарик с бусинами
  c => {
    let o = '';
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6, x1 = 50 + 33 * Math.cos(a), y1 = 50 + 33 * Math.sin(a);
      const x2 = 50 + 45 * Math.cos(a), y2 = 50 + 45 * Math.sin(a);
      o += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${k()}/><circle cx="${x2}" cy="${y2}" r="4.5" fill="#ff9ec7" ${k(2.5)}/>`;
    }
    return `<g class="spk">${o}</g>` + `<circle cx="50" cy="50" r="34" fill="${c}" ${k()}/>` + hi(34, 32, 11, 6) + dot(70, 70, 4, '#24304a', .25) + dot(26, 68, 3, '#24304a', .25);
  },
  // 2 Бактерия: палочка с жгутиком и ворсинками
  c => {
    let o = `<path class="flag" d="M10 52 C-2 38 -8 66 -22 50" fill="none" ${k()}/>`;
    for (const x of [24, 40, 60, 76]) o += `<line x1="${x}" y1="28" x2="${x}" y2="19" ${k(2.5)}/><line x1="${x}" y1="72" x2="${x}" y2="81" ${k(2.5)}/>`;
    return o + `<rect x="8" y="26" width="84" height="48" rx="24" fill="${c}" ${k()}/>` + hi(30, 35, 14, 5) +
      `<path d="M26 68 q8 -8 16 0 t16 0 t14 0" fill="none" stroke="#24304a" stroke-width="2" opacity=".3"/>`;
  },
  // 3 Амёба: желе с ложноножками, ядром и вакуолями
  c => path('M50 10 C66 6 74 20 88 22 C100 28 94 46 92 56 C96 72 80 86 66 88 C54 96 40 92 30 86 C14 84 6 68 10 54 C0 44 10 26 24 20 C32 12 40 14 50 10Z', c) +
    hi(32, 28, 12, 6) + `<circle cx="70" cy="70" r="9" fill="#ffc861" ${k(2.5)}/>` + dot(70, 70, 3, '#24304a', .35) +
    `<circle cx="22" cy="62" r="4" fill="#fff" opacity=".7" ${k(1.5)}/><circle cx="82" cy="40" r="3" fill="#fff" opacity=".7" ${k(1.5)}/>`,
  // 4 Инфузория: туфелька с ресничками
  c => {
    let o = '<g transform="rotate(-12 50 50)"><g class="spk">';
    for (let j = 0; j < 26; j++) {
      const t = j * 2 * Math.PI / 26, px = 50 + 44 * Math.cos(t), py = 50 + 30 * Math.sin(t);
      o += `<line x1="${px}" y1="${py}" x2="${px + 7 * Math.cos(t)}" y2="${py + 7 * Math.sin(t)}" ${k(2)}/>`;
    }
    return o + '</g>' + `<ellipse cx="50" cy="50" rx="44" ry="30" fill="${c}" ${k()}/>` +
      `<path d="M62 62 q10 8 22 2" fill="none" ${k(2.5)}/><ellipse cx="34" cy="64" rx="8" ry="5" fill="#ffab5e" ${k(2)}/>` +
      dot(76, 46, 4, '#fff', .7) + hi(32, 34, 13, 5) + '</g>';
  },
  // 5 Водоросль: зелёная клетка с хлоропластами и жгутиками
  c => `<path class="flag" d="M44 20 C38 8 50 4 42 -8" fill="none" ${k()}/><path class="flag" d="M57 20 C63 8 51 4 59 -8" fill="none" ${k()}/>` +
    `<circle cx="50" cy="52" r="34" fill="${c}" ${k()}/>` + hi(34, 36, 11, 6) +
    `<ellipse cx="30" cy="66" rx="7" ry="5" fill="#4fb56f" ${k(2)}/><ellipse cx="70" cy="66" rx="7" ry="5" fill="#4fb56f" ${k(2)}/><ellipse cx="50" cy="78" rx="6" ry="4" fill="#4fb56f" ${k(2)}/>`,
  // 6 Эвглена: веретено с длинным жгутом и красным глазком
  c => `<path class="flag" d="M14 50 C2 42 4 26 -10 20 C-18 16 -14 4 -24 0" fill="none" ${k()}/>` +
    path('M14 50 C14 24 40 20 62 26 C84 32 92 50 86 62 C78 80 40 82 24 72 C16 66 14 58 14 50Z', c) + hi(36, 34, 14, 5) +
    `<circle cx="76" cy="38" r="4.5" fill="#ff5a5a" ${k(2)}/>` + dot(30, 66, 4, '#4fb56f', .6) + dot(60, 72, 4, '#4fb56f', .6),
  // 7 Вольвокс: шар-колония из клеток с дочерними шарами
  c => {
    let o = `<circle cx="50" cy="50" r="42" fill="${c}" ${k()}/>`;
    for (let i = 0; i < 22; i++) {
      const a = i * 2 * Math.PI / 22;
      o += `<circle cx="${50 + 36 * Math.cos(a)}" cy="${50 + 36 * Math.sin(a)}" r="3.4" fill="#5fb0ee" stroke="#24304a" stroke-width="1.5"/>`;
    }
    return o + `<circle cx="34" cy="68" r="8" fill="#fff" opacity=".6" ${k(1.8)}/><circle cx="68" cy="66" r="6.5" fill="#fff" opacity=".6" ${k(1.8)}/>` + hi(32, 30, 10, 5);
  },
  // 8 Гидра: тело-трубка с щупальцами, подошвой и почкой
  c => {
    let o = '';
    [24, 34, 44, 56, 66, 76].forEach((x, i) => { const d = i % 2 ? 8 : -8; o += `<path class="wag" d="M${x} 30 q${d} -14 ${d / 2} -26" fill="none" ${k(3.5)}/>`; });
    return o + `<ellipse cx="50" cy="92" rx="22" ry="6" fill="#ff8fb0" ${k()}/>` +
      `<circle cx="86" cy="62" r="9" fill="${c}" ${k(2.5)}/><rect x="20" y="24" width="60" height="70" rx="28" fill="${c}" ${k()}/>` + hi(34, 34, 9, 6) + dot(70, 82, 4, '#ff7aa0', .5);
  },
  // 9 Медуза: купол с пятнами и волнистыми щупальцами
  c => {
    let o = '';
    [20, 35, 50, 65, 80].forEach(x => { o += `<path class="wag" d="M${x} 68 q-7 10 0 18 t0 14" fill="none" ${k(3.5)}/>`; });
    return o + path('M6 68 C6 22 26 8 50 8 C74 8 94 22 94 68 Q83 77 72 68 Q61 77 50 68 Q39 77 28 68 Q17 77 6 68Z', c) +
      hi(32, 24, 14, 6) + dot(22, 52, 4, '#fff', .6) + dot(78, 50, 5, '#fff', .6) + dot(50, 16, 3, '#fff', .6);
  },
  // 10 Осьминог
  (c, f) => {
    let o = '';
    ['M26 66 C18 84 6 80 8 94', 'M36 70 C32 88 20 90 22 98', 'M46 72 C46 88 40 94 44 100', 'M54 72 C54 88 60 94 56 100', 'M64 70 C68 88 80 90 78 98', 'M74 66 C82 84 94 80 92 94'].forEach(d => {
      o += `<g class="wag"><path d="${d}" fill="none" stroke="#24304a" stroke-width="12" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${f}" stroke-width="6" stroke-linecap="round"/></g>`;
    });
    return o + `<ellipse cx="50" cy="42" rx="38" ry="36" fill="${c}" ${k()}/>` + hi(32, 22, 12, 6) +
      dot(24, 58, 4, '#fff', .55) + dot(78, 56, 5, '#fff', .55) + dot(66, 20, 3, '#fff', .55);
  },
  // 11 Морская звезда
  c => {
    let pts = '', o = '';
    for (let i = 0; i < 10; i++) { const r = i % 2 ? 19 : 46, a = -Math.PI / 2 + i * Math.PI / 5; pts += `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)} `; }
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; o += dot(50 + 30 * Math.cos(a), 50 + 30 * Math.sin(a), 3, '#fff', .6) + dot(50 + 18 * Math.cos(a), 50 + 18 * Math.sin(a), 2.5, '#fff', .6); }
    return `<polygon points="${pts}" fill="${c}" ${k()}/>` + o + hi(40, 38, 8, 5);
  },
  // 12 Рыба
  c => path('M80 50 L100 30 Q93 50 100 70Z', c) + path('M34 28 Q48 6 64 30Z', c) + `<ellipse cx="46" cy="50" rx="40" ry="26" fill="${c}" ${k()}/>` +
    `<path d="M30 36 Q23 50 30 64" fill="none" ${k(2)}/>` + hi(46, 36, 22, 5) + `<circle cx="20" cy="44" r="4.5" fill="#fff" ${k(1.8)}/><circle cx="19" cy="44" r="2" fill="#24304a"/>` + dot(58, 58, 3, '#fff', .5) + dot(68, 48, 3, '#fff', .5),
  // 13 Краб
  c => {
    let o = '';
    for (const y of [52, 62, 72]) o += `<path d="M24 ${y} L6 ${y + 8}" fill="none" ${k(3)}/><path d="M76 ${y} L94 ${y + 8}" fill="none" ${k(3)}/>`;
    return o + `<path d="M28 44 L14 28" fill="none" ${k()}/><path d="M72 44 L86 28" fill="none" ${k()}/>` +
      `<circle cx="12" cy="22" r="11" fill="${c}" ${k()}/><circle cx="88" cy="22" r="11" fill="${c}" ${k()}/><path d="M12 12 L12 22" ${k(2)}/><path d="M88 12 L88 22" ${k(2)}/>` +
      `<ellipse cx="50" cy="58" rx="34" ry="26" fill="${c}" ${k()}/>` + hi(38, 46, 14, 5) + `<circle cx="40" cy="32" r="4" fill="#fff" ${k(1.8)}/><circle cx="60" cy="32" r="4" fill="#fff" ${k(1.8)}/>` + dot(50, 72, 4, '#24304a', .25);
  },
  // 14 Скат
  c => `<path d="M50 84 L50 108" fill="none" ${k()}/>` + path('M50 12 C70 28 100 34 96 52 C80 50 66 60 50 84 C34 60 20 50 4 52 C0 34 30 28 50 12Z', c) +
    hi(40, 30, 12, 5) + dot(36, 48, 3, '#fff', .55) + dot(64, 48, 3, '#fff', .55) + dot(50, 62, 3, '#fff', .55),
  // 15 Кит
  c => path('M4 54 C4 30 34 20 62 26 C78 30 86 42 92 38 C90 28 94 20 100 12 C106 32 102 48 94 58 C88 68 70 80 44 80 C22 80 4 74 4 54Z', c) +
    `<path d="M10 62 C30 76 60 76 84 62" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="6" stroke-linecap="round"/>` +
    path('M44 70 Q38 90 56 86 Q54 76 52 70Z', c, 2.5) + hi(34, 36, 16, 5) + `<circle cx="18" cy="52" r="3" fill="#24304a"/>`,
  // 16 Лягушка
  c => `<ellipse cx="16" cy="78" rx="14" ry="8" fill="${c}" ${k()}/><ellipse cx="84" cy="78" rx="14" ry="8" fill="${c}" ${k()}/><ellipse cx="50" cy="60" rx="34" ry="28" fill="${c}" ${k()}/><ellipse cx="50" cy="72" rx="20" ry="11" fill="#fff" opacity=".35"/>` +
    `<circle cx="32" cy="30" r="11" fill="${c}" ${k()}/><circle cx="68" cy="30" r="11" fill="${c}" ${k()}/><circle cx="32" cy="29" r="5" fill="#fff"/><circle cx="33" cy="30" r="2.5" fill="#24304a"/><circle cx="68" cy="29" r="5" fill="#fff"/><circle cx="67" cy="30" r="2.5" fill="#24304a"/><path d="M30 58 Q50 70 70 58" fill="none" ${k(2)}/>` + hi(36, 48, 12, 5),
  // 17 Динозавр
  c => {
    let o = '';
    [34, 44, 54, 64].forEach(x => { o += `<polygon points="${x},40 ${x + 5},22 ${x + 10},40" fill="#ff9f4a" ${k(2)}/>`; });
    return `<path d="M76 54 L100 70 L76 70Z" fill="${c}" ${k()}/><rect x="36" y="68" width="11" height="24" rx="5" fill="${c}" ${k()}/><rect x="62" y="68" width="11" height="24" rx="5" fill="${c}" ${k()}/>` + o +
      `<ellipse cx="54" cy="56" rx="30" ry="20" fill="${c}" ${k()}/><circle cx="24" cy="42" r="15" fill="${c}" ${k()}/><circle cx="19" cy="38" r="2.6" fill="#24304a"/><path d="M12 48 Q22 52 30 48" fill="none" ${k(2)}/>` + hi(52, 46, 14, 4);
  },
  // 18 Птица
  (c, f) => `<path d="M74 52 L98 42 L94 58Z" fill="#ff8f6b" ${k(2)}/><path d="M44 76 L44 92 M56 76 L56 92" fill="none" ${k()}/><ellipse cx="50" cy="56" rx="30" ry="24" fill="${c}" ${k()}/><circle cx="27" cy="34" r="15" fill="${c}" ${k()}/><path d="M13 32 L0 38 L14 43Z" fill="#ffc74a" ${k(2)}/><circle cx="24" cy="31" r="2.6" fill="#24304a"/>` +
    path('M44 50 Q74 44 78 68 Q56 72 42 62Z', shade(f, -0.25), 2.5) + hi(50, 44, 14, 4),
  // 19 Мамонт
  (c, f) => {
    const d = shade(f, -0.25);
    return [28, 40, 62, 74].map(x => `<rect x="${x}" y="68" width="11" height="26" rx="5" fill="${d}" ${k()}/>`).join('') + limb('M14 54 Q0 74 14 90', 9, f) +
      `<ellipse cx="56" cy="52" rx="34" ry="26" fill="${c}" ${k()}/><circle cx="26" cy="48" r="18" fill="${c}" ${k()}/><ellipse cx="34" cy="38" rx="8" ry="11" fill="${d}" ${k(2)}/><circle cx="20" cy="44" r="2.6" fill="#24304a"/><path d="M16 62 Q4 66 8 50" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` + hi(56, 38, 18, 5);
  },
  // 20 Обезьяна
  (c, f) => limb('M72 84 Q98 84 92 56', 6, f) + limb('M30 64 Q12 78 20 94', 9, f) + limb('M70 64 Q88 78 80 94', 9, f) +
    `<ellipse cx="50" cy="76" rx="22" ry="20" fill="${c}" ${k()}/><circle cx="22" cy="34" r="10" fill="${c}" ${k()}/><circle cx="78" cy="34" r="10" fill="${c}" ${k()}/><circle cx="50" cy="36" r="25" fill="${c}" ${k()}/><ellipse cx="50" cy="42" rx="17" ry="14" fill="#f6d3a8" ${k(2)}/><circle cx="43" cy="36" r="2.4" fill="#24304a"/><circle cx="57" cy="36" r="2.4" fill="#24304a"/><path d="M44 48 Q50 53 56 48" fill="none" ${k(2)}/>` + hi(38, 22, 10, 4),
  // 21 Человек
  (c, f) => limb('M34 36 Q18 52 24 66', 8, f) + limb('M66 36 Q82 52 76 66', 8, f) + limb('M43 64 L40 94', 9, '#4a5a8a') + limb('M57 64 L60 94', 9, '#4a5a8a') +
    `<rect x="33" y="28" width="34" height="40" rx="13" fill="${c}" ${k()}/><circle cx="24" cy="68" r="5" fill="#ffd2a8" ${k(2)}/><circle cx="76" cy="68" r="5" fill="#ffd2a8" ${k(2)}/><circle cx="50" cy="16" r="13" fill="#ffd2a8" ${k()}/><path d="M37 14 Q50 -2 63 14 Q50 6 37 14Z" fill="#6b4a32" ${k(2)}/><circle cx="45" cy="17" r="1.8" fill="#24304a"/><circle cx="55" cy="17" r="1.8" fill="#24304a"/><path d="M45 22 Q50 25 55 22" fill="none" ${k(1.6)}/>` + hi(42, 40, 6, 9),
  // 22 Робот
  c => limb('M30 54 L12 76', 7, '#8c98a8') + limb('M70 54 L88 76', 7, '#8c98a8') +
    `<rect x="36" y="78" width="11" height="16" rx="3" fill="#8c98a8" ${k()}/><rect x="53" y="78" width="11" height="16" rx="3" fill="#8c98a8" ${k()}/><path d="M50 16 L50 5" fill="none" ${k()}/><circle cx="50" cy="5" r="4" fill="#ff5a5a" ${k(2)}/><rect x="28" y="46" width="44" height="34" rx="9" fill="${c}" ${k()}/><rect x="30" y="16" width="40" height="28" rx="9" fill="${c}" ${k()}/><rect x="36" y="24" width="28" height="12" rx="6" fill="#16222e"/><circle cx="44" cy="30" r="3" fill="#6ff0ff"/><circle cx="56" cy="30" r="3" fill="#6ff0ff"/><circle cx="50" cy="62" r="6" fill="#6ff0ff" opacity=".8" ${k(2)}/>` + hi(40, 54, 8, 4),
  // 23 Космонавт
  (c, f) => limb('M34 50 Q16 62 24 76', 9, f) + limb('M66 50 Q84 62 76 76', 9, f) + limb('M43 76 L41 94', 10, f) + limb('M57 76 L59 94', 10, f) +
    `<rect x="24" y="38" width="52" height="38" rx="10" fill="#aeb8d0" ${k()}/><rect x="32" y="44" width="36" height="36" rx="12" fill="${c}" ${k()}/><rect x="42" y="56" width="16" height="10" rx="2" fill="#ff6a6a" ${k(1.6)}/><circle cx="50" cy="28" r="22" fill="${c}" ${k()}/><ellipse cx="50" cy="29" rx="15" ry="12" fill="#1d2a55" ${k(2)}/><ellipse cx="45" cy="25" rx="5" ry="3" fill="#fff" opacity=".6"/>`,
  // 24 Пришелец
  (c, f) => limb('M40 66 Q24 74 22 88', 4, f) + limb('M60 66 Q76 74 78 88', 4, f) +
    `<path d="M43 60 L40 92 L60 92 L57 60Z" fill="${c}" ${k()}/><ellipse cx="50" cy="34" rx="27" ry="31" fill="${c}" ${k()}/><ellipse cx="38" cy="40" rx="9" ry="5.5" transform="rotate(22 38 40)" fill="#14202a"/><ellipse cx="62" cy="40" rx="9" ry="5.5" transform="rotate(-22 62 40)" fill="#14202a"/><circle cx="35" cy="38" r="1.8" fill="#fff"/><circle cx="59" cy="38" r="1.8" fill="#fff"/><path d="M45 54 Q50 57 55 54" fill="none" ${k(1.6)}/>` + hi(40, 20, 10, 5),
  // 25 Галактический разум
  (c, f) => {
    let o = `<circle cx="50" cy="50" r="42" fill="${f}" opacity=".18"/>`;
    for (let a = 0; a < 3; a++) for (let i = 0; i < 12; i++) {
      const t = a * 2.094 + i * 0.5, r = 10 + i * 3;
      o += dot(50 + r * Math.cos(t), 50 + r * Math.sin(t), 4 - i * 0.22, i % 3 ? '#fff' : f, 0.9);
    }
    return o + `<circle cx="50" cy="50" r="12" fill="${c}" ${k(2)}/><circle cx="50" cy="50" r="5" fill="#fff"/>`;
  }
];

const IC_P = {
  dna: '<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12s10 6 10 6M8.5 8h7M8.5 16h7"/>',
  gem: '<path d="M6 4h12l4 6-10 11L2 10zM2 10h20M9 4l-2 6 5 11 5-11-2-6"/>',
  drop: '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>',
  shop: '<path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0"/>',
  book: '<path d="M4 4h7a2 2 0 0 1 1 2v14a2 2 0 0 0-1-1H4zM20 4h-7a2 2 0 0 0-1 2v14a2 2 0 0 1 1-1h7z"/>',
  trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  harvest: '<path d="M5 12h14l-2 8H7zM8 12c0-5 4-8 4-8s4 3 4 8"/>',
  boost: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  magnet: '<path d="M5 3v8a7 7 0 0 0 14 0V3h-4v8a3 3 0 0 1-6 0V3zM5 7h4M15 7h4"/>',
  wheel: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>'
};

const IC = n => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC_P[n]}</svg>`;

const SV = b => `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice">${b}</svg>`;

const SCENES = [
  SV(`<defs><radialGradient id="s0a" cx=".4" cy=".35"><stop offset="0" stop-color="#bfffee" stop-opacity=".22"/><stop offset="1" stop-color="#2fd0b0" stop-opacity=".02"/></radialGradient></defs><g class="drift"><circle cx="16" cy="28" r="16" fill="url(#s0a)" stroke="#9ff0e0" stroke-opacity=".25" stroke-width=".5"/><circle cx="16" cy="28" r="13" fill="none" stroke="#9ff0e0" stroke-opacity=".12" stroke-width=".4" stroke-dasharray="1.2 1"/><circle cx="20" cy="24" r="4.4" fill="#9ff0e0" fill-opacity=".14" stroke="#9ff0e0" stroke-opacity=".3" stroke-width=".4"/><ellipse cx="11" cy="33" rx="3.2" ry="1.6" fill="#7fffd4" fill-opacity=".2" transform="rotate(-30 11 33)"/><ellipse cx="22" cy="34" rx="2.6" ry="1.3" fill="#7fffd4" fill-opacity=".2" transform="rotate(20 22 34)"/></g><g class="drift" style="animation-delay:-14s"><circle cx="82" cy="22" r="12" fill="url(#s0a)" stroke="#9ff0e0" stroke-opacity=".25" stroke-width=".5"/><circle cx="85" cy="20" r="3.6" fill="#9ff0e0" fill-opacity=".14" stroke="#9ff0e0" stroke-opacity=".3" stroke-width=".4"/><path d="M76 26q3-3 6 0t6 0" fill="none" stroke="#7fffd4" stroke-opacity=".3" stroke-width=".6"/></g><g class="drift" style="animation-delay:-26s"><circle cx="64" cy="72" r="20" fill="url(#s0a)" stroke="#9ff0e0" stroke-opacity=".25" stroke-width=".5"/><circle cx="60" cy="68" r="5.4" fill="#9ff0e0" fill-opacity=".14" stroke="#9ff0e0" stroke-opacity=".3" stroke-width=".4"/><ellipse cx="71" cy="77" rx="4" ry="2" fill="#7fffd4" fill-opacity=".2" transform="rotate(35 71 77)"/><path d="M54 78q4-4 8 0t8 0" fill="none" stroke="#7fffd4" stroke-opacity=".3" stroke-width=".6"/></g><g class="floaty"><path d="M30 46q4-2 8 0t8 0" fill="none" stroke="#c8ffe8" stroke-opacity=".3" stroke-width="1" stroke-linecap="round"/><path d="M33 56q3-2 6 0t6 0" fill="none" stroke="#c8ffe8" stroke-opacity=".25" stroke-width="1" stroke-linecap="round"/><ellipse cx="46" cy="22" rx="5" ry="1.8" fill="#c8ffe8" fill-opacity=".14"/><path d="M52 22q6-5 10-2" fill="none" stroke="#c8ffe8" stroke-opacity=".3" stroke-width=".6"/></g><g class="twinkle" fill="#bfffee"><circle cx="40" cy="16" r=".5"/><circle cx="52" cy="46" r=".4"/><circle cx="28" cy="64" r=".5"/><circle cx="74" cy="48" r=".4"/></g>`),
  SV(`<defs><linearGradient id="s1r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a50"/><stop offset="1" stop-color="#07071c"/></linearGradient><radialGradient id="s1g" cx=".5" cy=".5"><stop offset="0" stop-color="#ffb060" stop-opacity=".6"/><stop offset="1" stop-color="#ff6a20" stop-opacity="0"/></radialGradient></defs><path d="M0 100V78C12 70 22 80 36 76C50 72 56 84 72 78C84 74 92 80 100 76V100Z" fill="url(#s1r)"/><path d="M58 100C58 90 62 84 63 74C63 68 66 66 68 66C72 66 73 70 74 74C75 84 80 90 82 100Z" fill="#1c1240" stroke="#3a2a70" stroke-width=".6"/><path d="M64 70C66 66 72 66 73 70" fill="none" stroke="#5a3a90" stroke-width=".6"/><circle cx="68.5" cy="64" r="7" fill="url(#s1g)"/><g class="floaty"><path d="M68 62Q64 52 69 44Q74 36 70 28" fill="none" stroke="#ff9a50" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/><circle cx="66" cy="50" r=".9" fill="#ffb060"/><circle cx="72" cy="38" r=".7" fill="#ffb060"/><circle cx="69" cy="30" r=".8" fill="#ffb060"/></g><g class="sway" fill="none" stroke="#6a5bf0" stroke-opacity=".55" stroke-width="1.8" stroke-linecap="round"><path d="M8 100Q2 86 9 72T8 46"/><path d="M14 100Q20 82 14 66"/><path d="M92 100Q98 84 90 68T94 42"/></g><g class="drift floaty"><path d="M22 20C22 10 40 10 40 20Q38 22 36 20Q34 23 31 20Q28 23 26 20Q24 22 22 20Z" fill="#7fe0ff" fill-opacity=".3" stroke="#7fe0ff" stroke-opacity=".5" stroke-width=".5"/><path d="M26 22q-1 6 1 12M31 22q1 8-1 16M36 22q-1 7 1 11" fill="none" stroke="#7fe0ff" stroke-opacity=".45" stroke-width=".7" stroke-linecap="round"/></g><g class="drift floaty" style="animation-delay:-5s"><path d="M68 34C68 27 80 27 80 34Q78 36 77 34Q75 37 73 34Q71 36 70 34Z" fill="#ff7ae0" fill-opacity=".28" stroke="#ff7ae0" stroke-opacity=".45" stroke-width=".5"/><path d="M71 36q0 6 1 9M75 36q0 7-1 10" fill="none" stroke="#ff7ae0" stroke-opacity=".4" stroke-width=".6" stroke-linecap="round"/></g><g class="floaty"><path d="M10 54C14 49 22 49 27 54C22 59 14 59 10 54Z" fill="#0c0c24" stroke="#1a1a40" stroke-width=".4"/><path d="M27 54L31 51L31 57Z" fill="#0c0c24"/><circle cx="14" cy="53" r=".8" fill="#9ff"/><path d="M12 56q-3 3-1 6" fill="none" stroke="#9ffff0" stroke-opacity=".7" stroke-width=".5"/><circle cx="10.4" cy="62.4" r="1.3" fill="#aaffee" class="blink"/></g><g class="twinkle" fill="#9ff0ff"><circle cx="50" cy="60" r=".6"/><circle cx="35" cy="75" r=".5"/><circle cx="55" cy="38" r=".5"/><circle cx="82" cy="64" r=".6"/></g>`),
  SV(`<defs><linearGradient id="s2l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c0" stop-opacity=".22"/><stop offset="1" stop-color="#fff6c0" stop-opacity="0"/></linearGradient><linearGradient id="s2s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0d89a"/><stop offset="1" stop-color="#b89a60"/></linearGradient><radialGradient id="s2b" cx=".4" cy=".3"><stop offset="0" stop-color="#ff9ab0"/><stop offset="1" stop-color="#b03a68"/></radialGradient></defs><g class="sway" opacity=".8"><path d="M28 0H44C52 40 56 70 60 100H16C20 70 24 40 28 0Z" fill="url(#s2l)"/><path d="M62 0H72C80 40 86 70 92 100H56C58 70 60 40 62 0Z" fill="url(#s2l)" opacity=".7"/></g><path d="M0 100V88C14 84 26 90 42 88C58 86 72 82 100 86V100Z" fill="url(#s2s)" fill-opacity=".85"/><path d="M6 94q8-2 16 0M44 92q10-2 20 0M74 95q8-2 16 0" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width=".5"/><g class="sway"><path d="M10 96C10 84 6 78 4 70C8 74 11 78 12 84C12 76 14 70 18 64C16 72 16 80 14 96Z" fill="#ff6a7a"/><path d="M8 76q-2 -4 0 -6M16 70q0 -4 2 -6" stroke="#ff9aa6" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="M28 96C28 88 26 84 22 78C27 80 29 84 30 88C31 82 33 78 38 74C35 80 34 88 33 96Z" fill="#ffb35a"/><path d="M76 96C76 82 72 74 68 66C74 70 77 76 78 82C78 74 82 66 88 60C84 68 83 80 82 96Z" fill="#ff7ac0"/><circle cx="68" cy="66" r="1.4" fill="#ffc0e0"/><circle cx="88" cy="60" r="1.4" fill="#ffc0e0"/></g><path d="M36 97C34 86 48 82 52 90C54 98 40 100 36 97Z" fill="url(#s2b)"/><path d="M40 90q4-3 8 0M39 94q5-3 10 0M42 87q3-2 6 0" fill="none" stroke="#7a2a4a" stroke-width=".8" stroke-linecap="round"/><g class="sway" fill="none" stroke-linecap="round"><path d="M58 97q-2-9-5-13M60 97q0-10 0-14M62 97q2-9 5-13M64 97q4-8 8-10" stroke="#ffa0c0" stroke-width="1.5"/><circle cx="53" cy="84" r="1" fill="#fff"/><circle cx="60" cy="83" r="1" fill="#fff"/><circle cx="67" cy="84" r="1" fill="#fff"/></g><path d="M92 98C92 90 90 86 88 82C92 83 95 86 96 90C97 86 98 84 100 82C99 88 99 94 98 98Z" fill="#b07aff"/><g class="drift floaty" fill="#12303c" opacity=".6"><path d="M8 30C11 27 16 27 19 30C16 33 11 33 8 30ZM19 30L22 28L22 32Z"/><path d="M20 38C22 36 26 36 28 38C26 40 22 40 20 38ZM28 38L30 36.6L30 39.4Z"/><path d="M12 42C14 40 18 40 20 42C18 44 14 44 12 42ZM20 42L22 40.6L22 43.4Z"/></g><g class="twinkle" fill="#fff"><circle cx="48" cy="20" r=".5"/><circle cx="80" cy="40" r=".5"/></g>`),
  SV(`<defs><linearGradient id="s3m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fa8d0" stop-opacity=".7"/><stop offset="1" stop-color="#8fa8d0" stop-opacity=".1"/></linearGradient><linearGradient id="s3h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc060"/><stop offset="1" stop-color="#3f8a3c"/></linearGradient><linearGradient id="s3w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd8ff"/><stop offset="1" stop-color="#4a98d0"/></linearGradient></defs><circle cx="82" cy="16" r="8" fill="#fff6b0" fill-opacity=".75"/><circle cx="82" cy="16" r="15" fill="#fff6b0" fill-opacity=".14"/><path d="M0 58C10 46 16 40 22 34C28 40 32 44 38 40C46 34 52 46 60 50C68 40 74 34 80 30C88 38 94 46 100 52V70H0Z" fill="url(#s3m)"/><path d="M20 36q2 3 4 1l-2 3zM78 32q2 3 4 1l-2 3z" fill="#fff" fill-opacity=".7"/><g class="drift" fill="#fff" fill-opacity=".8"><ellipse cx="20" cy="18" rx="11" ry="3.4"/><ellipse cx="27" cy="15" rx="6.5" ry="3"/><ellipse cx="14" cy="16.6" rx="5" ry="2.4"/><ellipse cx="62" cy="28" rx="10" ry="3"/><ellipse cx="68" cy="25.6" rx="5.6" ry="2.6"/></g><path d="M0 74C14 62 34 66 52 70C72 74 88 66 100 70V100H0Z" fill="url(#s3h)" fill-opacity=".8"/><ellipse cx="44" cy="82" rx="20" ry="3.6" fill="url(#s3w)" fill-opacity=".8"/><path d="M34 82q4-1 8 0M46 83q6-1 12 0" stroke="#fff" stroke-opacity=".5" stroke-width=".5" fill="none"/><path d="M0 100V90C20 80 40 90 62 88C80 86 90 82 100 86V100Z" fill="#37803a"/><g><rect x="9" y="76" width="2.2" height="10" rx="1" fill="#5a3a22"/><circle cx="10" cy="72" r="6" fill="#2f7a2c"/><circle cx="6.6" cy="75" r="4.4" fill="#3a8a34"/><circle cx="13.6" cy="75" r="4.4" fill="#3a8a34"/><rect x="85" y="70" width="2.4" height="12" rx="1" fill="#5a3a22"/><circle cx="86" cy="66" r="7" fill="#2f7a2c"/><circle cx="82" cy="70" r="5" fill="#3a8a34"/><circle cx="90.4" cy="70" r="5" fill="#3a8a34"/><path d="M27 88C27 80 29 76 31 70C33 76 35 80 35 88Z" fill="#1f5a2a"/><path d="M26 82C27 78 29 76 31 72C33 76 35 78 36 82Z" fill="#2a6a32"/></g><g fill="#ff7a9a"><circle cx="40" cy="93" r="1"/><circle cx="46" cy="95" r="1"/><circle cx="58" cy="92" r="1"/></g><g fill="#ffd23f"><circle cx="43" cy="96" r="1"/><circle cx="52" cy="94" r="1"/></g><g class="drift floaty" fill="none" stroke="#2a2a3a" stroke-width=".8" stroke-linecap="round"><path d="M30 32q2-2.4 4 0q2-2.4 4 0"/><path d="M44 26q2-2.4 4 0q2-2.4 4 0"/><path d="M52 34q1.6-2 3.2 0q1.6-2 3.2 0"/></g>`),
  SV(`<defs><radialGradient id="s4n1" cx=".5" cy=".5"><stop offset="0" stop-color="#b050ff" stop-opacity=".3"/><stop offset="1" stop-color="#b050ff" stop-opacity="0"/></radialGradient><radialGradient id="s4n2" cx=".5" cy=".5"><stop offset="0" stop-color="#30a0ff" stop-opacity=".28"/><stop offset="1" stop-color="#30a0ff" stop-opacity="0"/></radialGradient><radialGradient id="s4p" cx=".35" cy=".3"><stop offset="0" stop-color="#9a80f0"/><stop offset=".6" stop-color="#5a3ab8"/><stop offset="1" stop-color="#241060"/></radialGradient><radialGradient id="s4m" cx=".35" cy=".3"><stop offset="0" stop-color="#e8ecf4"/><stop offset="1" stop-color="#7a8294"/></radialGradient></defs><circle cx="22" cy="30" r="34" fill="url(#s4n1)"/><circle cx="76" cy="72" r="38" fill="url(#s4n2)"/><circle cx="58" cy="24" r="20" fill="#ff5ab0" fill-opacity=".08"/><g class="twinkle" fill="#fff"><circle cx="10" cy="14" r=".7"/><circle cx="30" cy="42" r=".5"/><circle cx="55" cy="10" r=".6"/><circle cx="92" cy="55" r=".7"/><circle cx="70" cy="86" r=".5"/><circle cx="20" cy="78" r=".6"/><circle cx="45" cy="60" r=".4"/><circle cx="86" cy="12" r=".5"/><circle cx="38" cy="22" r=".4"/><circle cx="64" cy="48" r=".4"/></g><g class="floaty"><path d="M82 22C70 22 64 28 66 34C74 28 90 24 100 28C96 24 90 22 82 22Z" fill="#c8b0ff" fill-opacity=".4"/><circle cx="82" cy="28" r="12" fill="url(#s4p)"/><path d="M71 26q11 4 22 0M70.4 31q11.6 4 23.2 0" fill="none" stroke="#c8b4ff" stroke-opacity=".4" stroke-width=".8"/><path d="M62 30C70 36 94 36 102 26" fill="none" stroke="#ffb3e6" stroke-opacity=".65" stroke-width="1.4" stroke-linecap="round"/></g><g class="floaty"><circle cx="16" cy="72" r="8" fill="url(#s4m)"/><circle cx="13" cy="70" r="1.6" fill="#7a8294" fill-opacity=".6"/><circle cx="19" cy="75" r="1.2" fill="#7a8294" fill-opacity=".6"/><circle cx="17" cy="68" r=".9" fill="#7a8294" fill-opacity=".5"/></g><g class="drift" fill="#6a6a80"><path d="M38 82C40 79 45 80 46 83C47 86 43 88 40 87C37 86 36 84 38 82Z"/><path d="M48 88C49 86 52 86 53 88C53 90 50 91 49 90Z"/><path d="M32 89C33 87 36 87 36 89C36 91 33 91 32 89Z"/><path d="M56 80C57 78 60 78 60 80C60 82 57 82 56 80Z"/></g><path class="shoot" d="M95 8L82 16" stroke="#fff" stroke-width=".9" stroke-linecap="round"/><path class="shoot" style="animation-delay:-3.5s" d="M60 32L48 40" stroke="#bfe8ff" stroke-width=".8" stroke-linecap="round"/>`)
];

function artSVG0(level, gid) {
  const L = LEVELS[level - 1];
  const defs = `<defs><radialGradient id="${gid}" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="${shade(L.color, 0.5)}"/><stop offset=".55" stop-color="${L.color}"/><stop offset="1" stop-color="${shade(L.color, -0.4)}"/></radialGradient></defs>`;
  return `<svg viewBox="-25 -25 150 150">${defs}<g class="lit">${ART[level - 1](`url(#${gid})`, L.color)}</g></svg>`;
}

// ---------- Дополнительные детали поверх базовых силуэтов ----------
const sk = (o = 0.28, w = 1.4) => `fill="none" stroke="#24304a" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"`;
const rays = (n, r1, r2, a0) => { let o = ''; for (let i = 0; i < n; i++) { const t = a0 + i * 2 * Math.PI / n; o += `<line x1="${50 + r1 * Math.cos(t)}" y1="${50 + r1 * Math.sin(t)}" x2="${50 + r2 * Math.cos(t)}" y2="${50 + r2 * Math.sin(t)}" ${sk(0.3, 1.2)}/>`; } return o; };
const DETAILS = [
  `<circle cx="50" cy="50" r="29" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.4"/><ellipse cx="60" cy="60" rx="9" ry="7" fill="#ff9ec7" ${k(1.4)}/>${dot(60, 60, 3, '#fff', .75)}${dot(34, 62, 3, '#24304a', .28)}${dot(40, 72, 2, '#24304a', .28)}${dot(64, 38, 2.4, '#fff', .55)}`,
  `<ellipse cx="50" cy="50" rx="30" ry="9" ${sk(0.35, 1.6)} stroke-dasharray="3 2"/>${dot(30, 40, 2, '#24304a', .35)}${dot(70, 60, 2, '#24304a', .35)}${dot(60, 38, 1.6, '#24304a', .35)}${dot(38, 62, 1.6, '#24304a', .35)}`,
  `${dot(32, 45, 2.4, '#fff', .7)}${dot(55, 30, 2, '#fff', .7)}${dot(48, 72, 2.6, '#fff', .6)}<circle cx="40" cy="70" r="5" fill="#fff" opacity=".35" ${k(1.2)}/>`,
  `<g transform="rotate(-12 50 50)"><path d="M12 42Q50 30 88 42M10 52Q50 44 90 52M12 62Q50 56 88 62" ${sk(0.22, 1.2)}/></g><circle cx="64" cy="40" r="4" fill="#fff" opacity=".55" ${k(1.2)}/>`,
  `<circle cx="50" cy="52" r="30" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4"/><circle cx="50" cy="56" r="7" fill="#fff" opacity=".4" ${k(1.4)}/>${dot(32, 44, 2.5, '#fff', .7)}${dot(68, 46, 2.5, '#fff', .7)}`,
  `<path d="M24 46Q50 36 80 44M22 56Q50 50 84 58M26 66Q50 64 76 68" ${sk(0.22, 1.2)}/><circle cx="46" cy="52" r="8" fill="#fff" opacity=".35" ${k(1.3)}/>`,
  `<circle cx="50" cy="50" r="28" fill="none" stroke="#fff" stroke-opacity=".3"/><circle cx="50" cy="50" r="18" fill="none" stroke="#fff" stroke-opacity=".25"/><path d="M22 50H78M50 22V78M30 30L70 70M70 30L30 70" stroke="#fff" stroke-opacity=".18" stroke-width=".8"/>`,
  `<ellipse cx="50" cy="28" rx="12" ry="4" fill="#24304a" opacity=".45"/><path d="M24 50Q50 56 76 50M24 62Q50 68 76 62M24 74Q50 80 76 74" ${sk(0.2)}/>`,
  `<path d="M50 12V60M50 14Q30 30 14 58M50 14Q70 30 86 58M50 14Q40 36 30 62M50 14Q60 36 70 62" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.2"/><circle class="glow" cx="50" cy="38" r="8" fill="#fff" opacity=".4"/>`,
  `${dot(36, 30, 4, '#24304a', .18)}${dot(62, 34, 5, '#24304a', .15)}${dot(50, 52, 3, '#24304a', .15)}${dot(8, 90, 2, '#fff', .7)}${dot(92, 90, 2, '#fff', .7)}${dot(22, 94, 2, '#fff', .7)}${dot(78, 94, 2, '#fff', .7)}`,
  () => `<circle cx="50" cy="50" r="8" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>${rays(5, 10, 38, -Math.PI / 2)}`,
  `<path d="M36 40q6 6 0 12M46 38q6 8 0 16M56 40q6 6 0 12M66 44q5 5 0 10" ${sk(0.3, 1.6)}/><path d="M16 58Q46 74 78 56" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>`,
  `<path d="M30 52Q50 40 70 52M32 62Q50 52 68 62" ${sk(0.3, 1.6)}/>${dot(40, 66, 2, '#fff', .5)}${dot(60, 66, 2, '#fff', .5)}`,
  `<path d="M50 14V82M50 24Q70 34 90 50M50 24Q30 34 10 50" ${sk(0.25, 1.2)}/>${dot(44, 70, 1.8, '#24304a', .4)}${dot(56, 70, 1.8, '#24304a', .4)}`,
  `<path d="M14 62Q40 74 70 66M16 68Q42 78 66 72" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>${dot(40, 34, 2, '#fff', .6)}${dot(56, 30, 1.6, '#fff', .6)}`,
  `${dot(38, 52, 5, '#24304a', .22)}${dot(58, 50, 6, '#24304a', .2)}${dot(48, 64, 4, '#24304a', .2)}`,
  `${dot(44, 56, 2, '#24304a', .3)}${dot(52, 50, 2, '#24304a', .3)}${dot(60, 58, 2, '#24304a', .3)}<path d="M38 92v4M44 92v4M64 92v4M70 92v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
  `<path d="M52 56Q64 54 70 62M50 60Q62 60 68 68" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/><path d="M30 56Q36 68 46 70" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>`,
  `<path d="M44 34q3 6 0 10M52 30q3 6 0 12M60 32q3 6 0 10M70 38q3 6 0 10M76 52q3 6 0 10M40 58q3 6 0 10" ${sk(0.28, 1.6)}/>`,
  `<path d="M44 14q6-6 12 0M40 18q10-8 20 0" ${sk(0.4, 2)}/><ellipse cx="50" cy="78" rx="12" ry="12" fill="#f6d3a8" opacity=".6"/>`,
  `<path d="M40 40Q50 48 60 40M42 52Q50 56 58 52" ${sk(0.25)}/><rect x="34" y="62" width="32" height="4" fill="#24304a" opacity=".35"/>`,
  `${dot(34, 22, 1.6, '#24304a', .5)}${dot(66, 22, 1.6, '#24304a', .5)}<path d="M34 56H66M34 70H66" ${sk(0.3)}/><circle class="blink" cx="50" cy="62" r="3" fill="#fff"/><circle class="blink" cx="50" cy="5" r="2.4" fill="#fff"/>`,
  `<path d="M36 18Q44 10 56 12" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M32 52q-8 6-4 16" fill="none" stroke="#24304a" stroke-opacity=".5" stroke-width="2.5"/>`,
  `<path class="blink" d="M50 6V18M40 12L44 21M60 12L56 21" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".6" fill="none"/><circle class="blink" cx="50" cy="70" r="4" fill="#fff"/>`,
  `<g class="spin"><ellipse cx="50" cy="50" rx="46" ry="14" fill="none" stroke="#fff" stroke-opacity=".35"/><ellipse cx="50" cy="50" rx="46" ry="14" transform="rotate(60 50 50)" fill="none" stroke="#fff" stroke-opacity=".25"/></g>${dot(20, 20, 1.6, '#fff', .9)}${dot(82, 78, 1.6, '#fff', .9)}`
];
DETAILS.forEach((extra, i) => {
  const base = ART[i];
  ART[i] = (c, f) => base(c, f) + (typeof extra === 'function' ? extra() : extra);
});

Object.assign(IC_P, {
  luck: '<circle cx="9" cy="9" r="3.5"/><circle cx="15" cy="9" r="3.5"/><circle cx="9" cy="15" r="3.5"/><circle cx="15" cy="15" r="3.5"/><path d="M12 12v9"/>',
  rain: '<path d="M7 15a4 4 0 0 1 0-8 5 5 0 0 1 10 1 3.5 3.5 0 0 1 0 7z"/><path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2"/>',
  vortex: '<path d="M12 12a2 2 0 0 1 3 1 5 5 0 0 1-6 4 8 8 0 0 1-3-9 10 10 0 0 1 12-2"/>',
  mutagen: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8"/>',
  map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
  wave: '<path d="M2 9c3-3 5 3 8 0s5 3 8 0 3-2 4-1M2 16c3-3 5 3 8 0s5 3 8 0 3-2 4-1"/>',
  coral: '<path d="M12 21V11M12 15l-4-4V6M12 13l4-4V5M8 21h8"/>',
  leaf: '<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8"/>',
  planet: '<circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-25 12 12)"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
});


// ---------- Детальные модели 12–25 (перерисованы с нуля) ----------
const OLN = '#1c2433';
const stk = (w = 1.6) => `stroke="${OLN}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const lgr = (id, f, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(f, a)}"/><stop offset="1" stop-color="${shade(f, b)}"/></linearGradient>`;
const rgr = (id, f, a, b) => `<radialGradient id="${id}" cx=".4" cy=".32" r=".85"><stop offset="0" stop-color="${shade(f, a)}"/><stop offset="1" stop-color="${shade(f, b)}"/></radialGradient>`;
const eyeP = (x, y, r, iris = '#e0b030') => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f4f0e0" stroke="${OLN}" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="${r * 0.68}" fill="${iris}"/><ellipse cx="${x}" cy="${y}" rx="${r * 0.22}" ry="${r * 0.55}" fill="#10141c"/><circle cx="${x - r * 0.28}" cy="${y - r * 0.3}" r="${r * 0.2}" fill="#fff" opacity=".9"/>`;
const lmb = (d, w, f) => `<path d="${d}" fill="none" stroke="${OLN}" stroke-width="${w + 2}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${f}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

ART[11] = (c, f) => { // Рыба
  let sc = '';
  for (let r = 0; r < 4; r++) for (let q = 0; q < 6; q++) sc += `<path d="M${30 + q * 9 + (r % 2) * 4.5} ${34 + r * 9}q4.5 4.5 0 9" ${sk(0.3, 1)}/>`;
  return `<defs>${lgr('fb12', f, 0.3, -0.5)}${lgr('ft12', f, -0.1, -0.55)}</defs>` +
    `<path d="M84 50L101 30Q95 50 101 70Z" fill="url(#ft12)" ${stk()}/><path d="M86 50L98 38M86 50L98 62" ${sk(0.4, 1)}/>` +
    `<path d="M34 30Q44 6 70 28Z" fill="url(#ft12)" ${stk()}/><path d="M40 52Q54 74 62 62Q52 56 40 52Z" fill="url(#ft12)" ${stk()}/>` +
    `<path d="M7 50C13 30 38 22 60 27C74 31 85 41 91 50C85 59 74 69 60 73C38 78 13 70 7 50Z" fill="url(#fb12)" ${stk(2)}/>` +
    `<path d="M12 56C30 68 58 72 84 54C70 72 38 78 12 60Z" fill="#fff" opacity=".3"/>` + sc +
    `<path d="M28 34Q22 50 28 66" ${sk(0.5, 2)}/><path d="M9 53Q14 56 21 55" ${sk(0.5, 1.4)}/><path d="M44 30Q48 50 44 70M58 28Q62 50 58 72" ${sk(0.18, 5)}/>` + eyeP(18, 44, 5, '#f0b020') + hi(40, 36, 16, 3);
};
ART[12] = (c, f) => { // Краб
  const d = shade(f, -0.45); let o = '';
  [-1, 1].forEach(s => {
    for (let i = 0; i < 4; i++) o += lmb(`M${50 + s * 26} ${46 + i * 8}L${50 + s * (40 + i * 2)} ${36 + i * 12}L${50 + s * (47 + i * 3)} ${56 + i * 11}`, 2.6, f);
    o += lmb(`M${50 + s * 24} 40Q${50 + s * 36} 30 ${50 + s * 36} 20`, 5, f) +
      `<ellipse cx="${50 + s * 34}" cy="11" rx="6.5" ry="12" transform="rotate(${-s * 16} ${50 + s * 34} 11)" fill="url(#cb13)" ${stk()}/><ellipse cx="${50 + s * 42}" cy="12" rx="5" ry="10" transform="rotate(${s * 16} ${50 + s * 42} 12)" fill="url(#cb13)" ${stk()}/>`;
  });
  return `<defs>${rgr('cb13', f, 0.3, -0.45)}</defs>` + o +
    `<path d="M50 28C74 26 86 44 82 58C78 72 64 80 50 80C36 80 22 72 18 58C14 44 26 26 50 28Z" fill="url(#cb13)" ${stk(2)}/>` +
    `<path d="M30 46Q50 36 70 46M26 58Q50 48 74 58M32 68Q50 62 68 68" ${sk(0.35, 1.5)}/>` + dot(38, 40, 2.4, d, 0.5) + dot(62, 40, 2.4, d, 0.5) + dot(50, 56, 3, d, 0.4) +
    lmb('M42 30L40 20M58 30L60 20', 2, f) + eyeP(40, 18, 3.6, '#202020') + eyeP(60, 18, 3.6, '#202020') + hi(40, 40, 12, 3);
};
ART[13] = (c, f) => { // Скат
  const d = shade(f, -0.5); let v = '';
  for (let i = 0; i < 5; i++) v += `<path d="M50 ${34 + i * 7}Q${66 + i * 4} ${30 + i * 6} ${88 - i * 3} ${44 + i * 5}M50 ${34 + i * 7}Q${34 - i * 4} ${30 + i * 6} ${12 + i * 3} ${44 + i * 5}" ${sk(0.22, 1)}/>`;
  return `<defs>${rgr('rg14', f, 0.35, -0.5)}</defs>` + `<path d="M50 80L46 107L54 107Z" fill="${d}" ${stk(1.2)}/>` +
    `<path d="M50 12C62 22 78 22 96 38C99 46 91 53 84 52C76 62 62 70 54 82L50 87L46 82C38 70 24 62 16 52C9 53 1 46 4 38C22 22 38 22 50 12Z" fill="url(#rg14)" ${stk(2)}/>` + v +
    `<path d="M50 16V80" ${sk(0.4, 2.2)}/>` + [[36, 40], [64, 40], [28, 50], [72, 50], [44, 60], [56, 60]].map(([x, y]) => dot(x, y, 2.2, '#fff', 0.6)).join('') +
    `<ellipse cx="41" cy="30" rx="4.5" ry="3.6" fill="${d}" ${stk(1)}/><ellipse cx="59" cy="30" rx="4.5" ry="3.6" fill="${d}" ${stk(1)}/><circle cx="41" cy="30" r="2" fill="#e8d070"/><circle cx="59" cy="30" r="2" fill="#e8d070"/>` + hi(40, 26, 12, 4);
};
ART[14] = (c, f) => { // Кит
  let g = '';
  for (let i = 0; i < 6; i++) g += `<path d="M${10 + i * 2} ${58 + i * 3}Q40 ${70 + i * 2} 78 ${60 + i * 2}" ${sk(0.3, 1)}/>`;
  return `<defs>${lgr('wb15', f, 0.25, -0.5)}${lgr('wf15', f, -0.1, -0.55)}</defs>` +
    `<path d="M90 44Q98 32 106 38Q102 47 94 50Q102 58 106 62Q98 66 90 56Z" fill="url(#wf15)" ${stk()}/>` +
    `<path d="M3 56C3 36 24 24 52 26C74 28 86 38 93 46L93 54C86 68 68 80 44 80C20 80 3 72 3 56Z" fill="url(#wb15)" ${stk(2)}/>` +
    `<path d="M5 62C24 76 62 80 90 56C72 82 28 86 5 66Z" fill="#fff" opacity=".35"/>` + g +
    `<path d="M40 64Q50 88 64 80Q58 72 52 62Z" fill="url(#wf15)" ${stk()}/><path d="M68 30Q76 20 82 33Z" fill="url(#wf15)" ${stk(1.4)}/>` +
    `<path d="M5 60Q24 68 46 62" ${sk(0.5, 1.4)}/><circle cx="15" cy="53" r="2.6" fill="#101820"/><circle cx="14.2" cy="52.2" r=".8" fill="#fff"/>` +
    dot(34, 36, 2.2, '#fff', 0.55) + dot(48, 32, 1.8, '#fff', 0.55) + dot(24, 40, 1.6, '#fff', 0.55) +
    `<g class="blink" fill="none" stroke="#bfe8ff" stroke-width="1.6" stroke-linecap="round" opacity=".7"><path d="M18 22Q16 12 22 8M18 22Q20 12 14 10M18 22V8"/></g>` + hi(40, 34, 20, 3);
};
ART[15] = (c, f) => { // Лягушка
  const d = shade(f, -0.5);
  return `<defs>${rgr('fb16', f, 0.35, -0.5)}${lgr('fl16', f, 0.1, -0.5)}</defs>` +
    `<path d="M22 66C6 60 2 84 14 88L30 88L34 76Z" fill="url(#fl16)" ${stk()}/><path d="M78 66C94 60 98 84 86 88L70 88L66 76Z" fill="url(#fl16)" ${stk()}/>` +
    [8, 14, 20].map(x => `<ellipse cx="${x}" cy="90" rx="3.4" ry="2.4" fill="${f}" ${stk(1)}/><ellipse cx="${100 - x}" cy="90" rx="3.4" ry="2.4" fill="${f}" ${stk(1)}/>`).join('') +
    `<path d="M50 34C74 34 86 54 82 70C78 86 22 86 18 70C14 54 26 34 50 34Z" fill="url(#fb16)" ${stk(2)}/>` +
    `<path d="M32 64C38 82 62 82 68 64C60 72 40 72 32 64Z" fill="#fff" opacity=".35"/>` +
    `<path d="M30 50Q50 62 70 50" ${sk(0.5, 1.6)}/><circle cx="46" cy="44" r="1.2" fill="${d}"/><circle cx="54" cy="44" r="1.2" fill="${d}"/>` +
    dot(34, 58, 5, d, 0.35) + dot(66, 58, 5, d, 0.35) + dot(50, 70, 4, d, 0.3) + dot(42, 50, 3, d, 0.3) + dot(60, 52, 3, d, 0.3) +
    `<circle cx="29" cy="36" r="11" fill="url(#fb16)" ${stk(1.8)}/><circle cx="71" cy="36" r="11" fill="url(#fb16)" ${stk(1.8)}/>` + eyeP(29, 35, 7, '#e8b020') + eyeP(71, 35, 7, '#e8b020') +
    `<path d="M38 74L34 90M62 74L66 90" ${sk(0.5, 4)}/>` + hi(42, 46, 14, 4);
};
ART[16] = (c, f) => { // Тираннозавр
  const d = shade(f, -0.5); let teeth = '', sp = '';
  for (let i = 0; i < 6; i++) teeth += `<path d="M${19 + i * 4.4} 50l1.6 4l1.6-4z" fill="#f4f0e0" ${stk(0.5)}/>`;
  for (let i = 0; i < 5; i++) sp += `<path d="M${48 + i * 7} ${42 + i * 2}q4 8 2 18" ${sk(0.3, 3)}/>`;
  return `<defs>${lgr('dg17', f, 0.3, -0.5)}${lgr('dd17', f, -0.1, -0.6)}</defs>` +
    `<path d="M80 54C92 54 100 62 108 72C94 72 84 74 74 70Z" fill="url(#dd17)" ${stk(1.8)}/>` +
    `<path d="M44 40C60 33 76 40 82 52C86 62 84 70 76 74L66 76L65 94L55 94L56 80L46 78L45 94L35 94L38 70C30 64 30 50 44 40Z" fill="url(#dg17)" ${stk(2)}/>` + sp +
    `<path d="M40 70C46 80 64 80 72 72L76 74L66 78L46 80Z" fill="#fff" opacity=".25"/>` + lmb('M45 54L37 62L42 65', 2.4, f) +
    `<path d="M14 34C20 22 40 22 50 32C52 40 46 46 42 48L20 50C11 46 9 40 14 34Z" fill="url(#dg17)" ${stk(2)}/><path d="M16 50L42 51L40 60L19 56Z" fill="url(#dd17)" ${stk(1.6)}/>` + teeth +
    `<ellipse cx="34" cy="32" rx="4" ry="3" fill="#f0c830" ${stk(0.8)}/><ellipse cx="34" cy="32" rx="1" ry="2.6" fill="#101010"/><path d="M28 28L40 30" ${sk(0.6, 1.6)}/><circle cx="14" cy="38" r="1.4" fill="${d}"/>` +
    dot(56, 50, 2, '#fff', 0.25) + dot(64, 58, 2, '#fff', 0.25) + dot(70, 48, 2, '#fff', 0.25) + hi(52, 44, 16, 3);
};
ART[17] = (c, f) => { // Орёл
  let wing = '', tail = '', ch = '';
  for (let i = 0; i < 4; i++) wing += `<path d="M${44 + i * 4} ${34 + i * 6}Q${72 + i * 2} ${40 + i * 6} ${70 - i * 2} ${74 + i * 3}Q60 ${82 + i * 2} 50 ${70 + i * 3}Z" fill="${shade(f, 0.2 - i * 0.18)}" ${stk(1.2)}/>`;
  for (let i = 0; i < 5; i++) tail += `<path d="M${38 + i * 4} 78L${30 + i * 8} 100L${36 + i * 8} 100Z" fill="${shade(f, -0.3)}" ${stk(1)}/>`;
  for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) ch += `<path d="M${32 + q * 7 + (r % 2) * 3} ${44 + r * 8}q3.5 4 7 0" ${sk(0.35, 1.2)}/>`;
  return `<defs>${lgr('bb18', f, 0.25, -0.45)}</defs><path d="M8 90H92" stroke="#6a4a2a" stroke-width="5" stroke-linecap="round"/>` + tail +
    `<path d="M40 30C56 28 66 44 64 60C62 76 52 86 42 86C32 86 28 68 30 52C32 40 34 32 40 30Z" fill="url(#bb18)" ${stk(2)}/>` + ch + wing +
    `<path d="M36 86L34 92M42 86L42 92M48 86L50 92" ${sk(0.7, 3)}/><path d="M30 92h8M40 92h8M46 92h8" stroke="#e0b030" stroke-width="2" stroke-linecap="round"/>` +
    `<circle cx="34" cy="25" r="11" fill="url(#bb18)" ${stk(2)}/><path d="M25 22L10 29Q18 31 26 33Z" fill="#e8b830" ${stk(1.2)}/><path d="M10 29Q12 33 16 32" fill="none" stroke="#101010" stroke-width="2"/>` +
    `<circle cx="31" cy="22" r="3.4" fill="#f0c020" ${stk(0.8)}/><circle cx="31" cy="22" r="1.4" fill="#101010"/><path d="M26 18L38 20" ${sk(0.7, 2)}/>` + hi(36, 40, 10, 4);
};
ART[18] = (c, f) => { // Мамонт
  const d = shade(f, -0.5); let fur = '';
  for (let i = 0; i < 12; i++) fur += `<path d="M${34 + i * 4.5} ${60 + (i % 3) * 3}q-2 10 1 18" ${sk(0.5, 2)}/>`;
  for (let i = 0; i < 8; i++) fur += `<path d="M${40 + i * 6} ${30 + (i % 2) * 3}q3 6 0 12" ${sk(0.3, 1.6)}/>`;
  return `<defs>${lgr('mb19', f, 0.2, -0.5)}${lgr('mt19', '#e8dcc0', 0.2, -0.2)}</defs>` +
    [28, 40, 62, 76].map(x => `<path d="M${x} 74L${x - 1} 94L${x + 11} 94L${x + 10} 74Z" fill="${d}" ${stk(1.6)}/>`).join('') +
    `<path d="M30 34C48 22 76 26 88 44C94 56 90 74 82 80L70 80L58 80L44 80L30 76C22 66 22 46 30 34Z" fill="url(#mb19)" ${stk(2)}/>` + fur +
    `<path d="M10 46C10 28 28 18 38 28C44 34 44 48 40 58L22 66C12 62 10 54 10 46Z" fill="url(#mb19)" ${stk(2)}/>` +
    `<path d="M12 56C2 68 6 86 18 94C14 84 14 74 20 68Z" fill="${d}" ${stk(1.6)}/><path d="M9 64q5-2 8 0M7 72q5-2 9 0M8 80q5-2 9 0" ${sk(0.4, 1)}/>` +
    `<path d="M16 62C0 66 -4 82 8 90C6 80 10 72 20 66Z" fill="url(#mt19)" ${stk(1.4)}/>` +
    `<path d="M36 40Q52 34 50 54Q42 58 38 50Z" fill="${d}" ${stk(1.4)}/><circle cx="22" cy="44" r="2.6" fill="#101010"/><circle cx="21.2" cy="43.2" r=".8" fill="#fff"/><path d="M14 36Q24 30 36 34" ${sk(0.4, 2)}/>` + hi(52, 34, 18, 3);
};
ART[19] = (c, f) => { // Обезьяна
  const d = shade(f, -0.5), face = '#e8c098';
  return `<defs>${rgr('mb20', f, 0.3, -0.5)}</defs>` + lmb('M66 82Q98 84 94 52', 5, f) +
    lmb('M34 52Q14 62 22 84', 8, f) + lmb('M66 52Q86 62 78 84', 8, f) +
    `<path d="M34 46C34 42 66 42 66 46L70 74C70 88 30 88 30 74Z" fill="url(#mb20)" ${stk(2)}/><ellipse cx="50" cy="72" rx="12" ry="12" fill="${face}" opacity=".7"/>` +
    lmb('M36 84L34 94M64 84L66 94', 8, f) + `<circle cx="22" cy="86" r="5" fill="${face}" ${stk(1)}/><circle cx="78" cy="86" r="5" fill="${face}" ${stk(1)}/>` +
    `<circle cx="31" cy="28" r="7" fill="url(#mb20)" ${stk(1.6)}/><circle cx="69" cy="28" r="7" fill="url(#mb20)" ${stk(1.6)}/><circle cx="31" cy="28" r="3.6" fill="${face}"/><circle cx="69" cy="28" r="3.6" fill="${face}"/>` +
    `<circle cx="50" cy="30" r="18" fill="url(#mb20)" ${stk(2)}/><path d="M36 34C36 22 64 22 64 34C64 46 56 52 50 52C44 52 36 46 36 34Z" fill="${face}" ${stk(1.2)}/>` +
    `<path d="M38 24Q50 16 62 24" ${sk(0.5, 3)}/>` + eyeP(43, 31, 3.6, '#5a3a18') + eyeP(57, 31, 3.6, '#5a3a18') +
    `<ellipse cx="50" cy="40" rx="4" ry="3" fill="${d}" opacity=".6"/><circle cx="48.5" cy="40" r=".9" fill="#101010"/><circle cx="51.5" cy="40" r=".9" fill="#101010"/><path d="M44 46Q50 50 56 46" ${sk(0.7, 1.4)}/>` + hi(42, 20, 8, 3);
};
ART[20] = (c, f) => { // Человек-охотник с факелом
  const skin = '#d8a878', fur = '#7a5232', hair = '#2a1a10';
  return `<defs>${lgr('hs21', skin, 0.15, -0.3)}${lgr('hf21', fur, 0.2, -0.4)}</defs>` +
    `<path d="M84 96V12" stroke="#6a4a2a" stroke-width="3" stroke-linecap="round"/><path d="M84 12L80 22L88 22Z" fill="#9aa4ac" ${stk(1)}/>` +
    lmb('M64 34Q80 40 84 58', 6.5, skin) + `<circle cx="84" cy="58" r="3.6" fill="${skin}" ${stk(1)}/>` +
    lmb('M36 34Q18 36 14 22', 6.5, skin) + `<path d="M14 22L10 8" stroke="#6a4a2a" stroke-width="3" stroke-linecap="round"/>` +
    `<circle cx="10" cy="2" r="10" fill="#ff9a30" opacity=".28"/><path class="blink" d="M10 10Q2 0 10 -8Q18 0 10 10Z" fill="#ffb030" stroke="#ff6a10" stroke-width="1.2"/>` +
    lmb('M43 62L40 94M57 62L60 94', 8.5, shade(fur, -0.2)) + `<path d="M34 92h12M54 92h12" stroke="${OLN}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M36 26L64 26L68 62L32 62Z" fill="url(#hf21)" ${stk(2)}/><path d="M32 62l3 5l3-5l3 5l3-5l3 5l3-5l3 5l3-5l3 5l3-5l3 5l2-5" fill="none" stroke="${OLN}" stroke-width="1.6" stroke-linejoin="round"/>` +
    `<path d="M33 52H67" stroke="${OLN}" stroke-width="3"/><rect x="58" y="50" width="7" height="8" rx="2" fill="#5a3a22" ${stk(1)}/>` +
    `<rect x="46" y="20" width="8" height="8" fill="url(#hs21)" ${stk(1.2)}/><circle cx="50" cy="15" r="10" fill="url(#hs21)" ${stk(1.8)}/>` +
    `<path d="M39 14C38 4 62 4 61 14C58 8 42 8 39 14Z" fill="${hair}" ${stk(1.2)}/><path d="M41 18Q50 30 59 18Q56 26 50 28Q44 26 41 18Z" fill="${hair}" opacity=".85"/>` +
    `<circle cx="45.5" cy="15" r="1.4" fill="#101010"/><circle cx="54.5" cy="15" r="1.4" fill="#101010"/><path d="M43 12L48 12M52 12L57 12" ${sk(0.8, 1.2)}/>`;
};
ART[21] = (c, f) => { // Робот
  return `<defs>${lgr('rb22', f, 0.35, -0.45)}${lgr('rd22', f, -0.1, -0.6)}</defs>` +
    lmb('M26 40L10 58L16 78', 7, '#78808c') + lmb('M74 40L90 58L84 78', 7, '#78808c') +
    `<rect x="8" y="76" width="12" height="10" rx="3" fill="url(#rd22)" ${stk(1.2)}/><rect x="80" y="76" width="12" height="10" rx="3" fill="url(#rd22)" ${stk(1.2)}/>` +
    `<path d="M38 70L36 92L48 92L48 70Z" fill="url(#rd22)" ${stk(1.6)}/><path d="M62 70L64 92L52 92L52 70Z" fill="url(#rd22)" ${stk(1.6)}/>` +
    `<path d="M30 36C30 30 70 30 70 36L68 70L32 70Z" fill="url(#rb22)" ${stk(2)}/><path d="M30 36C18 36 16 46 24 50L32 48Z" fill="url(#rd22)" ${stk(1.6)}/><path d="M70 36C82 36 84 46 76 50L68 48Z" fill="url(#rd22)" ${stk(1.6)}/>` +
    `<circle cx="50" cy="52" r="8" fill="#10222a" ${stk(1.4)}/><circle class="blink" cx="50" cy="52" r="5" fill="#5ff0ff"/><circle cx="50" cy="52" r="2" fill="#fff"/>` +
    `<path d="M36 62H64M36 66H64M38 40V48M62 40V48" ${sk(0.35, 1.2)}/><path d="M50 6V16" ${sk(0.8, 1.6)}/><circle class="blink" cx="50" cy="5" r="2.6" fill="#ff5a5a"/>` +
    `<path d="M36 28C36 14 64 14 64 28L62 34L38 34Z" fill="url(#rb22)" ${stk(2)}/><rect x="39" y="22" width="22" height="9" rx="4.5" fill="#0c1820" ${stk(1)}/><rect class="blink" x="42" y="25" width="16" height="3" rx="1.5" fill="#5ff0ff"/>` + hi(46, 20, 8, 2.4);
};
ART[22] = (c, f) => { // Космонавт
  return `<defs>${lgr('ab23', f, 0.3, -0.35)}<radialGradient id="av23" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#4a6aa8"/><stop offset=".6" stop-color="#16244e"/><stop offset="1" stop-color="#080e22"/></radialGradient></defs>` +
    `<rect x="24" y="36" width="52" height="42" rx="10" fill="#aab4c8" ${stk(1.8)}/>` + lmb('M34 50Q16 62 22 80', 9, f) + lmb('M66 50Q84 62 78 80', 9, f) +
    `<circle cx="22" cy="82" r="6" fill="#d8dee8" ${stk(1.4)}/><circle cx="78" cy="82" r="6" fill="#d8dee8" ${stk(1.4)}/>` + lmb('M42 76L40 92M58 76L60 92', 10.5, f) +
    `<rect x="33" y="90" width="14" height="7" rx="3" fill="#8a94a8" ${stk(1.2)}/><rect x="53" y="90" width="14" height="7" rx="3" fill="#8a94a8" ${stk(1.2)}/>` +
    `<rect x="32" y="42" width="36" height="38" rx="12" fill="url(#ab23)" ${stk(2)}/><rect x="40" y="54" width="20" height="12" rx="2" fill="#2a3244" ${stk(1)}/><circle cx="45" cy="60" r="2" fill="#ff5a5a"/><circle class="blink" cx="51" cy="60" r="2" fill="#5ff0a0"/><circle cx="57" cy="60" r="2" fill="#ffd23f"/><rect x="34" y="70" width="10" height="5" fill="#d83a3a" ${stk(0.8)}/><path d="M28 56q-10 4-6 20" fill="none" stroke="#24304a" stroke-width="3"/>` +
    `<circle cx="50" cy="28" r="23" fill="url(#ab23)" ${stk(2.2)}/><ellipse cx="50" cy="29" rx="16" ry="13.5" fill="url(#av23)" ${stk(1.8)}/>` +
    `<circle cx="56" cy="31" r="7" fill="#3a78d8" opacity=".85"/><path d="M52 28Q58 26 62 32" fill="none" stroke="#7ad07a" stroke-width="2"/><ellipse cx="43" cy="22" rx="6" ry="3" fill="#fff" opacity=".55" transform="rotate(-25 43 22)"/>` + hi(40, 14, 8, 3);
};
ART[23] = (c, f) => { // Пришелец
  const d = shade(f, -0.5);
  return `<defs>${rgr('al24', f, 0.4, -0.45)}<radialGradient id="ae24" cx=".4" cy=".35"><stop offset="0" stop-color="#6aff9a"/><stop offset=".5" stop-color="#1a6a8a"/><stop offset="1" stop-color="#05080e"/></radialGradient></defs>` +
    `<ellipse class="glow" cx="50" cy="96" rx="22" ry="4" fill="${f}" opacity=".35"/>` + lmb('M42 60Q26 70 24 90', 3.6, f) + lmb('M58 60Q74 70 76 90', 3.6, f) +
    `<path d="M22 90l-2 7M24 90l0 7M26 90l2 7M74 90l2 7M76 90l0 7M78 90l-2 7" ${sk(0.8, 1.4)}/>` +
    `<path d="M44 52L42 84L58 84L56 52Z" fill="url(#al24)" ${stk(1.6)}/><path d="M41 54Q50 62 59 54L60 68Q50 74 40 68Z" fill="#2a3a5a" ${stk(1.4)}/><circle class="blink" cx="50" cy="64" r="3" fill="#6ffff0"/>` + lmb('M46 52Q50 56 54 52', 8, f) +
    `<path d="M50 6C74 6 82 30 70 46C64 54 56 56 50 56C44 56 36 54 30 46C18 30 26 6 50 6Z" fill="url(#al24)" ${stk(2)}/>` +
    `<path d="M30 30Q22 40 36 42Q44 40 40 32Z" fill="url(#ae24)" ${stk(1.4)}/><path d="M70 30Q78 40 64 42Q56 40 60 32Z" fill="url(#ae24)" ${stk(1.4)}/>` +
    `<ellipse cx="34" cy="34" rx="1.6" ry="3" fill="#fff" opacity=".8" transform="rotate(30 34 34)"/><ellipse cx="66" cy="34" rx="1.6" ry="3" fill="#fff" opacity=".8" transform="rotate(-30 66 34)"/>` +
    `<path d="M47 46Q50 48 53 46" ${sk(0.6, 1.2)}/><circle cx="48" cy="42" r=".9" fill="${d}"/><circle cx="52" cy="42" r=".9" fill="${d}"/>` +
    `<path class="blink" d="M50 8V20M38 12L43 22M62 12L57 22" stroke="#9fffd0" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".7"/>` + hi(42, 16, 9, 4);
};
ART[24] = (c, f) => { // Галактический разум: око галактики
  let o = `<circle cx="50" cy="50" r="46" fill="${f}" opacity=".16"/><circle cx="50" cy="50" r="34" fill="${f}" opacity=".18"/>`;
  for (let a = 0; a < 3; a++) for (let i = 0; i < 16; i++) {
    const t = a * 2.094 + i * 0.42, r = 18 + i * 1.9;
    o += dot(50 + r * Math.cos(t), 50 + r * Math.sin(t), Math.max(0.8, 3.4 - i * 0.14), i % 3 ? '#fff' : '#cdb4ff', 0.9) + dot(50 + (r + 3) * Math.cos(t + 0.15), 50 + (r + 3) * Math.sin(t + 0.15), 1.4, '#9a70ff', 0.5);
  }
  return `<defs><radialGradient id="ge25" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#ffd870"/><stop offset=".6" stop-color="${f}"/><stop offset="1" stop-color="#1a1040"/></radialGradient></defs>` + o +
    `<g class="spin"><ellipse cx="50" cy="50" rx="48" ry="14" fill="none" stroke="#fff" stroke-opacity=".35"/><ellipse cx="50" cy="50" rx="48" ry="14" transform="rotate(60 50 50)" fill="none" stroke="#fff" stroke-opacity=".25"/></g>` +
    `<circle cx="50" cy="50" r="17" fill="url(#ge25)" ${stk(1.6)}/><ellipse cx="50" cy="50" rx="3.6" ry="11" fill="#0a0620"/><ellipse cx="50" cy="50" rx="1.4" ry="9" fill="#fff" opacity=".25"/><circle cx="45" cy="44" r="3" fill="#fff" opacity=".8"/>` + dot(14, 16, 1.6, '#fff', 0.9) + dot(86, 82, 1.6, '#fff', 0.9) + dot(84, 20, 1.2, '#fff', 0.8);
};

// У каждого рисунка свои id градиентов: иначе ссылка попадает на градиент из скрытой вкладки и модель «ломается»
let uidN = 0;
const uniq = s => { const k = ++uidN; return s.replace(/\bid="([^"]+)"/g, (m, i) => `id="${i}_${k}"`).replace(/url\(#([^)]+)\)/g, (m, i) => `url(#${i}_${k})`); };
function artSVG(level, gid) { return uniq(artSVG0(level, gid)); }
// Ярче: повышаем насыщенность палитры
function vivid(hex) {
  const n = parseInt(hex.slice(1), 16); let r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0, l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
  s = Math.min(1, s * 1.3 + 0.08); l = Math.min(0.68, Math.max(0.4, l * 1.02));
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q, f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  const x = v => Math.round(v * 255).toString(16).padStart(2, '0');
  return '#' + x(f(h + 1 / 3)) + x(f(h)) + x(f(h - 1 / 3));
}
LEVELS.forEach((L, i) => { if (i >= 11) L.color = vivid(L.color); }); // ярче только с 12 уровня

// ---------- Перерисованные модели: 12, 13, 17, 18, 20, 21, 22 ----------
const rayFan = (cx, cy, a0, a1, n, len, w) => { let o = ''; for (let i = 0; i < n; i++) { const t = a0 + (a1 - a0) * i / (n - 1); o += `M${cx} ${cy}L${(cx + len * Math.cos(t)).toFixed(1)} ${(cy + len * Math.sin(t)).toFixed(1)}`; } return o; };
const fanPts = (cx, cy, a0, a1, n, len) => { let o = `${cx},${cy}`; for (let i = 0; i < n; i++) { const t = a0 + (a1 - a0) * i / (n - 1); o += ` ${(cx + len * Math.cos(t)).toFixed(1)},${(cy + len * Math.sin(t)).toFixed(1)}`; } return o; };

ART[11] = (c, f) => { // Рыба-крылатка: полосатое тело, веер плавников и ядовитые иглы
  const dk = shade(f, -0.6), lt = shade(f, 0.6), body = 'M8 50C12 36 32 28 58 30C74 32 86 42 90 50C86 58 74 68 58 70C32 72 12 64 8 50Z';
  let sp = '', tips = '';
  for (let i = 0; i < 9; i++) { const x0 = 28 + i * 5.6, x1 = x0 + 2 + i * 0.9 - 6, y1 = 4 + Math.abs(i - 4) * 3.2; sp += `M${x0} 31L${x1} ${y1}`; tips += ` ${x1},${y1}`; }
  let bands = ''; [24, 34, 44, 54, 64, 74].forEach((x, i) => { bands += `<path d="M${x} 26Q${x + 5} 50 ${x} 74" stroke="${i % 2 ? '#f6e9d0' : '#8a2a1a'}" stroke-width="4.4" fill="none" opacity="${i % 2 ? 0.75 : 0.88}"/>`; });
  return `<defs>${lgr('lb12', f, 0.35, -0.3)}<clipPath id="lc12"><path d="${body}"/></clipPath></defs>` +
    `<polygon points="28,31${tips} 76,40" fill="#e0642c" opacity=".45"/><path d="${sp}" stroke="${dk}" stroke-width="1.3" fill="none" stroke-linecap="round"/>` +
    `<polygon points="${fanPts(90, 50, -0.9, 0.9, 11, 15)}" fill="#e0642c" opacity=".7"/><path d="${rayFan(90, 50, -0.9, 0.9, 11, 15)}" stroke="${dk}" stroke-width=".9" fill="none"/>` +
    `<path d="${body}" fill="url(#lb12)" ${stk(2)}/><g clip-path="url(#lc12)">${bands}</g><path d="M14 56C34 68 62 70 84 54C68 74 36 76 14 60Z" fill="#fff" opacity=".28"/>` +
    `<polygon points="${fanPts(44, 54, -1.2, 0.7, 14, 46)}" fill="#e0642c" opacity=".82" stroke="${OLN}" stroke-width="1"/><path d="${rayFan(44, 54, -1.2, 0.7, 14, 46)}" stroke="${dk}" stroke-width="1" fill="none"/><polygon points="${fanPts(44, 54, -1.2, 0.7, 7, 32)}" fill="${lt}" opacity=".4"/>` +
    `<path d="M20 36Q16 24 22 18M24 34Q24 22 30 18" stroke="${dk}" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M9 52Q14 55 20 54" ${sk(0.5, 1.4)}/>` + eyeP(17, 44, 4.6, '#ff8a20') + hi(40, 36, 16, 3);
};
ART[12] = (c, f) => { // Краб-скрипач: одна огромная клешня
  const dk = shade(f, -0.5), lt = shade(f, 0.45); let legs = '', teeth = '';
  [-1, 1].forEach(s => [0, 1, 2].forEach(i => { const x0 = 50 + s * 18, y = 56 + i * 9; legs += lmb(`M${x0} ${y}L${50 + s * (36 + i * 2)} ${y - 12}L${50 + s * (42 + i * 3)} ${y + 12 + i}`, 3, f); }));
  for (let i = 0; i < 5; i++) teeth += `<path d="M${15 + i * 1.2} ${18 - i * 3}l3 1.5l-1.5 2.4z" fill="#fff" ${stk(0.5)}/>`;
  return `<defs>${rgr('cb13', f, 0.4, -0.4)}</defs>` + legs +
    lmb('M33 52L18 44L12 28', 7, f) + `<circle cx="18" cy="44" r="4" fill="${lt}" ${stk(1.2)}/>` +
    `<path d="M5 26C-3 14 1 -2 13 -5C11 6 15 14 17 22Z" fill="url(#cb13)" ${stk(1.8)}/><path d="M13 26C15 14 22 4 30 3C27 12 26 20 21 28Z" fill="url(#cb13)" ${stk(1.8)}/>` + teeth +
    dot(8, 10, 2, '#fff', 0.6) + dot(22, 10, 2, '#fff', 0.5) +
    lmb('M68 52L82 46L85 38', 3.4, f) + `<circle cx="85" cy="36" r="3" fill="url(#cb13)" ${stk(1)}/><circle cx="89" cy="38" r="2.6" fill="url(#cb13)" ${stk(1)}/>` +
    `<path d="M26 46C26 36 74 36 74 46L78 62C78 74 22 74 22 62Z" fill="url(#cb13)" ${stk(2)}/><path d="M30 52Q50 44 70 52M28 62Q50 55 72 62" ${sk(0.3, 1.5)}/>` +
    dot(40, 50, 3, '#3a9ae8', 0.8) + dot(60, 50, 3, '#3a9ae8', 0.8) + dot(50, 60, 3.4, '#3a9ae8', 0.8) + dot(34, 58, 2, '#fff', 0.5) + dot(66, 58, 2, '#fff', 0.5) +
    lmb('M43 40L40 27M57 40L60 27', 2.2, lt) + eyeP(40, 25, 4, '#101010') + eyeP(60, 25, 4, '#101010') + hi(40, 46, 12, 3);
};
ART[16] = (c, f) => { // Трицератопс
  const dk = shade(f, -0.5), lt = shade(f, 0.5); let spikes = '', dots = '';
  for (let i = 0; i < 11; i++) { const t = Math.PI * 0.9 + i * 0.52 / 1.2 * 0.9, x = 48 + 21 * Math.cos(t), y = 38 + 25 * Math.sin(t); spikes += `<path d="M${x - 2.6} ${y + 1.5}L${x + 6 * Math.cos(t)} ${y + 6 * Math.sin(t)}L${x + 2.6} ${y - 1.5}Z" fill="${lt}" ${stk(0.9)}/>`; }
  for (let i = 0; i < 9; i++) dots += dot(46 + 11 * Math.cos(i * 0.7), 36 + 14 * Math.sin(i * 0.7), 1.8, dk, 0.4);
  return `<defs>${lgr('tb17', f, 0.3, -0.5)}${lgr('tf17', f, 0.55, -0.1)}</defs>` +
    `<path d="M88 60C98 64 104 72 107 82C96 80 90 76 84 72Z" fill="url(#tb17)" ${stk(1.8)}/>` +
    `<path d="M32 76L30 94L46 94L47 80ZM62 78L60 94L76 94L76 78Z" fill="${dk}" ${stk(1.6)}/><path d="M32 94h14M62 94h14" stroke="#f4f0e0" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M34 54C46 44 78 46 90 62C96 72 90 82 80 82L58 82L42 82C30 78 26 64 34 54Z" fill="url(#tb17)" ${stk(2)}/>` +
    `<path d="M40 74C52 84 72 82 84 72C78 84 50 90 40 78Z" fill="#fff" opacity=".25"/><path d="M50 52q4 8 2 16M60 52q4 8 2 16M70 54q4 8 2 16" ${sk(0.3, 3)}/>` +
    spikes + `<ellipse cx="48" cy="38" rx="21" ry="25" fill="url(#tf17)" ${stk(2)}/><ellipse cx="48" cy="38" rx="14" ry="18" fill="none" stroke="${dk}" stroke-opacity=".35" stroke-width="1.2"/>` + dots +
    `<path d="M8 58C10 46 26 42 40 48L44 64C36 72 18 72 10 66Z" fill="url(#tb17)" ${stk(2)}/><path d="M7 59C1 60 1 68 8 68L13 63Z" fill="#e8c860" ${stk(1.4)}/>` +
    `<path d="M24 46L8 26L30 42ZM32 46L22 24L36 44Z" fill="#f4ecd0" ${stk(1.4)}/><path d="M11 58L3 49L15 56Z" fill="#f4ecd0" ${stk(1.2)}/>` +
    `<circle cx="26" cy="52" r="3.4" fill="#f0b020" ${stk(0.8)}/><circle cx="26" cy="52" r="1.5" fill="#101010"/><path d="M12 64Q24 68 38 62" ${sk(0.5, 1.4)}/>` + hi(56, 52, 16, 3);
};
ART[17] = (c, f) => { // Павлин с распущенным хвостом
  let fan = '';
  for (let i = 0; i < 17; i++) {
    const deg = -80 + i * 10;
    fan += `<g transform="rotate(${deg} 50 80)"><path d="M50 80C40 58 42 32 50 18C58 32 60 58 50 80Z" fill="url(#pf18)" ${stk(0.9)}/><path d="M50 80V22" stroke="#0a3a40" stroke-width=".8" opacity=".6"/><ellipse cx="50" cy="27" rx="5.6" ry="7.6" fill="#2a60d0"/><ellipse cx="50" cy="27.5" rx="3.4" ry="5" fill="#10a8a0"/><ellipse cx="50" cy="26.5" rx="1.8" ry="2.8" fill="#f0c020"/></g>`;
  }
  return `<defs>${lgr('pf18', '#22a070', 0.25, -0.35)}${rgr('pb18', f, 0.4, -0.45)}</defs>` + fan +
    `<path d="M38 78C38 62 62 62 62 78C62 96 38 96 38 78Z" fill="url(#pb18)" ${stk(2)}/><path d="M42 84Q50 92 58 84" ${sk(0.35, 1.4)}/>` +
    lmb('M50 70C40 56 42 44 46 36', 9, shade(f, -0.1)) + `<path d="M44 66Q41 54 45 44" ${sk(0.3, 1.4)} stroke="#fff"/>` +
    `<circle cx="45" cy="31" r="6.4" fill="url(#pb18)" ${stk(1.8)}/><ellipse cx="43" cy="30" rx="3.4" ry="2.6" fill="#f4f0e8"/><path d="M40 32L33 34L40 36Z" fill="#d8b050" ${stk(1)}/>` +
    `<circle cx="43.6" cy="29.8" r="1.4" fill="#101010"/><path d="M45 25L41 14M45 25L45 12M45 25L49 14" stroke="${OLN}" stroke-width="1.2" stroke-linecap="round"/><circle cx="41" cy="13" r="1.6" fill="#2a60d0"/><circle cx="45" cy="11" r="1.6" fill="#2a60d0"/><circle cx="49" cy="13" r="1.6" fill="#2a60d0"/>` +
    `<path d="M44 90L42 98M56 90L58 98" ${sk(0.7, 2.6)}/>` + hi(48, 70, 8, 4);
};
ART[19] = (c, f) => { // Капуцин с бананом
  const fur = shade(f, -0.55), fur2 = shade(f, -0.3), cream = '#f2dcb4', skin = '#e8b894';
  const E = (x, y) => `<circle cx="${x}" cy="${y}" r="3.7" fill="#fff" ${stk(0.8)}/><circle cx="${x}" cy="${y + 0.2}" r="2.5" fill="#3a2008"/><circle cx="${x - 0.8}" cy="${y - 0.8}" r="0.9" fill="#fff"/>`;
  return `<defs>${rgr('mk20', fur2, 0.2, -0.4)}${lgr('mc20', cream, 0.15, -0.25)}</defs>` +
    `<path d="M2 93H98" stroke="#6a4a2a" stroke-width="6" stroke-linecap="round"/><path d="M12 91q4-3 8 0M74 91q4-3 8 0" stroke="#4a3018" stroke-width="1.2" fill="none"/>` +
    lmb('M66 82C98 88 102 58 86 54C77 52 75 62 82 63', 5.4, fur) +
    `<path d="M36 54C36 46 64 46 64 54L70 78C70 91 30 91 30 78Z" fill="url(#mk20)" ${stk(2)}/><ellipse cx="50" cy="70" rx="12" ry="14" fill="url(#mc20)" ${stk(1)}/>` +
    `<ellipse cx="33" cy="84" rx="9" ry="9" fill="url(#mk20)" ${stk(1.6)}/><ellipse cx="67" cy="84" rx="9" ry="9" fill="url(#mk20)" ${stk(1.6)}/>` +
    `<ellipse cx="28" cy="91" rx="8.4" ry="3.6" fill="${fur}" ${stk(1.2)}/><ellipse cx="72" cy="91" rx="8.4" ry="3.6" fill="${fur}" ${stk(1.2)}/>` +
    lmb('M36 54Q22 66 28 80', 7, fur2) + `<circle cx="28" cy="82" r="4.4" fill="${skin}" ${stk(1)}/>` +
    lmb('M64 54Q80 56 73 40', 7, fur2) + `<circle cx="72" cy="38" r="4.4" fill="${skin}" ${stk(1)}/>` +
    `<path d="M71 36C72 22 90 18 97 30C90 26 82 30 77 41Z" fill="#f4d23a" ${stk(1.2)}/><circle cx="96.4" cy="29.4" r="1.7" fill="#5a3a10"/><path d="M76 34C80 26 88 24 93 27" ${sk(0.35, 1)}/>` +
    `<circle cx="31" cy="30" r="7" fill="url(#mk20)" ${stk(1.6)}/><circle cx="69" cy="30" r="7" fill="url(#mk20)" ${stk(1.6)}/><circle cx="31" cy="30" r="3.8" fill="${skin}"/><circle cx="69" cy="30" r="3.8" fill="${skin}"/>` +
    `<circle cx="50" cy="31" r="17" fill="url(#mk20)" ${stk(2)}/><path d="M33 27C32 11 68 11 67 27C62 19 38 19 33 27Z" fill="${fur}" ${stk(1.2)}/>` +
    `<path d="M36 32C36 22 64 22 64 32C66 44 58 52 50 52C42 52 34 44 36 32Z" fill="url(#mc20)" ${stk(1.2)}/>` + E(43, 32) + E(57, 32) +
    `<path d="M38 27Q43 24 47 27M53 27Q57 24 62 27" ${sk(0.8, 1.4)}/><ellipse cx="50" cy="44" rx="8" ry="6" fill="${skin}" ${stk(1)}/><circle cx="48" cy="42.4" r=".9" fill="#101010"/><circle cx="52" cy="42.4" r=".9" fill="#101010"/><path d="M45 47Q50 51 55 47" ${sk(0.8, 1.2)}/>` + hi(42, 18, 8, 3);
};
ART[20] = (c, f) => { // Человек с идеей
  const skin = '#ecbc94', jeans = '#2c4c94', hair = '#3a2412';
  return `<defs>${lgr('hs21', skin, 0.2, -0.3)}${lgr('ht21', f, 0.3, -0.35)}${lgr('hj21', jeans, 0.25, -0.4)}<radialGradient id="ho21" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#ffe880"/><stop offset="1" stop-color="#ffb020" stop-opacity="0"/></radialGradient></defs>` +
    `<circle class="blink" cx="86" cy="2" r="13" fill="url(#ho21)"/><path d="M81.5 3C78 -3 82 -9 86 -9C90 -9 94 -3 90.5 3L89.4 7H82.6Z" fill="#fff6b0" ${stk(0.9)}/><path d="M83.6 1Q86 -3 88.4 1" ${sk(0.6, 0.9)}/><rect x="83" y="7" width="6" height="3.4" rx="1" fill="#8a94a8" ${stk(0.7)}/><path d="M86 -9V-14M97 2H102M75 2H70M94 -6L98 -10M78 -6L74 -10" stroke="#ffd23f" stroke-width="1.6" stroke-linecap="round"/>` +
    lmb('M69 32Q84 30 86 12', 7, skin) + `<circle cx="86" cy="10" r="3.8" fill="${skin}" ${stk(1)}/>` +
    `<path d="M70 28L80 30L74 40L66 36Z" fill="url(#ht21)" ${stk(1.4)}/>` +
    `<path d="M38 62L35 92L47 92L50 62Z" fill="url(#hj21)" ${stk(1.8)}/><path d="M62 62L65 92L53 92L50 62Z" fill="url(#hj21)" ${stk(1.8)}/><path d="M43 70q2 6 0 12M57 70q-2 6 0 12" ${sk(0.3, 1.4)}/>` +
    `<path d="M31 92H47Q49 98 44 98H30Q28 94 31 92ZM69 92H53Q51 98 56 98H70Q72 94 69 92Z" fill="#f4f4f4" ${stk(1.4)}/><path d="M29 97H47M71 97H53" stroke="${OLN}" stroke-width="2"/>` +
    `<path d="M34 30C40 25 60 25 66 30L69 42L66 64L34 64L31 42Z" fill="url(#ht21)" ${stk(2)}/><path d="M42 30Q50 36 58 30" ${sk(0.4, 1.6)}/><path d="M36 50q14 6 28 0" ${sk(0.25, 1.4)}/><rect x="34" y="60" width="32" height="4" fill="#2a2a34"/><rect x="47" y="59" width="6" height="6" rx="1" fill="#d8b050"/>` +
    lmb('M32 32Q20 46 26 62', 7, skin) + `<circle cx="26" cy="64" r="3.8" fill="${skin}" ${stk(1)}/><path d="M26 32L33 34L29 44L22 40Z" fill="url(#ht21)" ${stk(1.4)}/>` +
    `<rect x="45" y="20" width="10" height="8" fill="url(#hs21)" ${stk(1.2)}/><ellipse cx="50" cy="15" rx="9.6" ry="11" fill="url(#hs21)" ${stk(1.8)}/><circle cx="40.5" cy="16" r="2.2" fill="${skin}" ${stk(1)}/><circle cx="59.5" cy="16" r="2.2" fill="${skin}" ${stk(1)}/>` +
    `<path d="M39 13C37 0 63 0 61 13C58 6 44 5 39 13Z" fill="${hair}" ${stk(1.2)}/><path d="M40 8C46 2 56 2 60 8" ${sk(0.5, 1.2)} stroke="#fff"/>` +
    `<ellipse cx="45.6" cy="15" rx="2" ry="1.4" fill="#fff"/><ellipse cx="54.4" cy="15" rx="2" ry="1.4" fill="#fff"/><circle cx="45.8" cy="15" r="1.1" fill="#3a2a18"/><circle cx="54.2" cy="15" r="1.1" fill="#3a2a18"/>` +
    `<path d="M42.5 11.4Q45.6 10 48.4 11.4M51.6 11.4Q54.4 10 57.5 11.4" ${sk(0.8, 1)}/><path d="M50 16L49 20.4L51 20.4" ${sk(0.4, 0.9)}/><path d="M46 23Q50 26 54 23" ${sk(0.8, 1.2)}/>` + hi(46, 8, 5, 2);
};
ART[21] = (c, f) => { // Парящий андроид
  const dk = shade(f, -0.55), gl = '#5fe0ff';
  return `<defs>${lgr('rb22', f, 0.5, -0.35)}${lgr('rd22', f, -0.1, -0.6)}</defs>` +
    `<path class="blink" d="M38 92Q42 112 46 92Z" fill="${gl}"/><path class="blink" d="M54 92Q58 112 62 92Z" fill="${gl}"/><path class="blink" d="M40 92Q42 104 44 92Z" fill="#fff"/><path class="blink" d="M56 92Q58 104 60 92Z" fill="#fff"/>` +
    `<path d="M38 66L36 88L47 88L48 66Z" fill="url(#rb22)" ${stk(1.6)}/><path d="M62 66L64 88L53 88L52 66Z" fill="url(#rb22)" ${stk(1.6)}/><circle cx="41" cy="76" r="4" fill="url(#rd22)" ${stk(1.2)}/><circle cx="59" cy="76" r="4" fill="url(#rd22)" ${stk(1.2)}/>` +
    `<rect x="34" y="86" width="15" height="7" rx="3.5" fill="url(#rd22)" ${stk(1.2)}/><rect x="51" y="86" width="15" height="7" rx="3.5" fill="url(#rd22)" ${stk(1.2)}/>` +
    lmb('M27 40L15 56', 6.5, f) + lmb('M15 56L19 76', 5.4, f) + lmb('M73 40L85 56', 6.5, f) + lmb('M85 56L81 76', 5.4, f) +
    `<circle cx="15" cy="56" r="3.6" fill="url(#rd22)" ${stk(1.2)}/><circle cx="85" cy="56" r="3.6" fill="url(#rd22)" ${stk(1.2)}/><circle cx="19" cy="78" r="4" fill="url(#rd22)" ${stk(1.2)}/><circle cx="81" cy="78" r="4" fill="url(#rd22)" ${stk(1.2)}/>` +
    `<path d="M28 36C32 28 68 28 72 36L65 66L35 66Z" fill="url(#rb22)" ${stk(2)}/><circle cx="28" cy="38" r="6.6" fill="url(#rd22)" ${stk(1.6)}/><circle cx="72" cy="38" r="6.6" fill="url(#rd22)" ${stk(1.6)}/>` +
    `<path d="M36 36L42 60M64 36L58 60" stroke="${gl}" stroke-width="1.6" fill="none" opacity=".85" class="blink"/><circle cx="50" cy="47" r="8" fill="#0c1c28" ${stk(1.4)}/><circle class="blink" cx="50" cy="47" r="5.4" fill="${gl}"/><circle cx="50" cy="47" r="2.2" fill="#fff"/>` +
    `<path d="M40 58H60M42 62H58" ${sk(0.35, 1.3)}/><rect x="45" y="22" width="10" height="8" fill="url(#rd22)" ${stk(1.2)}/>` +
    `<path d="M37 24C37 6 63 6 63 24L60 30L40 30Z" fill="url(#rb22)" ${stk(2)}/><circle cx="36" cy="20" r="3.4" fill="url(#rd22)" ${stk(1.2)}/><circle cx="64" cy="20" r="3.4" fill="url(#rd22)" ${stk(1.2)}/>` +
    `<path d="M41 14H59V23Q50 28 41 23Z" fill="#0a1620" ${stk(1)}/><rect class="blink" x="43" y="17" width="5.4" height="2.4" rx="1.2" fill="${gl}"/><rect class="blink" x="51.6" y="17" width="5.4" height="2.4" rx="1.2" fill="${gl}"/><path d="M50 8V3" stroke="${OLN}" stroke-width="1.4"/><circle class="blink" cx="50" cy="2" r="2" fill="#ff6a6a"/>` + hi(46, 12, 7, 2.4);
};
// Небольшие улучшения: скат, пришелец, галактический разум
{
  const wrap = (i, extra) => { const b = ART[i]; ART[i] = (c, f) => b(c, f) + extra; };
  wrap(13, `<g class="blink" fill="none" stroke="#7fffd4" stroke-width="1.4" stroke-linecap="round" opacity=".8"><path d="M22 42Q50 54 78 42M30 52Q50 60 70 52"/></g>${dot(30, 36, 2, '#7fffd4', 0.9)}${dot(70, 36, 2, '#7fffd4', 0.9)}${dot(50, 70, 2.4, '#7fffd4', 0.9)}<path d="M50 84L47 100M50 84L53 100" stroke="#1c2433" stroke-width="1.2"/>`);
  wrap(23, `<circle class="glow" cx="50" cy="32" r="40" fill="none" stroke="#6ffff0" stroke-opacity=".35" stroke-width="2"/><path d="M50 6V-6M40 8L34 -2M60 8L66 -2" stroke="#6ffff0" stroke-width="1.6" stroke-linecap="round"/><circle class="blink" cx="50" cy="-8" r="2.6" fill="#b8fff4"/><circle class="blink" cx="34" cy="-4" r="2" fill="#b8fff4"/><circle class="blink" cx="66" cy="-4" r="2" fill="#b8fff4"/>`);
  wrap(24, `<circle cx="28" cy="32" r="18" fill="#ff5ad0" opacity=".2"/><circle cx="72" cy="68" r="20" fill="#3ac8ff" opacity=".22"/><circle cx="68" cy="26" r="12" fill="#ffd05a" opacity=".16"/><g class="spin"><ellipse cx="50" cy="50" rx="44" ry="10" transform="rotate(25 50 50)" fill="none" stroke="#ff9af0" stroke-opacity=".5" stroke-width="1.2"/></g>`);
}

{ const b = ART[20]; ART[20] = (c, f) => b(c, f) + `<circle cx="45.6" cy="15" r="3.7" fill="#9fd0ff" fill-opacity=".18" stroke="#2a2a34" stroke-width="1"/><circle cx="54.4" cy="15" r="3.7" fill="#9fd0ff" fill-opacity=".18" stroke="#2a2a34" stroke-width="1"/><path d="M49.3 14.6H50.7M41.9 14L39.6 12.8M58.1 14L60.4 12.8" stroke="#2a2a34" stroke-width="1" fill="none"/><path d="M41.5 27Q50 34 58.5 27L58.5 32Q50 38 41.5 32Z" fill="#e8742a" stroke="${OLN}" stroke-width="1.2" stroke-linejoin="round"/><path d="M55 33L58 44L53 42Z" fill="#e8742a" stroke="${OLN}" stroke-width="1" stroke-linejoin="round"/>`; }

{ // павлин: золотые кончики перьев, бирюзовая грудь
  const b = ART[17]; ART[17] = (c, f) => { let g = ''; for (let i = 0; i < 17; i++) g += `<g transform="rotate(${-80 + i * 10} 50 80)"><ellipse cx="50" cy="19.5" rx="2.2" ry="3" fill="#ffd23f" ${stk(0.5)}/><path d="M50 62V36" stroke="#ffe27a" stroke-opacity=".5" stroke-width=".7"/></g>`;
    return b(c, f) + g + `<ellipse cx="50" cy="83" rx="9" ry="9" fill="#18b8a8" opacity=".55"/><path d="M41 78Q50 72 59 78" fill="none" stroke="#9ff4e8" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>`; };
}
{ // обезьяна: пушистые щёчки и розовые уши
  const b = ART[19]; ART[19] = (c, f) => b(c, f) + `<circle cx="31" cy="30" r="3.8" fill="#f0a8a0"/><circle cx="69" cy="30" r="3.8" fill="#f0a8a0"/><path d="M35 36Q29 41 34 48Q36 44 38 42ZM65 36Q71 41 66 48Q64 44 62 42Z" fill="#f2dcb4" stroke="#1c2433" stroke-width="1" stroke-linejoin="round"/><path d="M34 44l-3 1M35 47l-3 2M66 44l3 1M65 47l3 2" stroke="#f2dcb4" stroke-width="1.4" stroke-linecap="round"/><path d="M46 49Q50 52 54 49" fill="none" stroke="#c87a6a" stroke-width="1.4" stroke-linecap="round"/>`;
}
{ // человек: красная кепка
  const b = ART[20]; ART[20] = (c, f) => b(c, f) + `<path d="M38.4 11C38 -1 62 -1 61.6 11Z" fill="#c83a3a" stroke="#1c2433" stroke-width="1.4" stroke-linejoin="round"/><path d="M36 11.4H56Q61 9.6 63 13H38Z" fill="#a82a2a" stroke="#1c2433" stroke-width="1.2" stroke-linejoin="round"/><circle cx="50" cy="1.2" r="1.3" fill="#ffd23f"/><path d="M42 6Q50 2 58 6" stroke="#e86a6a" stroke-width="1" fill="none" opacity=".7"/>`;
}
Object.assign(IC_P, { ascend: '<circle cx="12" cy="12" r="2.2"/><path d="M12 9.8C8 8 5 10 4 14M12 14.2C16 16 19 14 20 10M9.8 12C8 8 10 5 14 4M14.2 12C16 16 14 19 10 20"/>' });

ART[19] = (c, f) => { // Макака в профиль
  const fur = shade(f, -0.35), fur2 = shade(f, -0.05), cream = '#f0dcb8', skin = '#d8a48c';
  let fx = '';
  for (let i = 0; i < 9; i++) fx += `<path d="M${40 + i * 4.4} ${38 + Math.sin(i) * 1.4}q2 5 0 9" ${sk(0.3, 1.4)}/>`;
  return `<defs>${lgr('mf20', f, 0.28, -0.22)}${lgr('mb20', cream, 0.1, -0.3)}</defs>` +
    `<path d="M2 94H98" stroke="#2a3a40" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"/>` +
    lmb('M80 56C100 52 104 26 92 18C85 14 80 20 85 25', 5.6, fur) +
    lmb('M46 60L44 78L42 90', 6, fur) + lmb('M68 62L70 80L66 90', 6.4, fur) +
    `<path d="M30 48C40 34 70 34 82 48C88 58 84 72 74 74L38 74C28 68 26 56 30 48Z" fill="url(#mf20)" ${stk(2)}/>` +
    `<path d="M36 70C48 78 68 78 78 68C76 76 62 80 48 78C42 77 38 74 36 70Z" fill="url(#mb20)" opacity=".9"/>` + fx +
    lmb('M72 62C78 72 80 82 76 90', 7.4, fur2) + `<ellipse cx="73" cy="92" rx="8" ry="3.4" fill="${fur}" ${stk(1.2)}/>` +
    lmb('M38 56L32 74L30 88', 7.6, fur2) + `<ellipse cx="28" cy="92" rx="7.6" ry="3.2" fill="${skin}" ${stk(1.2)}/><path d="M23 92l-2 1M26 93.4v1.2M30 93l1.4 1" ${sk(0.6, 1)}/>` +
    `<circle cx="27" cy="39" r="15.5" fill="url(#mf20)" ${stk(2)}/><circle cx="38" cy="36" r="6.4" fill="url(#mf20)" ${stk(1.4)}/><circle cx="38" cy="36" r="3.6" fill="#f0a8a0"/>` +
    `<path d="M16 34C12 36 8 42 8 48C8 54 14 56 20 54C26 52 30 48 30 42L28 34Z" fill="${skin}" ${stk(1.8)}/>` +
    `<path d="M14 36C18 28 32 28 34 38C28 34 20 33 14 36Z" fill="${fur}" ${stk(1.2)}/><path d="M16 33Q22 29 29 33" fill="none" stroke="${OLN}" stroke-width="2.2" stroke-linecap="round"/>` +
    `<circle cx="22" cy="37.4" r="3.4" fill="#fff" ${stk(0.8)}/><circle cx="21.4" cy="37.6" r="2.1" fill="#3a2008"/><circle cx="20.6" cy="36.8" r=".8" fill="#fff"/>` +
    `<ellipse cx="9.6" cy="46" rx="1.2" ry="1.7" fill="#3a1a10"/><path d="M9 51Q16 55 25 50" fill="none" stroke="#6a3a2a" stroke-width="1.5" stroke-linecap="round"/><path d="M29 44l-5 3M30 47.4l-4 3" stroke="${cream}" stroke-width="1.6" stroke-linecap="round"/>` + hi(60, 42, 18, 3);
};

SCENES.push(SV(`<defs><radialGradient id="s5a" cx=".5" cy=".5"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".35"/><stop offset=".6" stop-color="#8a5aff" stop-opacity=".12"/><stop offset="1" stop-color="#8a5aff" stop-opacity="0"/></radialGradient><linearGradient id="s5b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7fffd4" stop-opacity="0"/><stop offset=".5" stop-color="#b07aff" stop-opacity=".45"/><stop offset="1" stop-color="#ff7ac8" stop-opacity="0"/></linearGradient><linearGradient id="s5c" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".4"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></linearGradient></defs><circle cx="50" cy="48" r="46" fill="url(#s5a)"/><g class="spin"><circle cx="50" cy="48" r="40" fill="none" stroke="#ffe9a0" stroke-opacity=".25" stroke-width=".4" stroke-dasharray="2 2.4"/></g><circle cx="50" cy="48" r="30" fill="none" stroke="#b07aff" stroke-opacity=".3" stroke-width=".5"/><circle cx="50" cy="48" r="20" fill="none" stroke="#7fffd4" stroke-opacity=".3" stroke-width=".4" stroke-dasharray="1 1.6"/><g class="drift floaty"><path d="M0 20C20 10 34 30 52 18S86 8 100 22V32C84 20 70 34 52 28S18 22 0 32Z" fill="url(#s5b)"/></g><g class="drift floaty" style="animation-delay:-8s"><path d="M0 70C16 62 38 78 58 68S88 58 100 66V74C86 64 64 80 56 74S18 66 0 76Z" fill="url(#s5b)" opacity=".7"/></g><path d="M10 100C12 80 14 60 12 40L22 40C20 60 22 80 24 100Z" fill="url(#s5c)"/><path d="M76 100C78 80 80 60 78 40L88 40C86 60 88 80 90 100Z" fill="url(#s5c)"/><g class="floaty" fill="#ffe9a0"><circle cx="30" cy="30" r="1.6" fill-opacity=".8"/><circle cx="72" cy="26" r="1.2" fill-opacity=".8"/><circle cx="22" cy="62" r="1" fill-opacity=".7"/><circle cx="82" cy="58" r="1.6" fill-opacity=".8"/><circle cx="60" cy="82" r="1" fill-opacity=".7"/></g><g class="twinkle" fill="#fff"><circle cx="8" cy="12" r=".6"/><circle cx="92" cy="14" r=".6"/><circle cx="46" cy="6" r=".5"/><circle cx="88" cy="84" r=".6"/><circle cx="12" cy="88" r=".5"/></g>`));
