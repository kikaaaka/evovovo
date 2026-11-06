// Реклама Яндекс Игр. Если подключён SDK (YaGames) — настоящая, иначе имитация на 3 секунды.
let ysdk = null;
let adReady = 0;
// SDK подключается после загрузки всех скриптов (cloud.js, i18n.js)
window.addEventListener('load', () => {
  if (window.YaGames) YaGames.init().then(s => { ysdk = s; cloudInit(s); detectLang(s); }).catch(() => {});
});
function showRewarded(onReward) {
  if (ysdk && ysdk.adv) {
    ysdk.adv.showRewardedVideo({ callbacks: { onRewarded: onReward, onError: () => showToast('Реклама сейчас недоступна') } });
    return;
  }
  showToast('📺 Демо-реклама, 3 секунды...');
  setTimeout(onReward, 3000);
}
