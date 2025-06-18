// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Platform } from 'react-native';

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

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);

// React Native specific configuration
if (Platform.OS !== 'web') {
  // React Native için AsyncStorage persistence ayarlanacak
  // Bu Expo Go'da otomatik olarak yapılır
  console.log('Firebase initialized for React Native');
}
