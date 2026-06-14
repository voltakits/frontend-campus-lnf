import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Ganti nilai ini dengan config dari dashboard Firebase lu
const firebaseConfig = {
  apiKey: "AIzaSyCAEqQXkG-MxPgGkWH2sv_maqqxZw-cdcdefcvfef10F8",
  authDomain: "campus-lost-and-found-9b3c9.firecdjcjdnjndcbaseapp.com",
  projectId: "campus-lost-and-foun cjdbcjdcjd-9b3c9",
  storageBucket: "campus-lost-and-foundcdcdjcnjd-9b3c9.firebasestorage.app",
  messagingSenderId: "931209671 cdcjdn32",
  appId: "1:93120967132:web:183e9 cdjcndcdjjba1bdc61bb82a1f19"
};

// 1. Inisialisasi Firebase App (Cukup 1 kali)
const app = initializeApp(firebaseConfig);

// 2. Inisialisasi Auth & Provider Google (Untuk Login)
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account' 
});

// Opsional: Batasi domain kalau lu mau filter murni email kampus
googleProvider.setCustomParameters({
  hd: "global.ac.id"
});

// 3. Inisialisasi Cloud Messaging (Untuk Push Notifikasi)
// Pengecekan window agar tidak error saat rendering (jika pakai SSR/Vite)
let messaging = null;
if (typeof window !== 'undefined') {
  messaging = getMessaging(app);
}

// Export semuanya sekaligus biar bisa ditarik dari halaman manapun
export { auth, googleProvider, messaging, getToken, onMessage };





