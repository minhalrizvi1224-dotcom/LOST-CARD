// ══════════════════════════════════════════════════════════════════════
// LOST CARD - Auth & Profile
// Firebase Email/Password Authentication
// S. M. Minhal Abbas Rizvi | 2026
// ══════════════════════════════════════════════════════════════════════

'use strict';

let currentUser   = null;
let firebaseAuth  = null;
let firebaseDB    = null;
let authReady     = false;

// ── Initialize ────────────────────────────────────────────────────────
function initAuth() {
  applyTheme(localStorage.getItem('lc_theme') || 'dark');

  if (!FIREBASE_ENABLED) {
    // Firebase not configured - use guest mode
    _loadGuestProfile();
    authReady = true;
    return;
  }

  // Init Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
  firebaseAuth = firebase.auth();
  firebaseDB   = firebase.firestore();

  // Auth state listener
  firebaseAuth.onAuthStateChanged(async (user) => {
    if (!user) {
      // Not signed in - redirect to login
      window.location.href = 'login.html';
      return;
    }

    // Check suspended status
    const userDoc = await firebaseDB.collection('users').doc(user.uid).get().catch(() => null);
    if (userDoc && userDoc.exists && userDoc.data().suspended) {
      await firebaseAuth.signOut();
      window.location.href = 'login.html?suspended=1';
      return;
    }

    // Signed in
    currentUser = {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName || user.email.split('@')[0],
      avatarEmoji: localStorage.getItem('lc_emoji_' + user.uid) || '🎭',
      isAdmin:     IS_ADMIN(user.uid)
    };

    // Update last login in background
    firebaseDB.collection('users').doc(user.uid).update({
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(() => {});

    authReady = true;
    renderUserBadge();

    // Trigger app ready event
    document.dispatchEvent(new CustomEvent('authReady', { detail: currentUser }));
  });
}

function _loadGuestProfile() {
  const stored   = localStorage.getItem('lc_profile');
  const defaults = { displayName: 'Guest', avatarEmoji: '🃏', email: null, uid: null, isAdmin: false };
  if (stored) {
    try { currentUser = { ...defaults, ...JSON.parse(stored) }; }
    catch(e) { currentUser = { ...defaults }; }
  } else {
    currentUser = { ...defaults };
  }
  renderUserBadge();
  document.dispatchEvent(new CustomEvent('authReady', { detail: currentUser }));
}

// ── Sign out ──────────────────────────────────────────────────────────
async function signOut() {
  if (firebaseAuth) {
    await firebaseAuth.signOut();
  }
  localStorage.removeItem('lc_profile');
  window.location.href = 'login.html';
}

// ── Theme ─────────────────────────────────────────────────────────────
function toggleTheme() {
  const btn     = document.getElementById('themeToggleBtn');
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';

  if (btn) {
    const rect = btn.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const size  = Math.hypot(window.innerWidth, window.innerHeight) * 2.2;
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    ripple.style.left   = cx + 'px';
    ripple.style.top    = cy + 'px';
    ripple.style.width  = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.background = next === 'light'
      ? 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)'
      : 'radial-gradient(circle, rgba(13,17,23,0.70) 0%, rgba(8,12,18,0) 70%)';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 580);
  }

  document.documentElement.classList.add('theme-anim');
  applyTheme(next);
  setTimeout(() => document.documentElement.classList.remove('theme-anim'), 450);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('lc_theme', theme);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀' : '🌙';
}

// ── User Badge ────────────────────────────────────────────────────────
function renderUserBadge() {
  const badge = document.getElementById('userBadge');
  if (!badge) return;
  const emoji   = (currentUser && currentUser.avatarEmoji) || '🎭';
  const name    = (currentUser && currentUser.displayName) || 'User';
  const picData = currentUser && currentUser.uid ? localStorage.getItem('lc_pic_' + currentUser.uid) : null;

  let inner;
  if (picData) {
    inner = `<img src="${picData}" alt="${name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;display:block"/>`;
  } else {
    inner = `<span style="font-size:18px;line-height:1">${emoji}</span>`;
  }
  badge.innerHTML = `<div class="user-badge-btn" onclick="toggleProfileDropdown()" title="${name}" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:hidden">${inner}</div>`;
}

