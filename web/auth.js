// ══════════════════════════════════════════════════════════════════════
// LOST CARD - Profile & Theme
// Simple localStorage-based profile. No login required.
// S. M. Minhal Abbas Rizvi | 2026
// ══════════════════════════════════════════════════════════════════════

'use strict';

let currentUser = null;

// ── Initialize ────────────────────────────────────────────────────────
function initAuth() {
  applyTheme(localStorage.getItem('lc_theme') || 'dark');
  const stored = localStorage.getItem('lc_profile');
  const defaults = { displayName: 'Minhal', avatarEmoji: '🃏', about: 'The Bet of Belief' };
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      // Upgrade old default placeholder name
      if (currentUser.displayName === 'User' && currentUser.avatarEmoji === '🎭') {
        currentUser = { ...defaults };
        localStorage.setItem('lc_profile', JSON.stringify(currentUser));
      }
    } catch(e) { currentUser = { ...defaults }; }
  } else {
    currentUser = { ...defaults };
  }
  renderUserBadge();
}

// ── Theme ─────────────────────────────────────────────────────────────
function toggleTheme() {
  const btn  = document.getElementById('themeToggleBtn');
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';

  // Create ripple from the button's center
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
    // Dark→Light: bright/warm ripple;  Light→Dark: cool/blue ripple
    ripple.style.background = next === 'light'
      ? 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)'
      : 'radial-gradient(circle, rgba(13,17,23,0.70) 0%, rgba(8,12,18,0) 70%)';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 580);
  }

  // Enable smooth color transitions for the duration
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
  const emoji = (currentUser && currentUser.avatarEmoji) || '🎭';
  const name  = (currentUser && currentUser.displayName)  || 'User';
  badge.innerHTML = '<div class="user-badge-btn" onclick="toggleProfileDropdown()" title="' + name + '"><span style="font-size:18px;line-height:1">' + emoji + '</span></div>';
}

function toggleProfileDropdown() {
  const dd     = document.getElementById('profileDropdown');
  const isOpen = dd.style.display === 'block';
  if (isOpen) {
    dd.style.display = 'none';
    dd.classList.remove('dd-open');
  } else {
    dd.style.display = 'block';
    // Trigger slide-down animation
    dd.classList.remove('dd-open');
    void dd.offsetWidth;           // force reflow
    dd.classList.add('dd-open');
    if (currentUser) {
      const ddName  = document.getElementById('ddName');
      const ddEmail = document.getElementById('ddEmail');
      if (ddName)  ddName.textContent  = currentUser.displayName || 'User';
      if (ddEmail) ddEmail.textContent = currentUser.about || 'LOST CARD Profile';
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
  document.getElementById('profileName').value  = p.displayName || '';
  document.getElementById('profileAbout').value = p.about       || '';
  document.getElementById('profileEmojiPrev').textContent = p.avatarEmoji || '🎭';
  document.getElementById('profileModal').style.display = 'flex';
}

function saveProfile() {
  const name  = document.getElementById('profileName').value.trim();
  const about = document.getElementById('profileAbout').value.trim();
  const emoji = document.getElementById('profileEmojiPrev').textContent;
  if (!name) { showToast('Enter a display name.', 'error'); return; }

  const btn = document.getElementById('profileSaveBtn');
  btn.disabled = true; btn.textContent = 'Saving…';

  currentUser = { displayName: name, about, avatarEmoji: emoji };
  localStorage.setItem('lc_profile', JSON.stringify(currentUser));
  renderUserBadge();
  document.getElementById('profileModal').style.display = 'none';
  showToast('Profile saved!', 'success');

  btn.disabled = false; btn.textContent = 'Save Profile';
}

function pickProfileEmoji(emoji) {
  document.getElementById('profileEmojiPrev').textContent = emoji;
  document.querySelectorAll('.ep-emoji-profile').forEach(b => b.classList.remove('selected-emoji'));
}

// ── Session save stub (no Firebase - sessions saved locally in app.js) ─
async function saveSessionToFirestore() { /* no-op */ }

// ── Backward compatibility stubs ──────────────────────────────────────
function showAuthModal()    { openProfileModal(); }
function showVeilKeyModal() { openProfileModal(); }
function signOut()          { /* no auth to sign out of */ }
