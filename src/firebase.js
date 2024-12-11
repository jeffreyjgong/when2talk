// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; // If needed for admin login flow
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyClPZzHK7C_i9THAmtkKNJzxGuu2ZXob2M",
  authDomain: "when2talk-29288.firebaseapp.com",
  projectId: "when2talk-29288",
  storageBucket: "when2talk-29288.firebasestorage.app",
  messagingSenderId: "351086585855",
  appId: "1:351086585855:web:cc352dbb4a2483d1eee9ca",
  measurementId: "G-797GFSLXGK"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
