// Сохранение и загрузка (localStorage)

function save() {
  cloudDirty = true;
  store.set('microbeEvolution', JSON.stringify({
    coins: state.coins,
    maxLevelReached: state.maxLevelReached,
    spawnLevel: state.spawnLevel,
    coinLevel: state.coinLevel,
    chanceLevel: state.chanceLevel,
    incomeLevel: state.incomeLevel,
    luckLevel: state.luckLevel,
    twinLevel: state.twinLevel,
    capLevel: state.capLevel,
    bestLevel: state.bestLevel,
    ...Object.fromEntries(SHOP.map(it => [it.key, state[it.key]])),
    gems: state.gems,
    gemMult: state.gemMult,
    stats: state.stats,
    ach: state.ach,
    rareCaught: state.rareCaught,
    daily: state.daily,
    tips: state.tips,
    quests: state.quests,
    buys: state.buys,
    gbuys: state.gbuys,
    gemsBackup: state.gemsBackup,
    rank: state.rank,
    dust: state.dust,
    sg: state.sg,
    gu: state.gu,
    capsules: document.querySelectorAll('.capsule').length,
    lastSeen: Date.now(),
    settings: state.settings,
    creatures: state.creatures.map(c => ({
      level: c.level,
      m: c.mut ? 1 : 0,
      x: parseFloat(c.el.style.left) || 0,
      y: parseFloat(c.el.style.top) || 0
    }))
  }));
}

function load() {
  let restored = false;
  const data = store.get('microbeEvolution');
  if (data) {
    const s = JSON.parse(data);
    const savedCreatures = s.creatures;
    delete s.creatures;
    Object.assign(state, s);

    if (Array.isArray(savedCreatures)) {
      const gameRect = gameEl.getBoundingClientRect();
      savedCreatures.forEach(sc => {
        const level = parseInt(sc.level);
        if (!(level >= 1 && level <= LEVELS.length)) return;
        const size = getCreatureSize(level);
        const x = Math.max(0, Math.min(Number(sc.x) || 0, gameRect.width - size));
        const y = Math.max(0, Math.min(Number(sc.y) || 0, gameRect.height - size));
        createCreature(level, x, y, !!sc.m);
        restored = true;
      });
    }
  }
  updateUI();
  return restored;
}
