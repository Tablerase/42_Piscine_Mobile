import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ! Issues with persistency Metro/Expo and Firebase - not resolved at time of commit: https://github.com/firebase/firebase-js-sdk/issues/8798
// ! Suppress Firebase Auth AsyncStorage warning
// ! WebChannelConnection RPC error - common during dev (network, hot reload, metro/expo connections)
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = String(args[0] || "");
  if (
    message.includes("@firebase/auth") ||
    message.includes("AsyncStorage") ||
    message.includes("RPC 'Listen'")
  ) {
    return;
  }
  originalWarn(...args);
};

// Refresh token: expires only at user deleted or disabled
// Id token: last for an hour

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use the existing app
}

export { app }; // Export the app instance

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

export const db = getFirestore(app);

// Firestore

export interface DiaryNote {
  id: string;
  title: string;
  text: string;
  date: any;
  usermail: string;
  icon: string;
  emotionLevel: number;
}
