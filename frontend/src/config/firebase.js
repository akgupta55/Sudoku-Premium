import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAuaJ7UGq66XvdZo5Vsi2CDJgEGwdovDBM",
    authDomain: "sudoku-premium-a9954.firebaseapp.com",
    projectId: "sudoku-premium-a9954",
    storageBucket: "sudoku-premium-a9954.firebasestorage.app",
    messagingSenderId: "253883724769",
    appId: "1:253883724769:web:5dc1f59339b5891c5e98a0",
    measurementId: "G-TJKKQ78EL6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
