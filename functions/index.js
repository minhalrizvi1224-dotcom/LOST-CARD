'use strict';
// LOST CARD — Firebase Cloud Function: AI Proxy
// S. M. Minhal Abbas Rizvi | 2026
//
// Keys are stored in Firestore adminSettings/config by the admin panel.
// The Admin SDK reads them server-side — they are NEVER exposed to the browser.

const functions = require('firebase-functions');
const admin     = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// ── Round-robin pointers (survive within one function instance) ───────
let _groqIdx   = 0;
let _geminiIdx = 0;

// ── Load keys from Firestore adminSettings/config ────────────────────
// Admin SDK bypasses Firestore security rules — regular users cannot read these.
async function _loadKeys() {
  const snap = await db.collection('adminSettings').doc('config').get();
  if (!snap.exists) return { groq: [], gemini: [] };
  const c = snap.data();
  const groq = Array.isArray(c.poolKeys) && c.poolKeys.length
    ? c.poolKeys
    : (c.poolKey ? [c.poolKey] : []);
  const gemini = Array.isArray(c.geminiPoolKeys) && c.geminiPoolKeys.length
    ? c.geminiPoolKeys : [];
  return { groq, gemini };
}

// ── AI Proxy — callable function ──────────────────────────────────────
// Client calls: firebase.functions().httpsCallable('ai')({ provider, messages, maxTokens })
exports.ai = functions
  .runWith({ timeoutSeconds: 30, memory: '256MB' })
  .https.onCall(async (data, context) => {

  // 1. Must be authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required.');
  }
  const uid = context.auth.uid;

  // 2. Check account not suspended
  const userSnap = await db.collection('users').doc(uid).get().catch(() => null);
  if (userSnap && userSnap.exists && userSnap.data().suspended === true) {
    throw new functions.https.HttpsError('permission-denied', 'Account suspended.');
  }

  // 3. Validate input
  const { provider, messages, maxTokens } = data || {};
  if (!Array.isArray(messages) || !messages.length) {
    throw new functions.https.HttpsError('invalid-argument', 'messages[] required.');
  }

  // 4. Load keys from Firestore (server-side — Admin SDK, bypasses security rules)
  const keyPool  = await _loadKeys();
  const isGemini = (provider === 'gemini');
  const keys     = isGemini ? keyPool.gemini : keyPool.groq;

  if (!keys.length) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      isGemini
        ? 'No Gemini keys configured. Add them in the admin panel under Pool Keys.'
        : 'No Groq keys configured. Add them in the admin panel under Pool Keys.'
    );
  }

  // 5. API endpoint + model
  const url   = isGemini
    ? 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
    : 'https://api.groq.com/openai/v1/chat/completions';
  const model = isGemini ? 'gemini-2.0-flash' : 'llama-3.3-70b-versatile';

  // 6. Try keys round-robin, skip 429 / 402 / 401
  // Grab and advance the pointer BEFORE the first await so concurrent
  // requests each get a unique starting slot (fixes race condition).
  const startIdx = isGemini ? _geminiIdx : _groqIdx;
  if (isGemini) _geminiIdx = (startIdx + 1) % keys.length;
  else          _groqIdx   = (startIdx + 1) % keys.length;

  let lastErr = 'All API keys unavailable.';
  let result  = null;

  for (let i = 0; i < keys.length; i++) {
    const idx = (startIdx + i) % keys.length;
    const key = keys[idx];

    let resp;
    try {
      resp = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model,
          messages:   messages.slice(-6),
          max_tokens: Math.min(maxTokens || 500, 800),
          temperature: 0.9
        })
      });
    } catch(netErr) {
      lastErr = netErr.message;
      continue;
    }

    if (resp.ok) {

      const json = await resp.json();
      result = json.choices?.[0]?.message?.content?.trim() || '';
      break;
    }

    // Key-level error → try next key
    if ([429, 402, 401].includes(resp.status)) {
      const body = await resp.json().catch(() => ({}));
      lastErr = body?.error?.message || `HTTP ${resp.status}`;
      continue;
    }

    // Server error — stop trying
    lastErr = `HTTP ${resp.status}`;
    break;
  }

  if (result === null) {
    throw new functions.https.HttpsError('unavailable', lastErr);
  }

  return { text: result };
});

