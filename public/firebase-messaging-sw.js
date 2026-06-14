// Import script Firebase untuk Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// MASUKKAN CONFIG FIREBASE LU DI SINI
const firebaseConfig = {
  apiKey: "AIzaSyCAEqQXkG-MxPgGkWH2sv_maqqxZw-10F8",
  authDomain: "campus-lost-and-found-9b3c9.firebaseapp.com",
  projectId: "campus-lost-and-found-9b3c9",
  storageBucket: "campus-lost-and-found-9b3c9.firebasestorage.app",
  messagingSenderId: "93120967132",
  appId: "1:93120967132:web:183e9ba1bdc61bb82a1f19"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Biarkan kosong, ini cuma buat 'pancingan' biar Firebase tahu ada Service Worker
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
});