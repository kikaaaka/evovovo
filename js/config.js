// Данные: уровни, локации, магазин, достижения

const LEVELS = [
  { name: "Микроб", color: "#c9b6ff" },
  { name: "Бактерия", color: "#d4f08c" },
  { name: "Амёба", color: "#fff0a0" },
  { name: "Инфузория", color: "#ffd59e" },
  { name: "Водоросль", color: "#8ed9a3" },
  { name: "Эвглена", color: "#a6e8dd" },
  { name: "Вольвокс", color: "#a9d8ff" },
  { name: "Гидра", color: "#ffb3c9" },
  { name: "Медуза", color: "#d7a8ff" },
  { name: "Осьминог", color: "#ff9a8a" },
  { name: "Морская звезда", color: "#ff9f7a" },
  { name: "Рыба", color: "#ffcf5c" },
  { name: "Краб", color: "#ff7a7a" },
  { name: "Скат", color: "#9aa7d6" },
  { name: "Кит", color: "#7fa8ff" },
  { name: "Лягушка", color: "#8ee08a" },
  { name: "Динозавр", color: "#8fbf6a" },
  { name: "Птица", color: "#6ec6ff" },
  { name: "Мамонт", color: "#b48a6a" },
  { name: "Обезьяна", color: "#c9a36a" },
  { name: "Человек", color: "#6a8cff" },
  { name: "Робот", color: "#b0bcc8" },
  { name: "Космонавт", color: "#f2f4ff" },
  { name: "Пришелец", color: "#8dff9a" },
  { name: "Галактический разум", color: "#b58cff" }
];

const LOCS = [{ name: 'Капля воды', ic: 'drop' }, { name: 'Глубина', ic: 'wave' }, { name: 'Риф', ic: 'coral' }, { name: 'Суша', ic: 'leaf' }, { name: 'Космос', ic: 'planet' }, { name: 'Вечность', ic: 'ascend' }];

const DESC = [
  'Простейшая живая клетка. Размножается делением и живёт повсюду.',
  'Клетка без ядра. Со жгутиком плавает, бывает полезной и опасной.',
  'Меняет форму и ловит добычу ложноножками.',
  'Покрыта ресничками, быстро плавает и охотится на бактерий.',
  'Получает энергию из света благодаря хлоропластам.',
  'И растение, и животное: на свету питается светом, в темноте охотится.',
  'Колония клеток в форме шара. Шаг к многоклеточной жизни.',
  'Пресноводный охотник со щупальцами. Умеет отращивать тело заново.',
  'Древнее существо, почти целиком состоящее из воды. Плывёт пульсацией купола.',
  'Умнейший беспозвоночный: решает головоломки и маскируется.',
  'Медленный хищник дна. Может отрастить потерянный луч.',
  'Первые позвоночные: быстрые, с плавниками и жабрами.',
  'Панцирь, клешни и боковой ход. Живёт у самого дна.',
  'Плоское тело-крыло и ядовитый хвост. Парит над песком.',
  'Самое большое существо океана. Поёт на километры вокруг.',
  'Первый шаг на сушу: дышит и кожей, и лёгкими.',
  'Властелин древней суши. Гиганты правили планетой миллионы лет.',
  'Потомок динозавров. Освоила небо и умеет строить гнёзда.',
  'Шерстистый великан ледникового периода. Живёт стадом.',
  'Ловкий и любопытный. Использует орудия и учится у сородичей.',
  'Разум, речь и огонь. Строит города и смотрит на звёзды.',
  'Создан человеком. Не устаёт и считает быстрее любого мозга.',
  'Первый, кто покинул планету и увидел её целиком.',
  'Гость из другой звёздной системы. Что он думает о нас?',
  'Разум размером с галактику. Мыслит звёздами.'
];

