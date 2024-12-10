import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCaCS1sjsA49WVdwEzH1H1oZ646KWylxl8",
  authDomain: "willy-services.firebaseapp.com",
  projectId: "willy-services",
  storageBucket: "willy-services.firebasestorage.app",
  messagingSenderId: "16935127425",
  appId: "1:16935127425:web:a7e9b480ba6ffe7dd40080"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);