function toggleProfileDropdown() {
  const dd     = document.getElementById('profileDropdown');
  const isOpen = dd.style.display === 'block';
  if (isOpen) {
    dd.style.display = 'none';
    dd.classList.remove('dd-open');
  } else {
    dd.style.display = 'block';
    dd.classList.remove('dd-open');
    void dd.offsetWidth;
    dd.classList.add('dd-open');
    if (currentUser) {
      const ddName  = document.getElementById('ddName');
      const ddEmail = document.getElementById('ddEmail');
      if (ddName)  ddName.textContent  = currentUser.displayName || 'User';
      if (ddEmail) ddEmail.textContent = currentUser.email || 'LOST CARD';
    }
  }
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('#profileDropdown') && !e.target.closest('.user-badge-btn') && !e.target.closest('#userBadge')) {
    const dd = document.getElementById('profileDropdown');
    if (dd) dd.style.display = 'none';
  }
});

// ── Profile Edit ──────────────────────────────────────────────────────
function openProfileModal() {
  document.getElementById('profileDropdown').style.display = 'none';
  const p = currentUser || {};

  // Basic fields
  document.getElementById('profileName').value     = p.displayName || '';
  document.getElementById('profileEmail').value    = p.email || '';
  document.getElementById('profileEmojiPrev').textContent = p.avatarEmoji || '🎭';

  // Extended fields from localStorage
  const uid = p.uid || '';
  document.getElementById('profileBio').value      = localStorage.getItem('lc_bio_' + uid) || '';
  document.getElementById('profilePhone').value    = localStorage.getItem('lc_phone_' + uid) || '';
  document.getElementById('profileLocation').value = localStorage.getItem('lc_location_' + uid) || '';

  // Profile pic
  const picData = uid ? localStorage.getItem('lc_pic_' + uid) : null;
  const imgEl   = document.getElementById('profilePicImg');
  const emojiEl = document.getElementById('profileEmojiPrev');
  if (picData) {
    imgEl.src = picData;
    imgEl.style.display = 'block';
    emojiEl.style.display = 'none';
  } else {
    imgEl.style.display = 'none';
    emojiEl.style.display = 'block';
  }

  document.getElementById('profileModal').style.display = 'flex';
}

async function saveProfile() {
  const name     = document.getElementById('profileName').value.trim();
  const emoji    = document.getElementById('profileEmojiPrev').textContent;
  const bio      = document.getElementById('profileBio').value.trim();
  const phone    = document.getElementById('profilePhone').value.trim();
  const location = document.getElementById('profileLocation').value.trim();
  if (!name) { showToast('Enter a display name.', 'error'); return; }

  const btn = document.getElementById('profileSaveBtn');
  btn.disabled = true; btn.textContent = 'Saving...';

  currentUser.displayName = name;
  currentUser.avatarEmoji = emoji;

  const uid = currentUser.uid || '';

  // Save to localStorage
  if (uid) {
    localStorage.setItem('lc_emoji_' + uid,    emoji);
    localStorage.setItem('lc_bio_' + uid,      bio);
    localStorage.setItem('lc_phone_' + uid,    phone);
    localStorage.setItem('lc_location_' + uid, location);
  }

  // Get profile pic (base64) if any
  const picData = uid ? localStorage.getItem('lc_pic_' + uid) : null;

  // Update Firebase + Firestore
  if (firebaseAuth && firebaseAuth.currentUser) {
    await firebaseAuth.currentUser.updateProfile({ displayName: name }).catch(() => {});
    await firebaseDB.collection('users').doc(uid).update({
      displayName: name,
      bio:         bio      || null,
      phone:       phone    || null,
      location:    location || null,
      profilePic:  picData  || null,
      updatedAt:   firebase.firestore.FieldValue.serverTimestamp()
    }).catch(() => {});
  }

  renderUserBadge();
  document.getElementById('profileModal').style.display = 'none';
  showToast('Profile saved!', 'success');

  btn.disabled = false; btn.textContent = 'Save Profile';
}