const SHOP = [
  { key: 'spawnLevel', icon: '⚡', title: 'Скорость появления', desc: 'Существа появляются чаще', base: 50, step: 40, color: '#cdb8ff' },
  { key: 'coinLevel', icon: '🧬', title: 'ДНК за слияние', desc: '+25% ДНК за слияние', base: 80, step: 60, color: '#ffe27a' },
  { key: 'chanceLevel', icon: '🍀', title: 'Шанс 2-го уровня', desc: 'Новое существо может сразу быть 2 уровня', base: 120, step: 90, color: '#9be8c4' },
  { key: 'incomeLevel', icon: '💧', title: 'Пассивный доход', desc: '+20% к доходу в секунду', base: 100, step: 80, color: '#9fd8ff' },
  { key: 'luckLevel', icon: '🎲', title: 'Удача слияния', desc: '+4% шанс удвоить ДНК за слияние', base: 150, step: 100, color: '#ffb3c9' },
  { key: 'twinLevel', icon: '🧬', title: 'Двойное деление', desc: '+6% шанс, что появятся сразу двое', base: 140, step: 110, color: '#ffd59e' },
  { key: 'clickLevel', icon: '👆', title: 'Сила клика', desc: '+25% ДНК за клик по существу', base: 40, step: 35, color: '#ffe27a' },
  { key: 'luckyLevel', icon: '🍀', title: 'Счастливые клики', desc: '+2% шанс клика с наградой ×10 (база 5%)', base: 90, step: 70, max: 10, req: 2, color: '#9be8c4' },
  { key: 'offlineLevel', icon: '🌙', title: 'Ночной сбор', desc: 'Доход, пока вас нет: 50%, до 15 мин за уровень', base: 300, step: 250, max: 8, req: 3, color: '#b8b0ff' },
  { key: 'autoLevel', icon: '🧲', title: 'Магнит', desc: 'Постоянно сводит одинаковых существ, быстрее и парами с уровнем', base: 500, step: 400, max: 6, req: 5, color: '#ffb3c9' },
  { key: 'speedLevel', icon: '⚗️', title: 'Ферменты', desc: 'Существа производят ДНК чаще (−0.3 с за уровень)', base: 120, color: '#9fd8ff' },
  { key: 'comboLevel', icon: '🔥', title: 'Мастер комбо', desc: 'Окно комбо +0.8 с и сильнее бонус', base: 200, color: '#ffb35a' },
  { key: 'energyLevel', icon: '🔋', title: 'Накопитель', desc: 'Шкала энергии быстрее, всплеск дольше', base: 180, color: '#ffe27a' },
  { key: 'mutLevel', icon: '🧫', title: 'Генная инженерия', desc: '+1% шанс мутанта за уровень', base: 350, color: '#d7a8ff' },
  { key: 'rareLevel', icon: '🪤', title: 'Приманка', desc: 'Редкие гости чаще и щедрее', base: 260, color: '#ffd9a0' },
  { key: 'cdLevel', icon: '⏱️', title: 'Перезарядка', desc: 'Бонусы восстанавливаются быстрее (−5%)', base: 400, color: '#b8f0ff' }
];

const SHOP_META = {
  spawnLevel: { max: 15, req: 1 }, coinLevel: { max: 15, req: 1, g: 1.6 }, clickLevel: { max: 20, req: 2 }, chanceLevel: { max: 10, req: 3 },
  incomeLevel: { max: 20, req: 4, g: 1.6 }, speedLevel: { max: 8, req: 5, g: 1.7 }, luckyLevel: { max: 10, req: 6 }, twinLevel: { max: 10, req: 7 },
  autoLevel: { max: 8, req: 8, g: 1.7 }, energyLevel: { max: 6, req: 9 }, offlineLevel: { max: 8, req: 10 }, comboLevel: { max: 8, req: 11 },
  rareLevel: { max: 8, req: 12 }, luckLevel: { max: 10, req: 13 }, mutLevel: { max: 8, req: 14, g: 1.6 }, cdLevel: { max: 10, req: 15 }
};


const GEMBUY = []; // существа за кристаллы теперь покупаются на вкладке «Существа»

