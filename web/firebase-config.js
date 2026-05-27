// ══════════════════════════════════════════════════════════════════════
// LOST CARD — Firebase Configuration (VeilKey Protocol)
// ══════════════════════════════════════════════════════════════════════
//
//  SETUP — 5 minutes, completely free:
//
//  STEP 1 → firebase.google.com → Add project → name "lostcard" → Continue
//            Disable Google Analytics → Create project → Continue
//
//  STEP 2 → Click "</>" (Web icon) → name "lostcard-web" → Register app
//            COPY the firebaseConfig shown → paste below (replace placeholders)
//
//  STEP 3 → Authentication → Get started → Email/Password → Enable (first toggle) → Save
//
//  STEP 4 → Firestore Database → Create database → Start in production mode
//            Location: asia-south1 → Enable
//
//  STEP 5 → Firestore → Rules tab → PASTE these rules → Publish:
//
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /veilkeys/{uid} {
//          allow read: if request.auth != null;
//          allow write: if request.auth != null && request.auth.uid == uid;
//          allow create: if request.auth != null;
//        }
//        match /lcid_map/{lcId} {
//          allow read: if request.auth != null;
//          allow create: if request.auth != null;
//        }
//        match /sessions/{id} {
//          allow create: if request.auth != null;
//          allow read: if request.auth != null && resource.data.uid == request.auth.uid;
//        }
//      }
//    }
//
//  STEP 6 → Paste your config below:
// ──────────────────────────────────────────────────────────────────────

const FIREBASE_CONFIG = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE"
};

// ══════════════════════════════════════════════════════════════════════
// DO NOT EDIT BELOW THIS LINE
// ══════════════════════════════════════════════════════════════════════

// Automatically detects if config has been filled in
const FIREBASE_ENABLED = !FIREBASE_CONFIG.apiKey.includes('PASTE_YOUR');

// Admin UID — after first sign-up go to:
//   Firebase Console → Authentication → Users → copy your UID → paste here
const ADMIN_UID = 'PASTE_YOUR_ADMIN_UID_HERE';
