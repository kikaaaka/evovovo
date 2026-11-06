// Состояние игры и глобальные переменные

let state = {
  coins: 0,
  maxLevelReached: 1,
  spawnLevel: 0,
  coinLevel: 0,
  chanceLevel: 0,
  incomeLevel: 0,
  luckLevel: 0,
  twinLevel: 0,
  capLevel: 0,
  offlineLevel: 0,
  autoLevel: 0,
  clickLevel: 0,
  luckyLevel: 0,
  gems: 3,
  gemMult: 0,
  lastSeen: 0,
  ach: {},
  rareCaught: {},
  daily: { last: '', streak: 0 },
  tips: {},
  buys: {},
  gbuys: {},
  gemsBackup: 0,
  rank: 0,
  dust: 0,
  sg: {},
  gu: {},
  capsules: 0,
  quests: { day: '', list: [] },
  stats: { merges: 0, clicks: 0, lucky: 0, earned: 0, bought: 0, bonuses: 0, rare: 0 },
  bestLevel: 1,
  settings: { pops: true, move: true, sound: true, hq: true, music: true, mvol: 0.5 },
  creatures: []
};

let nextId = 1;

let spawnTimer = null;

let isDragging = false;

let dragEl = null;

let offsetX = 0, offsetY = 0;

let lastCoins = null;

let boostUntil = 0, magnetUntil = 0, magT = 0, autoT = 0, rareT = 45 + Math.random() * 30, rare = null, clickStart = null, combo = 0, lastMerge = 0, bubT = 0, energy = 0, luckUntil = 0;

let currentLoc = 0;

const gameEl = document.getElementById('game');

const sceneEl = document.createElement('div');

let mutCharges = 0, luckBoostUntil = 0, energyTier = 0, lastBurstEnd = 0;
let lastAction = Date.now(), tipAt = 0;
let pendingOpen = 0; // капсулы, которые открываются прямо сейчас (учитываются в лимите)
