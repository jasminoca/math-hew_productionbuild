// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBpRT6ckV4xYu-dQnBAwaLRwnZI4ARAjGU",
    authDomain: "math-75c23.firebaseapp.com",
    projectId: "math-75c23",
    storageBucket: "math-75c23.firebasestorage.app",
    messagingSenderId: "1073294969920",
    appId: "1:1073294969920:web:acc776f27fb45f91fee3a5",
    measurementId: "G-SKB4WTRBCX"
};  
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
