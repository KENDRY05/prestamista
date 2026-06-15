import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCr7v2OfDRQkhPAkDEP6st2xfS-GQ1cz9g",
  authDomain: "prestamista-fe1c0.firebaseapp.com",
  projectId: "prestamista-fe1c0",
  storageBucket: "prestamista-fe1c0.firebasestorage.app",
  messagingSenderId: "319679135253",
  appId: "1:319679135253:web:671d24954f2ff8e230581c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);