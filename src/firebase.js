import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6rGj9CTtgT2Bk_w0ba6mqUuNCZeUGwvw",
  authDomain: "sweetsale2023lb.firebaseapp.com",
  projectId: "sweetsale2023lb",
  storageBucket: "sweetsale2023lb.appspot.com",
  messagingSenderId: "167795240276",
  appId: "1:167795240276:web:89bf2ff74f3b10f789ecc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize authentication
export const auth = getAuth(app);

// Initialize database (firestore)
export const db = getFirestore(app);

export default app