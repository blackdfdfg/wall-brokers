/* ========================================
   WALL BROKERS — App JS
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

// ========== COLLAB ==========
function showCollab() {
  const el = document.getElementById('collab-page');
  if (el.style.display === 'none') {
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    el.style.display = 'none';
  }
}

// ========== WHITELIST ==========
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
  const c = document.getElementById('wl-steps');
  c.innerHTML = '';
  for (let i = 0; i < WL_TOTAL_STEPS; i++) {
    const d = document.createElement('div');
    d.className = 'wl-step-dot' + (i === wlCurrentStep ? ' active' : '') + (i < wlCurrentStep ? ' done' : '');
    c.appendChild(d);
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
    const u = document.getElementById('wl-username').value.trim();
    if (!u) return;
    wlData.username = u;
  }
  wlCurrentStep++;
  showWlStep(wlCurrentStep);
}

function wlShowConfirm(type) {
  if (type === 'like') document.getElementById('wl-like-confirm').style.display = 'inline-flex';
  else if (type === 'rt') document.getElementById('wl-rt-confirm').style.display = 'inline-flex';
}

function wlConfirmStep() {
  wlCurrentStep++;
  showWlStep(wlCurrentStep);
}

function wlVerifyComment() {
  if (!document.getElementById('wl-comment-link').value.trim()) return;
  document.getElementById('wl-comment-verify').style.display = 'none';
  document.getElementById('wl-comment-done').style.display = 'flex';
  setTimeout(() => { wlCurrentStep++; showWlStep(wlCurrentStep); }, 800);
}

function wlSubmit() {
  const w = document.getElementById('wl-wallet').value.trim();
  if (!w) return;
  wlData.wallet = w;
  document.getElementById('wl-summary-user').textContent = '@' + wlData.username.replace('@', '');
  document.getElementById('wl-summary-wallet').textContent = w.substring(0, 6) + '...' + w.substring(w.length - 4);
  wlCurrentStep++;
  showWlStep(wlCurrentStep);
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'wl-modal') closeWhitelistModal();
});
