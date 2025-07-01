// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNGlOg-2-2H5d_x018zMcDWemhyXlnGh8",
  authDomain: "productivity-dashboard-14cef.firebaseapp.com",
  projectId: "productivity-dashboard-14cef",
  storageBucket: "productivity-dashboard-14cef.firebasestorage.app",
  messagingSenderId: "239386163467",
  appId: "1:239386163467:web:14ffa007b7f95178c9ca0e",
  measurementId: "G-WB9VSDJZWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)
