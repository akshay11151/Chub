// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMVQMTd1RrNyAOfm2L3DfeNMpi2sU4eLc",
  authDomain: "collaboratehub-12d03.firebaseapp.com",
  projectId: "collaboratehub-12d03",
  storageBucket: "collaboratehub-12d03.firebasestorage.app",
  messagingSenderId: "961088208613",
  appId: "1:961088208613:web:2cfb941587157f77a35e0c",
  measurementId: "G-4ZR1RK1VCE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
