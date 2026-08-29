/* ========================================
   WALL BROKERS — App JS
   ======================================== */

// ========== NFT LIST (50 NFTs for showcase cycle) ==========
const NFT_LIST = [
  '1','2','3','4','5','6','7','8','9','10',
  '11','12','13','14','15','20','25','30','40','50',
  '60','70','80','90','100','150','200',
  '5','10','15','20','25','30','35','40','45','50',
  '55','60','65','70','75','80','85','90','95','100',
  '110','120','130'
];

let nftIndex = 0;

// ========== LOADING ANIMATION ==========
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const mainSite = document.getElementById('main-site');

  // Phase 1: Bar fills (1.1s)
  // Phase 2: Crack + flash (at 1.2s)
  setTimeout(() => {
    loader.classList.add('cracking');
  }, 1200);

  // Phase 3: Lightning flash
  setTimeout(() => {
    loader.classList.add('flash');
  }, 1250);

  // Phase 4: Reveal site
  setTimeout(() => {
    loader.classList.add('loaded');
    mainSite.classList.add('visible');
    document.body.style.overflow = '';
  }, 1700);

  // Init NFT viewer
  updateNFTViewer();
});

// ========== NFT VIEWER (Click to Cycle) ==========
function cycleNFT() {
  nftIndex = (nftIndex + 1) % NFT_LIST.length;
  updateNFTViewer();
}

function updateNFTViewer() {
  const id = NFT_LIST[nftIndex];
  const img = document.getElementById('nft-display');
  const badge = document.getElementById('nft-id');
  const counter = document.getElementById('nft-counter');
  const progress = document.getElementById('nft-progress');

  // Fade out
  img.style.opacity = '0';

  setTimeout(() => {
    img.src = 'images/nft/' + id + '.png';
    img.onerror = function() {
      // If image doesn't exist, skip to next
      nftIndex = (nftIndex + 1) % NFT_LIST.length;
      updateNFTViewer();
    };
    badge.textContent = '#' + id;
    counter.textContent = (nftIndex + 1) + ' / ' + NFT_LIST.length;
    progress.style.width = ((nftIndex + 1) / NFT_LIST.length * 100) + '%';
    img.style.opacity = '1';
  }, 150);
}

// ========== WHITELIST MODAL ==========
const WL_TOTAL_STEPS = 6;
let wlCurrentStep = 0;
let wlData = {};

function openWhitelistModal() {
  wlCurrentStep = 0;
  wlData = {};
  document.getElementById('wl-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  updateWlSteps();
  showWlStep(0);
}

function closeWhitelistModal() {
  document.getElementById('wl-modal').style.display = 'none';
  document.body.style.overflow = '';
}

function updateWlSteps() {
  const container = document.getElementById('wl-steps');
  container.innerHTML = '';
  for (let i = 0; i < WL_TOTAL_STEPS; i++) {
    const dot = document.createElement('div');
    dot.className = 'wl-step-dot' + (i === wlCurrentStep ? ' active' : '') + (i < wlCurrentStep ? ' done' : '');
    container.appendChild(dot);
  }
}

function showWlStep(n) {
  for (let i = 0; i < WL_TOTAL_STEPS; i++) {
    const el = document.getElementById('wl-step-' + i);
    if (el) el.style.display = i === n ? 'block' : 'none';
  }
  updateWlSteps();
}

function wlNext() {
  if (wlCurrentStep === 0) {
    const username = document.getElementById('wl-username').value.trim();
    if (!username) return;
    wlData.username = username;
  }
  wlCurrentStep++;
  showWlStep(wlCurrentStep);
}

function wlShowConfirm(type) {
  if (type === 'like') {
    document.getElementById('wl-like-confirm').style.display = 'inline-flex';
  } else if (type === 'rt') {
    document.getElementById('wl-rt-confirm').style.display = 'inline-flex';
  }
}

function wlConfirmStep() {
  wlCurrentStep++;
  showWlStep(wlCurrentStep);
}

function wlVerifyComment() {
  const link = document.getElementById('wl-comment-link').value.trim();
  if (!link) return;
  document.getElementById('wl-comment-verify').style.display = 'none';
  document.getElementById('wl-comment-done').style.display = 'flex';
  setTimeout(() => {
    wlCurrentStep++;
    showWlStep(wlCurrentStep);
  }, 1000);
}

function wlSubmit() {
  const wallet = document.getElementById('wl-wallet').value.trim();
  if (!wallet) return;
  wlData.wallet = wallet;
  document.getElementById('wl-summary-user').textContent = '@' + wlData.username.replace('@', '');
  document.getElementById('wl-summary-wallet').textContent = wlData.wallet.substring(0, 6) + '...' + wlData.wallet.substring(wlData.wallet.length - 4);
  wlCurrentStep++;
  showWlStep(wlCurrentStep);
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'wl-modal') closeWhitelistModal();
});
