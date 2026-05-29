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
//        function isAdmin() {
//          return request.auth != null
//            && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
//        }
//        match /users/{uid} {
//          allow read: if request.auth != null && request.auth.uid == uid;
//          allow create: if request.auth != null && request.auth.uid == uid
//            && !request.resource.data.keys().hasAny([
//                 'isAdmin','suspended','hbPlan','planExpiry',
//                 'upgradePlan','warningCount','warnings','geminiKey'
//               ]);
//          allow update: if request.auth != null && request.auth.uid == uid
//            && !request.resource.data.diff(resource.data).affectedKeys().hasAny([
//                 'isAdmin','suspended','hbPlan','planExpiry',
//                 'upgradePlan','warningCount','warnings','geminiKey'
//               ]);
//          allow read, write: if isAdmin();
//        }
//        match /sessions/{id} {
//          allow create: if request.auth != null;
//          allow read: if request.auth != null && resource.data.uid == request.auth.uid;
//          allow read, write, delete: if isAdmin();
//        }
//        match /hairBandLogs/{id} {
//          allow create: if request.auth != null;
//          allow read, write, delete: if isAdmin();
//        }
//        match /adminSettings/{doc} {
//          allow read, write: if isAdmin();
//        }
//        match /complaints/{id} {
//          allow create: if request.auth != null;
//          allow read, write, delete: if isAdmin();
//        }
//        match /loginAttempts/{id} {
//          allow read, write: if true;
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
//   2. Firebase Console → Firestore → users → your UID doc
//   3. Add field: isAdmin = true (boolean)
// ──────────────────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────────────────
// DO NOT EDIT BELOW
// ──────────────────────────────────────────────────────────────────────
const FIREBASE_ENABLED = !FIREBASE_CONFIG.apiKey.includes('PASTE_YOUR');
// Admin check uses Firestore isAdmin field — no UID hardcoded here
const IS_ADMIN = () => false;
