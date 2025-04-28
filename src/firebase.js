// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpRT6ckV4xYu-dQnBAwaLRwnZI4ARAjGU",
  authDomain: "math-75c23.firebaseapp.com",
  projectId: "math-75c23",
  storageBucket: "math-75c23.firebasestorage.app",
  messagingSenderId: "1073294969920",
  appId: "1:1073294969920:web:acc776f27fb45f91fee3a5",
  measurementId: "G-SKB4WTRBCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);