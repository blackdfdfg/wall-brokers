/* ========================================
   WALL BROKERS — App JS
   ======================================== */

// ========== NFT LIST (specific IDs requested) ==========
const NFT_LIST = ['8','22','32','38','42','45','114','119','312','325','375','475','515','623','635','785','871','921','999'];
let nftIndex = 0;
let nftBusy = false; // debounce flag

// ========== LOADING ==========
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const mainSite = document.getElementById('main-site');

  setTimeout(() => { loader.classList.add('cracking'); }, 1000);
  setTimeout(() => { loader.classList.add('flash'); }, 1050);
  setTimeout(() => {
    loader.classList.add('loaded');
    mainSite.classList.add('visible');
    document.body.style.overflow = '';
  }, 1500);

  updateNFTViewer();
});

// ========== NFT VIEWER (debounced single-step) ==========
function cycleNFT() {
  if (nftBusy) return; // prevent rapid clicks
  nftBusy = true;

  // Hide tap hint after first click
  const hint = document.getElementById('nft-tap-hint');
  if (hint) hint.style.display = 'none';
  const hintText = document.getElementById('nft-hint-text');
  if (hintText) hintText.style.opacity = '0';

  nftIndex = (nftIndex + 1) % NFT_LIST.length;
  updateNFTViewer();

  // Unlock after transition
  setTimeout(() => { nftBusy = false; }, 300);
}

function updateNFTViewer() {
  const id = NFT_LIST[nftIndex];
  const img = document.getElementById('nft-display');
  const badge = document.getElementById('nft-id');
  const counter = document.getElementById('nft-counter');
  const progress = document.getElementById('nft-progress');

  img.style.opacity = '0';

  setTimeout(() => {
    img.src = 'images/nft/' + id + '.png';
    img.onerror = function() {
      nftIndex = (nftIndex + 1) % NFT_LIST.length;
      if (!nftBusy) updateNFTViewer();
    };
    badge.textContent = '#' + id;
    counter.textContent = (nftIndex + 1) + ' / ' + NFT_LIST.length;
    progress.style.width = ((nftIndex + 1) / NFT_LIST.length * 100) + '%';
    img.style.opacity = '1';
  }, 120);
}

// ========== COLLAB PAGE ==========
function showCollab() {
  const el = document.getElementById('collab-page');
  if (el.style.display === 'none') {
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    el.style.display = 'none';
  }
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
