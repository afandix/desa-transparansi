// ====== public/firebase.js ======
// Tempel firebaseConfig dari Firebase Console di sini:
const firebaseConfig = {
  apiKey: "AIzaSyCA5GWN0S11SFS7YXsZbP_yDFKRvbo4Uss",
  authDomain: "desa-transparansi.firebaseapp.com",
  projectId: "desa-transparansi",
  storageBucket: "desa-transparansi.firebasestorage.app",
  messagingSenderId: "850999393614",
  appId: "1:850999393614:web:2674f8517a2fbd7b1bb21f",
  measurementId: "G-LPWDE4K5YX",
};

// >>> PENTING: ganti 10.12.4 dengan versi persis dari Console-mu,
// dan pastikan SEMUA import di bawah pakai versi YANG SAMA.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Inisialisasi & ekspor instance
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Re-export helper agar bisa diimport dari file lain
export {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
};
