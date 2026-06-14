import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCAEqQXkG-MxPgGkWH2sv_maqqxZw-10F8",
  authDomain: "campus-lost-and-found-9b3c9.firebaseapp.com",
  projectId: "campus-lost-and-found-9b3c9",
  storageBucket: "campus-lost-and-found-9b3c9.firebasestorage.app",
  messagingSenderId: "93120967132",
  appId: "1:93120967132:web:183e9ba1bdc61bb82a1f19"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ✅ Gabung jadi SATU setCustomParameters
googleProvider.setCustomParameters({
  prompt: 'select_account', // selalu muncul popup pilih akun
  hd: 'global.ac.id'        // filter hanya akun @global.ac.id
});

let messaging = null;
if (typeof window !== 'undefined') {
  messaging = getMessaging(app);
}

export { auth, googleProvider, messaging, getToken, onMessage };