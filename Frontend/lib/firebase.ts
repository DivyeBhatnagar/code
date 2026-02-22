import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCWHKPBt3p-zO_Lm1A6g5TgoHB9dQ0zfBg",
  authDomain: "codepilot-ai--divye.firebaseapp.com",
  projectId: "codepilot-ai--divye",
  storageBucket: "codepilot-ai--divye.firebasestorage.app",
  messagingSenderId: "898956962142",
  appId: "1:898956962142:web:159d6fa4586d42292f87cf",
  measurementId: "G-HQLWQV7MDW"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Set authentication persistence to LOCAL (persists even after browser close)
// This ensures users remain logged in until they explicitly log out
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting auth persistence:", error);
  });
}

// Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
