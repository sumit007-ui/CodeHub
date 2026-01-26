// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Replace the config below with your Firebase project's config if different
const firebaseConfig = {
  apiKey: "AIzaSyAmCuF-ywbXDpJxEL1BI7TvZQYGhEtfneI",
  authDomain: "codehub-ffcec.firebaseapp.com",
  projectId: "codehub-ffcec",
  storageBucket: "codehub-ffcec.firebasestorage.app",
  messagingSenderId: "297782686555",
  appId: "1:297782686555:web:0cf5020275f1f5c116207e",
  measurementId: "G-VC5G7V8Y5G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