const RARES = [
  { name: 'Золотой вирус', desc: 'Редчайшая мутация микроба. Светится и приносит удачу.', svg: '<path d="M50 6V22M50 78V94M6 50H22M78 50H94M19 19l11 11M70 70l11 11M81 19L70 30M30 70L19 81" stroke="#8a5a00" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="50" r="28" fill="#ffd23f" stroke="#8a5a00" stroke-width="2.5"/><circle cx="42" cy="42" r="8" fill="#fff" opacity=".5"/>' },
  { name: 'Медуза-призрак', desc: 'Светится в темноте глубин. Говорят, исполняет желания.', svg: '<path d="M30 58q-4 14 2 26M44 58q-4 14 0 30M58 58q4 14 0 30M70 58q4 14-2 26" fill="none" stroke="#8ff3ff" stroke-width="3" stroke-linecap="round"/><path d="M18 52C18 22 34 12 50 12s32 10 32 40Q72 58 62 52Q50 60 38 52Q28 58 18 52z" fill="#8ff3ff" stroke="#0a6b8a" stroke-width="2.5"/><circle cx="40" cy="30" r="5" fill="#fff" opacity=".6"/>' },
  { name: 'Жемчужная раковина', desc: 'Хранит жемчужину, которая растёт веками.', svg: '<path d="M12 70Q8 30 50 20Q92 30 88 70Q50 90 12 70z" fill="#ffd9e8" stroke="#a04070" stroke-width="2.5"/><path d="M50 20V78M32 26L26 74M68 26l6 48M20 40l-4 28M80 40l4 28" stroke="#a04070" stroke-width="1.6" fill="none"/><circle cx="50" cy="56" r="11" fill="#fff" stroke="#c9a0b8" stroke-width="2"/><circle cx="46" cy="52" r="4" fill="#fff"/>' },
  { name: 'Золотая бабочка', desc: 'Порхает над лугами. Её крылья сыплют золотой пыльцой.', svg: '<path d="M50 50C30 10 6 24 14 48c4 12 22 12 36 2zM50 50C70 10 94 24 86 48c-4 12-22 12-36 2zM50 52C32 60 20 84 38 86c10 0 14-16 12-34zM50 52c18 8 30 32 12 34-10 0-14-16-12-34z" fill="#ffd23f" stroke="#8a5a00" stroke-width="2.5"/><rect x="46" y="30" width="8" height="48" rx="4" fill="#5a3a00"/><path d="M48 30Q44 18 38 14M52 30Q56 18 62 14" stroke="#5a3a00" stroke-width="2" fill="none"/>' },
  { name: 'Комета-хранитель', desc: 'Странствует между звёзд и оставляет за собой космическую пыль.', svg: '<path d="M8 92Q40 70 52 52" stroke="#9fe8ff" stroke-width="10" stroke-linecap="round" opacity=".5" fill="none"/><polygon points="62,10 70,34 96,34 75,50 83,76 62,60 41,76 49,50 28,34 54,34" fill="#fff6a8" stroke="#c98a00" stroke-width="2.5"/>' }
];

const BONUS = [
  { id: 'harvest', name: 'Урожай', cd: 90, req: 1, color: '#9be86a', run: () => harvest() },
  { id: 'boost', name: 'Ускорение', cd: 120, req: 2, color: '#ffd23f', run: () => { boostUntil = Date.now() + 30000; showToast('⚡ Доход ×3 на 30 секунд'); fxAura('#ffe27a'); } },
  { id: 'luck', name: 'Удача', cd: 150, req: 3, color: '#5fe08a', run: () => { luckBoostUntil = Date.now() + 20000; showToast('🍀 Шанс счастливых кликов +45% на 20 секунд'); fxAura('#7dffa0'); } },
  { id: 'vortex', name: 'Вихрь', cd: 100, req: 4, color: '#b07aff', run: () => vortex() },
  { id: 'rain', name: 'Метеор', cd: 200, req: 5, color: '#6fb8ff', run: () => spawnRain() },
  { id: 'mutagen', name: 'Мутаген', cd: 240, req: 6, color: '#e070ff', run: () => { mutCharges = 3; showToast('🧪 Следующие 3 существа станут мутантами'); fxAura('#d7a8ff'); } },
  { id: 'wheel', name: 'Колесо', cd: 240, req: 6, color: '#ff8a5c', run: () => spinWheel() }
];

const bonusReady = {};

