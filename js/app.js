/* ========================================
   WALL BROKERS — Main JS
   ======================================== */

// ========== NFT IMAGE LIST (easily expandable) ==========
// To add new NFTs: just append the filename to this array.
// New images dropped into images/nft/ will appear in the grid.
const NFT_IMAGES = [
  '1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png','10.png',
  '11.png','12.png','13.png','14.png','15.png','20.png','25.png','30.png',
  '40.png','50.png','60.png','70.png','80.png','90.png','100.png',
  '150.png','200.png'
];

const GRID_PAGE_SIZE = 16;
let gridCurrentPage = 0;

// ========== LOADING ANIMATION ==========
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const mainSite = document.getElementById('main-site');

  // Start the crack + reveal after bar fills
  setTimeout(() => {
    loader.classList.add('cracking');
  }, 1300);

  setTimeout(() => {
    loader.classList.add('loaded');
    mainSite.classList.add('visible');
    document.body.style.overflow = '';
  }, 1800);

  // Preload hero images
  document.querySelectorAll('.hero-char').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });
  });

  // Init showcase
  renderShowcaseGrid();
});

// ========== SHOWCASE GRID ==========
function renderShowcaseGrid() {
  const grid = document.getElementById('showcase-grid');
  const btn = document.getElementById('load-more-btn');
  const start = 0;
  const end = Math.min(GRID_PAGE_SIZE, NFT_IMAGES.length);

  grid.innerHTML = '';
  renderGridItems(grid, start, end);

  if (end >= NFT_IMAGES.length) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'block';
  }

  gridCurrentPage = 1;
}

function loadMore() {
  const grid = document.getElementById('showcase-grid');
  const btn = document.getElementById('load-more-btn');
  const start = gridCurrentPage * GRID_PAGE_SIZE;
  const end = Math.min(start + GRID_PAGE_SIZE, NFT_IMAGES.length);

  renderGridItems(grid, start, end);
  gridCurrentPage++;

  if (end >= NFT_IMAGES.length) {
    btn.style.display = 'none';
  }
}

function renderGridItems(container, start, end) {
  for (let i = start; i < end; i++) {
    const src = NFT_IMAGES[i];
    const num = src.replace('.png', '');
    const card = document.createElement('div');
    card.className = 'showcase-card';
    card.innerHTML = `
      <img src="images/nft/${src}" alt="Wall Broker #${num}" loading="lazy">
      <div class="showcase-card-id">#${num}</div>
    `;
    card.querySelector('img').addEventListener('error', function() {
      card.style.display = 'none';
    });
    container.appendChild(card);
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

  // Simulate verification
  const verifyDiv = document.getElementById('wl-comment-verify');
  const doneDiv = document.getElementById('wl-comment-done');
  verifyDiv.style.display = 'none';
  doneDiv.style.display = 'flex';

  setTimeout(() => {
    wlCurrentStep++;
    showWlStep(wlCurrentStep);
  }, 1200);
}

function wlSubmit() {
  const wallet = document.getElementById('wl-wallet').value.trim();
  if (!wallet) return;

  wlData.wallet = wallet;

  // Fill summary
  document.getElementById('wl-summary-user').textContent = '@' + wlData.username.replace('@', '');
  const shortWallet = wlData.wallet.substring(0, 6) + '...' + wlData.wallet.substring(wlData.wallet.length - 4);
  document.getElementById('wl-summary-wallet').textContent = shortWallet;

  wlCurrentStep++;
  showWlStep(wlCurrentStep);
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.id === 'wl-modal') {
    closeWhitelistModal();
  }
});
