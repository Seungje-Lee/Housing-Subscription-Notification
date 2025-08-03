// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
//import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDuzvNDqORh11ocz6EMjYOT9geILidVs48",
  authDomain: "housing-subscription-noti.firebaseapp.com",
  projectId: "housing-subscription-noti",
  storageBucket: "housing-subscription-noti.firebasestorage.app",
  messagingSenderId: "433534291668",
  appId: "1:433534291668:web:48566fd4029ab0ad7ff541",
  measurementId: "G-2W92N01Z0Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("From FIrebase", app);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
