import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDxPVyQWyk6a32yDnBIZOObOUROqzQk0Bw",
  authDomain: "clients-manager-5cba3.firebaseapp.com",
  projectId: "clients-manager-5cba3",
  storageBucket: "clients-manager-5cba3.firebasestorage.app",
  messagingSenderId: "142435176340",
  appId: "1:142435176340:web:8167d0856834b4f3c94981",
  measurementId: "G-8QEJE5Q5JT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);