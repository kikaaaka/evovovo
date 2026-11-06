// PWA: регистрация service worker и кнопка «Установить игру»
let installEvt = null;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  installEvt = e;
  if (!isStandalone) document.getElementById('installBtn').style.display = '';
});
window.addEventListener('appinstalled', () => { installEvt = null; document.getElementById('installBtn').style.display = 'none'; });
document.getElementById('installBtn').onclick = async () => {
  if (!installEvt) return;
  installEvt.prompt();
  await installEvt.userChoice;
  installEvt = null;
  document.getElementById('installBtn').style.display = 'none';
};
if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !isStandalone) document.getElementById('iosHint').style.display = '';
