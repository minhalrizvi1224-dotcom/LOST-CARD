// ══════════════════════════════════════════════════════════════════════
// LOST CARD - Firebase Configuration
// S. M. Minhal Abbas Rizvi | 2026
// ══════════════════════════════════════════════════════════════════════
//
//  ONE-TIME SETUP (5 minutes, completely free):
//
//  STEP 1: firebase.google.com → Add project → name "lostcard-app"
//          Disable Analytics → Create project
//
//  STEP 2: Click </> (Web) → nickname "lostcard-web" → Register app
//          COPY the firebaseConfig object → paste below
//
//  STEP 3: Authentication → Get started → Email/Password → Enable → Save
//
//  STEP 4: Firestore Database → Create database → Production mode
//          Location: asia-south1 → Enable
//
//  STEP 5: Firestore → Rules → paste these rules → Publish:
//
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /users/{uid} {
//          allow read, write: if request.auth != null && request.auth.uid == uid;
//        }
//        match /sessions/{id} {
//          allow create: if request.auth != null;
//          allow read: if request.auth != null && resource.data.uid == request.auth.uid;
//        }
//        match /admin_sessions/{id} {
//          allow read, write: if false;
//        }
//      }
//    }
//
//  STEP 6: Paste your config below:
// ──────────────────────────────────────────────────────────────────────

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCDfbF_p6rcFjF5gD1tO9h96xdq9AIroRw",
  authDomain:        "lostcard-app.firebaseapp.com",
  projectId:         "lostcard-app",
  storageBucket:     "lostcard-app.firebasestorage.app",
  messagingSenderId: "507110606867",
  appId:             "1:507110606867:web:2eadc8d669d538d9f7d7e6"
};

// ──────────────────────────────────────────────────────────────────────
// ADMIN SETUP:
//   1. Sign up in the app with your own email
//   2. Firebase Console → Authentication → Users → copy YOUR uid
//   3. Paste it below (keep quotes)
// ──────────────────────────────────────────────────────────────────────
const ADMIN_UID = 'gHFlKHBDODOp1zXQ1T304skhITi1';

// ──────────────────────────────────────────────────────────────────────
// DO NOT EDIT BELOW
// ──────────────────────────────────────────────────────────────────────
const FIREBASE_ENABLED = !FIREBASE_CONFIG.apiKey.includes('PASTE_YOUR');
const IS_ADMIN = (uid) => uid === ADMIN_UID && ADMIN_UID !== 'PASTE_YOUR_UID_HERE';
