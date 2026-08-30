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
const TWEET_ID = '2093950736765960253';
const TARGET_USERNAME = 'NeoH0DL';
let wlCurrentStep = 0;
let wlData = {};
let wlCommentVerified = false;
const wlUsedComments = new Set();

// Google Sheets Webhook URL
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzIbCVd4afllCNsaNCpb-pOmLARkTjUtmSfIfAEJGKTvHS8_uOqaYJwwpobrzfP3hnD/exec';

function openWhitelistModal() {
  wlCurrentStep = 0;
  wlData = {};
  wlCommentVerified = false;
  document.getElementById('wl-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.getElementById('wl-username-error').textContent = '';
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
    let u = document.getElementById('wl-username').value.trim();
    if (!u) return;
    if (!u.startsWith('@')) u = '@' + u;
    u = u.replace('@', '').trim();
    if (!u) return;

    // Check duplicate username
    const applied = JSON.parse(localStorage.getItem('wl_applied') || '[]');
    if (applied.includes(u.toLowerCase())) {
      document.getElementById('wl-username-error').textContent = 'You have already applied with this username.';
      return;
    }

    document.getElementById('wl-username-error').textContent = '';
    wlData.username = u;
  }
  wlCurrentStep++;
  showWlStep(wlCurrentStep);
}

// Like step: user clicks intent link, comes back → show check + Continue
document.getElementById('wl-like-btn').addEventListener('click', function() {
  setTimeout(function() {
    document.getElementById('wl-like-done').style.display = 'flex';
    document.getElementById('wl-like-next').style.display = 'flex';
    document.getElementById('wl-like-btn').style.display = 'none';
  }, 500);
});

// Repost step: same pattern
document.getElementById('wl-rt-btn').addEventListener('click', function() {
  setTimeout(function() {
    document.getElementById('wl-rt-done').style.display = 'flex';
    document.getElementById('wl-rt-next').style.display = 'flex';
    document.getElementById('wl-rt-btn').style.display = 'none';
  }, 500);
});

// Comment step: button first → user clicks intent → comes back → show paste input
document.getElementById('wl-comment-btn').addEventListener('click', function() {
  setTimeout(function() {
    document.getElementById('wl-comment-btn').style.display = 'none';
    document.getElementById('wl-comment-verify').style.display = 'block';
  }, 500);
});

function wlConfirmStep() {
  wlCurrentStep++;
  showWlStep(wlCurrentStep);
}

async function wlVerifyComment() {
  const link = document.getElementById('wl-comment-link').value.trim();
  const errEl = document.getElementById('wl-comment-error');
  errEl.textContent = '';

  if (!link) {
    errEl.textContent = 'Please paste your comment link.';
    return;
  }

  const cleanLink = link.split('?')[0].split('#')[0];
  if (!cleanLink.includes('x.com/') && !cleanLink.includes('twitter.com/')) {
    errEl.textContent = 'Please paste a valid X/Twitter link.';
    return;
  }

  const statusMatch = cleanLink.match(/\/status\/(\d+)/);
  if (!statusMatch) {
    errEl.textContent = 'Invalid link format. Paste the full tweet URL.';
    return;
  }

  if (wlUsedComments.has(cleanLink)) {
    errEl.textContent = 'This comment link has already been used.';
    return;
  }

  errEl.textContent = 'Verifying...';

  try {
    const oembedUrl = 'https://publish.twitter.com/oembed?url=' + encodeURIComponent(cleanLink) + '&omit_script=true';
    const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(oembedUrl);

    const resp = await fetch(proxyUrl);
    if (!resp.ok) {
      errEl.textContent = 'Could not verify. Check the link and try again.';
      return;
    }
    const data = await resp.json();

    const authorUrl = data.author_url || '';
    const authorName = authorUrl.split('/').pop() || '';
    if (authorName.toLowerCase() !== wlData.username.toLowerCase()) {
      errEl.textContent = 'This comment is not from @' + wlData.username + '.';
      return;
    }

    wlUsedComments.add(cleanLink);
    wlCommentVerified = true;
    errEl.textContent = '';
    document.getElementById('wl-comment-verify').style.display = 'none';
    document.getElementById('wl-comment-done').style.display = 'flex';
    document.getElementById('wl-comment-next').style.display = 'flex';
  } catch (e) {
    errEl.textContent = 'Verification failed. Try again.';
  }
}

function wlSubmit() {
  const w = document.getElementById('wl-wallet').value.trim();
  const errEl = document.getElementById('wl-wallet-error');
  errEl.textContent = '';

  if (!w) {
    errEl.textContent = 'Please enter a wallet address.';
    return;
  }

  // EVM format validation: 0x + 40 hex chars
  if (!/^0x[0-9a-fA-F]{40}$/.test(w)) {
    errEl.textContent = 'Please enter a valid EVM wallet address (0x...)';
    return;
  }

  wlData.wallet = w;
  document.getElementById('wl-summary-user').textContent = '@' + wlData.username;
  document.getElementById('wl-summary-wallet').textContent = w.substring(0, 6) + '...' + w.substring(w.length - 4);

  // Save to localStorage
  const applied = JSON.parse(localStorage.getItem('wl_applied') || '[]');
  applied.push(wlData.username.toLowerCase());
  localStorage.setItem('wl_applied', JSON.stringify(applied));

  // Send to Google Sheets
  sendToSheets(wlData.username, wlData.wallet);

  wlCurrentStep++;
  showWlStep(wlCurrentStep);
}

function sendToSheets(username, wallet) {
  const displayName = username.startsWith('@') ? username : '@' + username;
  const payload = {
    username: displayName,
    wallet: wallet,
    timestamp: new Date().toISOString(),
    url: window.location.href
  };

  fetch(GOOGLE_SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {});
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'wl-modal') closeWhitelistModal();
});
