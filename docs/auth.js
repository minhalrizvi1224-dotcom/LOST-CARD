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

// ── Admin-side config (fetched from Firestore adminSettings/config) ────
let poolGroqKey      = null;   // first key in pool (backward compat)
let poolGroqKeys     = [];     // Groq key pool — up to 10 keys
let poolGeminiKeys   = [];     // Gemini key pool — up to 10 keys
let poolCerebrasKeys = [];     // Cerebras key pool — up to 10 keys
let adminPayNum      = '';     // JazzCash number shown in upgrade modal
let adminWANum       = '';     // WhatsApp number shown in upgrade modal
let stripeLink15d    = '';     // Stripe payment link — 15 Days plan
let stripeLinkMonthly= '';     // Stripe payment link — Monthly plan
let stripeLinkAnnual = '';     // Stripe payment link — Annual plan
let jazzCashTitle    = '';     // Account holder name shown in JazzCash UI
let pkrPrice15d      = 560;   // PKR price for 15-day plan
let pkrPriceMonthly  = 1400;  // PKR price for monthly plan
let pkrPriceAnnual   = 9800;  // PKR price for annual plan

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
      window.location.href = 'login.html';
      return;
    }

    // Fetch user document — try server first, fallback to cache
    let userDoc = null;
    try {
      userDoc = await firebaseDB.collection('users').doc(user.uid).get({ source: 'server' });
    } catch(e) {
      try { userDoc = await firebaseDB.collection('users').doc(user.uid).get(); } catch(e2) {}
    }
    const docData0 = (userDoc && userDoc.exists) ? userDoc.data() : {};

    // Block unverified users EXCEPT old accounts or admins
    const createdAt = user.metadata?.creationTime;
    const isOldAccount = createdAt && new Date(createdAt) < new Date('2026-05-30T00:00:00Z');
    const isAdminUser = docData0.isAdmin === true;
    if (!user.emailVerified && !isOldAccount && !isAdminUser) {
      await firebaseAuth.signOut();
      window.location.href = 'login.html?unverified=1';
      return;
    }

    // Check suspended status
    if (docData0.suspended) {
      await firebaseAuth.signOut();
      window.location.href = 'login.html?suspended=1';
      return;
    }

    // Signed in — use already-fetched docData
    const docData = docData0;
    const nowSec  = Date.now() / 1000;
    const expSec  = docData.planExpiry?.seconds || 0;
    const planActive = docData.hbPlan === 'upgraded' && expSec > nowSec;
    currentUser = {
      uid:              user.uid,
      email:            user.email,
      displayName:      user.displayName || user.email?.split('@')[0] || 'User',
      avatarEmoji:      localStorage.getItem('lc_emoji_' + user.uid) || '🎭',
      isAdmin:          docData.isAdmin === true,
      hbCount:               docData.hbCount               || 0,
      hbPlan:                planActive ? 'upgraded' : 'free',
      planExpiry:            docData.planExpiry             || null,
      upgradePlan:           docData.upgradePlan            || null,
      upgradeRequested:      docData.upgradeRequested       || false,
      upgradeRequestedPlan:  docData.upgradeRequestedPlan   || null,
      geminiKey:             docData.geminiKey              || null,
      defaultChatsCompleted:     docData.defaultChatsCompleted     || [],
      defaultChatsDeepCompleted: docData.defaultChatsDeepCompleted || [],  // 21+ moves only
      chatPlayCounts:            docData.chatPlayCounts            || {}
    };

    // ── Clear stale per-browser data when a DIFFERENT account logs in ────
    // localStorage is shared across all accounts on one device. Without this,
    // a new user inherits the previous user's chat setups, history & prefs.
    const _lastUid = localStorage.getItem('lc_last_uid');
    if (_lastUid && _lastUid !== user.uid) {
      Object.keys(localStorage).filter(k =>
        k.startsWith('lc_setup_') || k === 'lc_sessions' || k === 'lc_profile' ||
        k.startsWith('lc_set_')   || k === 'lc_gemini_key' || k === 'lc_groq_key'
      ).forEach(k => localStorage.removeItem(k));
    }
    localStorage.setItem('lc_last_uid', user.uid);

    // ── Restore profile data from Firestore into localStorage ────────────
    const uid = user.uid;
    if (docData.bio)        localStorage.setItem('lc_bio_'      + uid, docData.bio);
    if (docData.phone)      localStorage.setItem('lc_phone_'    + uid, docData.phone);
    if (docData.location)   localStorage.setItem('lc_location_' + uid, docData.location);
    if (docData.profilePic) localStorage.setItem('lc_pic_'      + uid, docData.profilePic);
    if (docData.displayName) {
      localStorage.setItem('lc_emoji_' + uid, docData.avatarEmoji || currentUser.avatarEmoji || '🎭');
    }

    // ── Load saved preferences from Firestore into localStorage ──────────
    if (docData.preferences) {
      const p = docData.preferences;
      if (p.autoScroll !== undefined) localStorage.setItem('lc_set_autoscroll', p.autoScroll);
      if (p.showHints  !== undefined) localStorage.setItem('lc_set_showhints',  p.showHints);
      if (p.showPsych  !== undefined) localStorage.setItem('lc_set_showpsych',  p.showPsych);
      if (p.showNLIBar !== undefined) localStorage.setItem('lc_set_shownlibar', p.showNLIBar);
    }

    // ── Load saved chat setups from Firestore into localStorage ──────────
    // Scoped by uid so they only ever belong to this account on this browser.
    if (docData.chatSetups && typeof docData.chatSetups === 'object') {
      Object.entries(docData.chatSetups).forEach(([chatId, setup]) => {
        if (setup) localStorage.setItem(`lc_setup_${uid}_${chatId}`, JSON.stringify(setup));
      });
    }

    // ── Helper: apply admin config fields from a Firestore doc ──────────
    function _applyAdminConfig(c) {
      poolGroqKeys    = Array.isArray(c.poolKeys) && c.poolKeys.length
                          ? c.poolKeys
                          : (c.poolKey ? [c.poolKey] : []);
      poolGroqKey     = poolGroqKeys[0] || null;
      poolGeminiKeys  = Array.isArray(c.geminiPoolKeys) && c.geminiPoolKeys.length
                          ? c.geminiPoolKeys : [];
      poolCerebrasKeys = Array.isArray(c.cerebrasPoolKeys) && c.cerebrasPoolKeys.length
                          ? c.cerebrasPoolKeys : [];
      adminPayNum       = c.paymentNumber    || '';
      adminWANum        = c.whatsappNumber   || '';
      stripeLink15d     = c.stripeLink15d    || '';
      stripeLinkMonthly = c.stripeLinkMonthly|| '';
      stripeLinkAnnual  = c.stripeLinkAnnual || '';
      jazzCashTitle     = c.jazzCashTitle    || '';
      pkrPrice15d       = c.pkrPrice15d      || 560;
      pkrPriceMonthly   = c.pkrPriceMonthly  || 1400;
      pkrPriceAnnual    = c.pkrPriceAnnual   || 9800;
    }

    if (docData.isAdmin === true) {
      // Admin: load full pool (all providers) from adminSettings
      await firebaseDB.collection('adminSettings').doc('config').get().then(cfg => {
        if (cfg.exists) _applyAdminConfig(cfg.data());
      }).catch(() => {});

      firebaseDB.collection('adminSettings').doc('config').onSnapshot(cfg => {
        if (cfg.exists) {
          _applyAdminConfig(cfg.data());
          window.dispatchEvent(new CustomEvent('lc-pool-updated'));
        }
      }, () => {});
    } else {
      // Regular users: load keys + payment config from publicConfig/hb
      firebaseDB.collection('publicConfig').doc('hb').onSnapshot(cfg => {
        if (!cfg.exists) return;
        const d = cfg.data();
        if (Array.isArray(d.geminiKeys) && d.geminiKeys.length)
          poolGeminiKeys = d.geminiKeys;
        if (Array.isArray(d.groqKeys) && d.groqKeys.length) {
          poolGroqKeys = d.groqKeys;
          poolGroqKey  = poolGroqKeys[0] || null;
        }
        if (Array.isArray(d.cerebrasKeys) && d.cerebrasKeys.length)
          poolCerebrasKeys = d.cerebrasKeys;
        if (d.paymentNumber) adminPayNum     = d.paymentNumber;
        if (d.whatsappNumber) adminWANum     = d.whatsappNumber;
        if (d.jazzCashTitle) jazzCashTitle   = d.jazzCashTitle;
        if (d.pkrPrice15d)   pkrPrice15d     = d.pkrPrice15d;
        if (d.pkrPriceMonthly) pkrPriceMonthly = d.pkrPriceMonthly;
        if (d.pkrPriceAnnual)  pkrPriceAnnual  = d.pkrPriceAnnual;
        window.dispatchEvent(new CustomEvent('lc-pool-updated'));
      }, () => {});
    }

    // Update last login + mark online
    firebaseDB.collection('users').doc(user.uid).update({
      lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
      isOnline:  true,
      lastSeen:  firebase.firestore.FieldValue.serverTimestamp()
    }).catch(() => {});

    // Heartbeat — keep lastSeen fresh every 90 seconds while page is open
    const _heartbeatInterval = setInterval(() => {
      if (firebaseDB && currentUser && currentUser.uid) {
        firebaseDB.collection('users').doc(currentUser.uid).update({
          lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(() => {});
      }
    }, 90 * 1000);

    // Mark offline on tab close / navigate away (best-effort)
    window.addEventListener('beforeunload', () => {
      if (firebaseDB && currentUser && currentUser.uid) {
        firebaseDB.collection('users').doc(currentUser.uid).update({
          isOnline: false
        }).catch(() => {});
      }
    }, { once: true });

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
  // Mark offline before signing out
  if (firebaseDB && currentUser && currentUser.uid) {
    await firebaseDB.collection('users').doc(currentUser.uid).update({
      isOnline: false
    }).catch(() => {});
  }
  if (firebaseAuth) {
    await firebaseAuth.signOut();
  }
  localStorage.removeItem('lc_profile');
  window.location.href = 'login.html';
}

// ── Theme ─────────────────────────────────────────────────────────────
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';

  // Clean flash overlay — no expanding bubble
  const overlay = document.createElement('div');
  overlay.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;
    background:${next === 'light' ? '#ffffff' : '#0D1117'};
    opacity:0;transition:opacity 0.1s ease;`;
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = '0.45';
    setTimeout(() => {
      applyTheme(next);
      document.documentElement.classList.add('theme-anim');
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        document.documentElement.classList.remove('theme-anim');
      }, 280);
    }, 110);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('lc_theme', theme);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀' : '🌙';
}

// ── Initials avatar helper ────────────────────────────────────────────
// Shows SINGLE first letter only (Instagram/WhatsApp style)
function _initialsAvatar(name, size) {
  const n  = (name || 'U').trim();
  const letter = n[0].toUpperCase(); // always 1 letter
  const palettes = [
    ['#C678DD','#8250DF'], ['#56B6C2','#0969DA'], ['#98C379','#1A7F37'],
    ['#F0883E','#BC4C00'], ['#F85149','#CF222E'], ['#E3B341','#9A6700'],
    ['#58A6FF','#0969DA']
  ];
  const [c1, c2] = palettes[(n.charCodeAt(0) || 0) % palettes.length];
  const fs = Math.round(size * 0.40);
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(135deg,${c1},${c2});display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-size:${fs}px;font-weight:800;color:#fff;flex-shrink:0;user-select:none">${letter}</div>`;
}