// ── Send Verification Email via Resend ────────────────────────────────
// Called from login.html right after account creation.
// Admin SDK generates the Firebase verification link,
// Resend delivers a branded HTML email — goes to inbox, not spam.
exports.sendVerificationEmail = functions
  .runWith({ timeoutSeconds: 20, memory: '128MB' })
  .https.onCall(async (data, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required.');
  }

  const { email, displayName } = data || {};
  if (!email) throw new functions.https.HttpsError('invalid-argument', 'Email required.');

  // Load Resend key from Firestore only — never hardcoded in source
  let resendKey = null;
  try {
    const cfg = await db.collection('adminSettings').doc('config').get();
    if (cfg.exists && cfg.data().resendKey) resendKey = cfg.data().resendKey;
  } catch(e) {}
  if (!resendKey) {
    throw new functions.https.HttpsError('failed-precondition', 'Email service not configured. Add resendKey to adminSettings/config.');
  }

  // Generate Firebase email verification link (Admin SDK)
  const verificationLink = await admin.auth()
    .generateEmailVerificationLink(email)
    .catch(err => { throw new functions.https.HttpsError('internal', 'Could not generate link: ' + err.message); });

  const name = displayName || email.split('@')[0];

  // Beautiful HTML email
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0D1117;font-family:'Segoe UI',system-ui,sans-serif">
  <div style="max-width:480px;margin:40px auto;background:#161B22;border:1px solid #30363D;border-radius:16px;overflow:hidden">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#C678DD,#56B6C2);padding:32px 36px;text-align:center">
      <div style="display:inline-block;background:rgba(13,17,23,0.5);border-radius:10px;padding:8px 18px;font-size:20px;font-weight:800;letter-spacing:4px;color:#fff">LOST CARD</div>
      <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:8px;letter-spacing:1px">A Computational Model of Relational Belief Decay</div>
    </div>
    <!-- Body -->
    <div style="padding:36px">
      <div style="font-size:15px;color:#E6EDF3;line-height:1.7;margin-bottom:28px">
        Hello <strong>${name}</strong>,<br><br>
        Welcome to LOST CARD. Verify your email to activate your account.
      </div>
      <!-- Button -->
      <div style="text-align:center;margin-bottom:28px">
        <a href="${verificationLink}"
           style="display:inline-block;background:linear-gradient(135deg,#C678DD,#56B6C2);color:#0D1117;font-weight:800;font-size:15px;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.5px">
          ✓ &nbsp;Verify My Email
        </a>
      </div>
      <div style="font-size:12px;color:#8B949E;line-height:1.6;border-top:1px solid #30363D;padding-top:20px">
        This link expires in <strong style="color:#E6EDF3">24 hours</strong>.<br>
        If you did not create an account, ignore this email.
      </div>
    </div>
    <!-- Footer -->
    <div style="padding:16px 36px;background:#0D1117;text-align:center;font-size:11px;color:#8B949E">
      LOST CARD &nbsp;·&nbsp; S. M. Minhal Abbas Rizvi &nbsp;·&nbsp; 2026
    </div>
  </div>
</body>
</html>`;

  // Send via Resend
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type':  'application/json'
    },
    body: JSON.stringify({
      from:    'LOST CARD <onboarding@resend.dev>',
      to:      [email],
      subject: 'Verify your LOST CARD account',
      html
    })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new functions.https.HttpsError('internal', 'Email failed: ' + (err.message || resp.status));
  }

  return { success: true };
});

// ── Server-side login lockout ─────────────────────────────────────────
// Lockout state lives in Firestore lockouts/{base64(email)} — only the
// Admin SDK (via these functions) can write it, so it cannot be bypassed
// by clearing localStorage or editing DevTools.

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_MS      = 24 * 60 * 60 * 1000; // 24 hours

function _lockDocId(email) {
  return Buffer.from(email.toLowerCase().trim()).toString('base64');
}

// Called before Firebase sign-in to check if email is locked out.
// No auth required — this runs before the user can authenticate.
exports.checkLock = functions
  .runWith({ timeoutSeconds: 10, memory: '128MB' })
  .https.onCall(async (data) => {
  const email = (data.email || '').toLowerCase().trim();
  if (!email) return { locked: false, attempts: 0 };

  const snap = await db.collection('lockouts').doc(_lockDocId(email)).get().catch(() => null);
  if (!snap || !snap.exists) return { locked: false, attempts: 0 };

  const d = snap.data();
  if (d.lockUntil && d.lockUntil.toMillis() > Date.now()) {
    const hrs = Math.ceil((d.lockUntil.toMillis() - Date.now()) / 3600000);
    return { locked: true, hrs };
  }
  return { locked: false, attempts: d.attempts || 0 };
});

// Called after a failed sign-in attempt. Atomically increments counter.
// No auth required — called on wrong-password before login succeeds.
exports.recordFailedAttempt = functions
  .runWith({ timeoutSeconds: 10, memory: '128MB' })
  .https.onCall(async (data) => {
  const email = (data.email || '').toLowerCase().trim();
  if (!email) return { locked: false, attemptsLeft: MAX_LOGIN_ATTEMPTS };

  // Only track emails that exist in our users collection (prevents locking strangers)
  const userQ = await db.collection('users').where('email', '==', email).limit(1).get().catch(() => null);
  if (!userQ || userQ.empty) return { locked: false, attemptsLeft: MAX_LOGIN_ATTEMPTS };

  const ref = db.collection('lockouts').doc(_lockDocId(email));
  let attempts = 1;
  let locked   = false;

  await db.runTransaction(async t => {
    const snap = await t.get(ref);
    const cur  = snap.exists ? (snap.data().attempts || 0) : 0;
    attempts   = cur + 1;
    locked     = attempts >= MAX_LOGIN_ATTEMPTS;
    const lockUntil = locked
      ? admin.firestore.Timestamp.fromDate(new Date(Date.now() + LOGIN_LOCK_MS))
      : null;
    t.set(ref, {
      email, attempts, lockUntil,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  return { locked, attemptsLeft: Math.max(0, MAX_LOGIN_ATTEMPTS - attempts) };
});

// Called after a successful login to reset the counter.
// Requires auth (user just logged in successfully).
exports.clearLock = functions
  .runWith({ timeoutSeconds: 10, memory: '128MB' })
  .https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required.');
  const email = (data.email || '').toLowerCase().trim();
  if (!email) return { ok: true };
  await db.collection('lockouts').doc(_lockDocId(email)).delete().catch(() => {});
  return { ok: true };
});
