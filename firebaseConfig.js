// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJ5VzqCEtYOSGe02-t8Luit9Q3xWKZiHE",
  authDomain: "lezzetli-app-projesi.firebaseapp.com",
  projectId: "lezzetli-app-projesi",
  storageBucket: "lezzetli-app-projesi.firebasestorage.app",
  messagingSenderId: "915939464004",
  appId: "1:915939464004:web:0e3e478ae14a6a5e4bbd11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
