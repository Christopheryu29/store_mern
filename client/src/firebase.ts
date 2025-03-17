// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "store-mern-f95fa.firebaseapp.com",
  projectId: "store-mern-f95fa",
  storageBucket: "store-mern-f95fa.firebasestorage.app",
  messagingSenderId: "26993307588",
  appId: "1:26993307588:web:96d092515289bd33c03e91",
  measurementId: "G-MJN8SSQPY9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
