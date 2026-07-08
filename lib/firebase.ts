// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = { 
  apiKey : "AIzaSyAXBo5ogzbZyOibWfhZHG2H-zNjsBOFZOc" , 
  authDomain : "jull-1ccd1.firebaseapp.com" , 
  appId : "jull-1ccd1" , 
  storageBucket : "jull-1ccd1.firebasestorage.app" , 
  messagingSenderId : "851437010411" , 
  measurementId : "1:851437010411:web:b16d44609efc13c0b2adae" , 
  projectId : "G-VQ2LD1STW2" 
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };