// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYMGJc2nCsyYRbAtIPfTfX1lLe1cAjaX0",
  authDomain: "auteam-installer-task-authent.firebaseapp.com",
  projectId: "auteam-installer-task-authent",
  storageBucket: "auteam-installer-task-authent.appspot.com",
  messagingSenderId: "586480071920",
  appId: "1:586480071920:web:28c38001e12f2422b3fe35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;