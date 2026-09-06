/* ========================================
   WALL BROKERS — App JS (Homepage)
   ======================================== */

const NFT_LIST = ['8','22','32','38','42','45','114','119','312','325','375','475','515','623','635','785','871','921','999'];
let nftIndex = 0;
let nftBusy = false;
let nftTapped = false;
let handPermanentlyHidden = false;

// ========== LOADING ==========
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const mainSite = document.getElementById('main-site');

  setTimeout(() => { loader.classList.add('cracking'); }, 900);
  setTimeout(() => { loader.classList.add('flash'); }, 950);
  setTimeout(() => {
    loader.classList.add('loaded');
    mainSite.classList.add('visible');
    document.body.style.overflow = '';
  }, 1400);

  updateNFTViewer();
});

// ========== NFT VIEWER ==========
function cycleNFT() {
  if (nftBusy) return;
  nftBusy = true;

  if (!nftTapped) {
    nftTapped = true;
    handPermanentlyHidden = true;
    const tapIcon = document.getElementById('nft-tap');
    if (tapIcon) tapIcon.classList.add('hidden');
  }

  nftIndex = (nftIndex + 1) % NFT_LIST.length;
  updateNFTViewer();

  setTimeout(() => { nftBusy = false; }, 250);
}

function updateNFTViewer() {
  const id = NFT_LIST[nftIndex];
  const img = document.getElementById('nft-display');
  const viewer = document.getElementById('nft-viewer');
  const tapIcon = document.getElementById('nft-tap');

  img.style.opacity = '0';

  setTimeout(() => {
    img.src = 'images/nft/' + id + '.png';
    img.onerror = function() {
      nftIndex = (nftIndex + 1) % NFT_LIST.length;
      if (!nftBusy) updateNFTViewer();
    };
    img.style.opacity = '1';

    if (nftIndex === 0 && !handPermanentlyHidden) {
      viewer.classList.add('first-image');
      tapIcon.classList.remove('hidden');
    } else {
      viewer.classList.remove('first-image');
      tapIcon.classList.add('hidden');
    }
  }, 100);
}

// ========== COUNTDOWN TIMER ==========
function startCountdown() {
  var timerEl = document.getElementById('countdown-timer');
  if (!timerEl) return;

  function updateTimer() {
    var now = Date.now();
    var d = new Date(now + 6 * 3600000);
    var target = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 13, 30, 0, 0);
    var diff = target - now;

    if (diff <= 0) {
      timerEl.textContent = '00:00:00';
      timerEl.style.color = '#888';
      return;
    }

    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);

    timerEl.textContent =
      String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startCountdown);
} else {
  startCountdown();
}
