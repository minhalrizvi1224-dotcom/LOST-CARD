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
  const startIdx = isGemini ? _geminiIdx : _groqIdx;
  let lastErr    = 'All API keys unavailable.';
  let result     = null;

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
      // Advance round-robin pointer for next call
      if (isGemini) _geminiIdx = (idx + 1) % keys.length;
      else          _groqIdx   = (idx + 1) % keys.length;

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