// ── User Badge ────────────────────────────────────────────────────────
function renderUserBadge() {
  const badge = document.getElementById('userBadge');
  if (!badge) return;
  const name    = (currentUser && currentUser.displayName) || 'User';
  const picData = currentUser && currentUser.uid ? localStorage.getItem('lc_pic_' + currentUser.uid) : null;

  let inner;
  if (picData) {
    inner = `<img src="${picData}" alt="${name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;display:block"/>`;
  } else {
    inner = _initialsAvatar(name, 32);
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
      const ddPlan  = document.getElementById('ddPlanBadge');
      if (ddName)  ddName.textContent  = currentUser.displayName || 'User';
      if (ddEmail) ddEmail.textContent = currentUser.email || 'LOST CARD';
      if (ddPlan) {
        const isPro = currentUser.hbPlan === 'upgraded';
        ddPlan.textContent = isPro ? '✨ Pro' : '🔓 Free';
        ddPlan.style.cssText = isPro
          ? 'display:inline-block;font-size:10px;font-weight:800;padding:2px 8px;border-radius:20px;background:linear-gradient(90deg,#635BFF,#8B7FFF);color:#fff;letter-spacing:.4px'
          : 'display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:rgba(255,255,255,.08);color:var(--muted);letter-spacing:.4px';
      }
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
  document.getElementById('profileName').value  = p.displayName || '';
  document.getElementById('profileEmail').value = p.email || '';

  // Extended fields from localStorage
  const uid = p.uid || '';
  document.getElementById('profileBio').value      = localStorage.getItem('lc_bio_' + uid) || '';
  document.getElementById('profilePhone').value    = localStorage.getItem('lc_phone_' + uid) || '';
  document.getElementById('profileLocation').value = localStorage.getItem('lc_location_' + uid) || '';

  // Profile pic or initials avatar
  const picData    = uid ? localStorage.getItem('lc_pic_' + uid) : null;
  const imgEl      = document.getElementById('profilePicImg');
  const initialsEl = document.getElementById('profileInitialsAvatar');
  if (picData) {
    imgEl.src = picData;
    imgEl.style.display = 'block';
    if (initialsEl) initialsEl.style.display = 'none';
  } else {
    imgEl.src = '';
    imgEl.style.display = 'none';
    if (initialsEl) {
      initialsEl.style.display = 'flex';
      // Single first letter, color derived from name
      const letter = (p.displayName || 'U').trim()[0].toUpperCase();
      initialsEl.textContent = letter;
    }
  }

  document.getElementById('profileModal').style.display = 'flex';
}

async function saveProfile() {
  const name     = document.getElementById('profileName').value.trim();
  const bio      = document.getElementById('profileBio').value.trim();
  const phone    = document.getElementById('profilePhone').value.trim();
  const location = document.getElementById('profileLocation').value.trim();
  if (!name) { showToast('Enter a display name.', 'error'); return; }

  const btn = document.getElementById('profileSaveBtn');
  btn.disabled = true; btn.textContent = 'Saving...';

  currentUser.displayName = name;

  const uid = currentUser.uid || '';

  // Save to localStorage
  if (uid) {
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

// ── Profile Picture ───────────────────────────────────────────────────
function handleProfilePicChange(input) {
  const file = input.files[0];
  if (!file) return;
  // Guard: must be an image, max 5MB (canvas re-encode below also strips any payload)
  if (!/^image\//.test(file.type)) { alert('Please choose an image file.'); input.value = ''; return; }
  if (file.size > 5 * 1024 * 1024) { alert('Image too large — please choose one under 5MB.'); input.value = ''; return; }
  const reader = new FileReader();
  reader.onerror = () => alert('Could not read that image. Try another file.');
  reader.onload = (e) => {
    const img = new Image();
    img.onerror = () => alert('That file is not a valid image.');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 120; canvas.height = 120;
      const ctx = canvas.getContext('2d');
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2, sy = (img.height - size) / 2;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 120, 120);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      if (currentUser && currentUser.uid) localStorage.setItem('lc_pic_' + currentUser.uid, dataUrl);
      const imgEl      = document.getElementById('profilePicImg');
      const initialsEl = document.getElementById('profileInitialsAvatar');
      imgEl.src = dataUrl;
      imgEl.style.display = 'block';
      if (initialsEl) initialsEl.style.display = 'none';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function clearProfilePic() {
  if (currentUser && currentUser.uid) localStorage.removeItem('lc_pic_' + currentUser.uid);
  const imgEl      = document.getElementById('profilePicImg');
  const initialsEl = document.getElementById('profileInitialsAvatar');
  if (imgEl) { imgEl.src = ''; imgEl.style.display = 'none'; }
  if (initialsEl) {
    initialsEl.style.display = 'flex';
    initialsEl.textContent = ((currentUser && currentUser.displayName) || 'U')[0].toUpperCase();
  }
}

// ── Save session to Firestore ─────────────────────────────────────────
async function saveSessionToFirestore(sessionData, chatId, displayNameOverride) {
  if (!firebaseDB || !currentUser || !currentUser.uid) return;

  try {
    const uid = currentUser.uid;

    // Save session document — sessionData is already fully formed by saveSession() in app.js
    await firebaseDB.collection('sessions').add({
      uid:             uid,
      email:           currentUser.email || null,
      displayName:     currentUser.displayName || null,
      timestamp:       firebase.firestore.FieldValue.serverTimestamp(),
      chatType:        sessionData.chatType          || chatId  || 'default',
      finalNLI:        sessionData.finalNLI          ?? 0,
      finalTrust:      sessionData.finalTrust        ?? 0,
      finalState:      sessionData.finalState        || 'HARMONY',
      cardsLost:       Array.isArray(sessionData.cardsLost) ? sessionData.cardsLost : [],
      cardsLostCount:  sessionData.cardsLostCount    ?? 0,
      totalMoves:      sessionData.totalMoves        ?? 0,
      endReason:       sessionData.endReason         || 'completed',
      terminalCondition: sessionData.terminalCondition ?? 0,
      archetype:       sessionData.archetype         || null,
      healthScore:     sessionData.healthScore       ?? null,
      letterGrade:     sessionData.letterGrade       || null,
      softMoves:       sessionData.softMoves         ?? 0,
      aggressiveMoves: sessionData.aggressiveMoves   ?? 0,
      silentMoves:     sessionData.silentMoves       ?? 0,
      stackMaxDepth:   sessionData.stackMaxDepth     ?? 0,
      chessEval:       sessionData.chessEval         ?? 0,
      amygdalaOverrides: sessionData.amygdalaOverrides ?? 0,
      platform:        /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
    });

    // Update user stats
    await firebaseDB.collection('users').doc(uid).update({
      totalSessions: firebase.firestore.FieldValue.increment(1),
      archetype:     sessionData.archetype || null,
      lastSession:   firebase.firestore.FieldValue.serverTimestamp()
    }).catch(() => {});

    // Auto-purge: if this user's sessions hit 100, delete ALL their sessions (clean slate)
    _autoPurgeSessions(uid).catch(() => {});

  } catch(err) {
    console.warn('Session save failed:', err);
  }
}

async function _autoPurgeSessions(uid) {
  const snap = await firebaseDB.collection('sessions')
    .where('uid', '==', uid)
    .orderBy('savedAt', 'asc')
    .get();
  if (snap.size < 100) return;

  // Keep newest 50, delete the oldest ones
  const toDelete = snap.docs.slice(0, snap.size - 50);
  const batch = firebaseDB.batch();
  toDelete.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  await firebaseDB.collection('users').doc(uid).update({
    totalSessions: 50
  }).catch(() => {});
}

// ── Backward compatibility ────────────────────────────────────────────
function showAuthModal()    { openProfileModal(); }
function showVeilKeyModal() { openProfileModal(); }