const ACH_DEF = [
  ['merges', '🔗', 'Слияний', [10, 50, 200, 1000]], ['clicks', '👆', 'Кликов по существам', [50, 300, 1500]],
  ['lucky', '🍀', 'Счастливых кликов', [1, 10, 50]], ['best', '⭐', 'Достигнут уровень', [5, 10, 15, 20, 25]],
  ['bought', '🛒', 'Улучшений куплено', [10, 50]],
  ['earned', '🧬', 'ДНК заработано', [1000, 100000, 10000000]], ['bonuses', '🎡', 'Бонусов использовано', [1, 10, 30]],
  ['rare', '✨', 'Редких гостей поймано', [1, 5, 20]], ['mut', '🌟', 'Мутантов найдено', [1, 5, 20]], ['burst', '⚡', 'Всплесков энергии', [1, 10, 30]],
  ['rank', '✦', 'Вознесений', [1, 5, 10, 25]],
  ['maxCombo', '🔥', 'Рекорд комбо', [4, 6]], ['maxTier', '⚡', 'Множитель всплеска', [3, 5]], ['wheel', '🎡', 'Прокруток колеса', [1, 10]],
  ['mutNow', '🧫', 'Мутантов одновременно', [3, 8]], ['coinsNow', '💰', 'ДНК одновременно', [1000000, 1000000000]], ['gemsNow', '💎', 'Кристаллов одновременно', [50, 200]],
  ['full', '📦', 'Существ в одной локации', [10, 18]], ['streak', '📅', 'Дней подряд', [3, 7]], ['rareAll', '🌟', 'Редких гостей изучено', [3, 5]],
  ['locs', '🌍', 'Открыто локаций', [3, 5]], ['opened', '🥚', 'Капсул открыто', [10, 100, 500]], ['buyCreatures', '🛍️', 'Существ куплено', [10, 50]]
];

const ACH = [];

ACH_DEF.forEach(([key, icon, label, arr]) => arr.forEach((n, i) => ACH.push({ id: key + n, icon, key, n, title: label + ': ' + n.toLocaleString('ru'), gems: i + 1 + (key === 'best' ? 1 : 0) })));

const GU = [
  { key: 'gu_auto', icon: '🥚', title: 'Автооткрытие капсул', desc: 'Капсулы открываются сами: через 10 с, затем через 5 с', max: 2, cost: l => 25 + 20 * l, color: '#9fe8ff' },
  { key: 'gu_lucky', icon: '🍀', title: 'Кристальная удача', desc: '+3% к шансу счастливого клика', max: 5, cost: l => 10 + 6 * l, color: '#7dffa0' },
  { key: 'gu_offline', icon: '🌙', title: 'Вечный сон', desc: '+1 час офлайн-дохода за уровень', max: 4, cost: l => 15 + 10 * l, color: '#b8b0ff' },
  { key: 'gu_magnet', icon: '🧲', title: 'Сверхмагнит', desc: 'Магнит быстрее и сводит больше пар', max: 3, cost: l => 20 + 15 * l, color: '#ff9ac8' }
];


// ---------- Эндгейм: Вознесение ----------
const RANKS = ['Странник', 'Звёздочёт', 'Хранитель', 'Архитектор', 'Творец', 'Демиург', 'Бесконечный'];
const rankTitle = r => RANKS[Math.min(r - 1, RANKS.length - 1)];
const SG = [
  { key: 'sg_mult', icon: '🔥', title: 'Звёздный жар', desc: '+25% ко всей ДНК за уровень', max: 50, cost: l => 1 + Math.floor(l * 0.8), color: '#ffd23f' },
  { key: 'sg_click', icon: '✦', title: 'Космический удар', desc: '+50% ДНК за клик за уровень', max: 30, cost: l => 1 + Math.floor(l * 0.6), color: '#ff9ac8' },
  { key: 'sg_tick', icon: '⏳', title: 'Сжатие времени', desc: 'Такт производства короче на 6% за уровень', max: 12, cost: l => 2 + l, color: '#9fe8ff' },
  { key: 'sg_gem', icon: '💎', title: 'Кристальный дождь', desc: '+1 💎 в минуту за уровень', max: 10, cost: l => 3 + l * 2, color: '#b8b0ff' },
  { key: 'sg_rare', icon: '🌠', title: 'Звёздный зов', desc: 'Редкие гости появляются чаще', max: 10, cost: l => 2 + l, color: '#ffe27a' }
];
