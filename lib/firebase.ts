// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from "firebase/app";
// @ts-ignore - getReactNativePersistence ada & jalan normal di runtime RN,
// tapi belum ke-cover di file deklarasi tipe Firebase (known issue, bukan bug kita).
import { initializeAuth, getReactNativePersistence, getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXBo5ogzbZyOibWfhZHG2H-zNjsBOFZOc",
  authDomain: "jull-1ccd1.firebaseapp.com",
  projectId: "jull-1ccd1",
  storageBucket: "jull-1ccd1.firebasestorage.app",
  messagingSenderId: "851437010411",
  appId: "1:851437010411:web:b16d44609efc13c0b2adae",
  measurementId: "G-VQ2LD1STW2",
};

// Initialize Firebase (hanya sekali)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// PENTING: pakai initializeAuth + AsyncStorage, bukan getAuth() polos.
// Tanpa persistence, sesi login Firebase Auth di React Native/Expo cuma
// disimpan di memori dan HILANG tiap kali app di-reload/restart.
// Saat itu terjadi, auth.currentUser jadi null, lalu
// recycle-history-context.tsx mengosongkan `history` karena mengira
// kamu belum login — makanya riwayat kelihatan kosong padahal
// datanya masih aman di Firestore.
//
// Dibungkus try/catch karena initializeAuth cuma boleh dipanggil SEKALI
// per app instance. Saat Fast Refresh di development, file ini kadang
// dievaluasi ulang tapi `app` yang sama masih ada, jadi initializeAuth
// akan throw "already initialized" - kita tangkap dan pakai getAuth() saja.
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };