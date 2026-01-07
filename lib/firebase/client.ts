import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

function getFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const missing = Object.entries(config)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase env vars: ${missing.join(", ")}. ` +
        "Add them to .env.local (see .env.example)."
    );
  }

  return config as Required<typeof config>;
}

export function getFirebaseApp() {
  if (!getApps().length) {
    initializeApp(getFirebaseConfig());
  }
  return getApps()[0]!;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}