function pickProfileEmoji(emoji) {
  document.getElementById('profileEmojiPrev').textContent = emoji;
  document.querySelectorAll('.ep-emoji-profile').forEach(b => b.classList.remove('selected-emoji'));
  // Hide profile pic, show emoji
  const imgEl = document.getElementById('profilePicImg');
  if (imgEl) { imgEl.style.display = 'none'; document.getElementById('profileEmojiPrev').style.display = 'block'; }
  // Clear stored pic
  if (currentUser && currentUser.uid) localStorage.removeItem('lc_pic_' + currentUser.uid);
}

// ── Profile Picture ───────────────────────────────────────────────────
function handleProfilePicChange(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Resize to 120x120 via canvas
      const canvas = document.createElement('canvas');
      canvas.width = 120; canvas.height = 120;
      const ctx = canvas.getContext('2d');
      // Crop center square
      const size = Math.min(img.width, img.height);
      const sx   = (img.width  - size) / 2;
      const sy   = (img.height - size) / 2;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 120, 120);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      // Store in localStorage
      if (currentUser && currentUser.uid) {
        localStorage.setItem('lc_pic_' + currentUser.uid, dataUrl);
      }
      // Show preview
      const imgEl   = document.getElementById('profilePicImg');
      const emojiEl = document.getElementById('profileEmojiPrev');
      imgEl.src = dataUrl;
      imgEl.style.display = 'block';
      emojiEl.style.display = 'none';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function clearProfilePic() {
  if (currentUser && currentUser.uid) localStorage.removeItem('lc_pic_' + currentUser.uid);
  const imgEl   = document.getElementById('profilePicImg');
  const emojiEl = document.getElementById('profileEmojiPrev');
  if (imgEl)   { imgEl.src = ''; imgEl.style.display = 'none'; }
  if (emojiEl) emojiEl.style.display = 'block';
}

// ── Save session to Firestore ─────────────────────────────────────────
async function saveSessionToFirestore(sessionData) {
  if (!firebaseDB || !currentUser || !currentUser.uid) return;

  try {
    const uid = currentUser.uid;

    // Save session document
    await firebaseDB.collection('sessions').add({
      uid:            uid,
      email:          currentUser.email || null,
      displayName:    currentUser.displayName || null,
      timestamp:      firebase.firestore.FieldValue.serverTimestamp(),
      chatType:       sessionData.chatType       || 'default',
      finalNLI:       sessionData.finalNLI       || 0,
      cardsLost:      sessionData.cardsLost      || [],
      cardsLostCount: (sessionData.cardsLost || []).length,
      totalMoves:     sessionData.totalMoves     || 0,
      endReason:      sessionData.endReason      || 'completed',
      archetype:      sessionData.archetype      || null,
      healthScore:    sessionData.healthScore    || 0,
      letterGrade:    sessionData.letterGrade    || null,
      softMoves:      sessionData.softMoves      || 0,
      aggressiveMoves:sessionData.aggressiveMoves|| 0,
      silentMoves:    sessionData.silentMoves    || 0,
      finalState:     sessionData.finalState     || 'HARMONY',
      platform:       navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
    });

    // Update user stats
    await firebaseDB.collection('users').doc(uid).update({
      totalSessions: firebase.firestore.FieldValue.increment(1),
      archetype:     sessionData.archetype || null,
      lastSession:   firebase.firestore.FieldValue.serverTimestamp()
    }).catch(() => {});

  } catch(err) {
    console.warn('Session save failed:', err);
  }
}

// ── Backward compatibility ────────────────────────────────────────────
function showAuthModal()    { openProfileModal(); }
function showVeilKeyModal() { openProfileModal(); }
