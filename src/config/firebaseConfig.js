import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9xjXEjvRum5msDVhjZFQwKotL9_YM64M",
  authDomain: "habitapp-d5155.firebaseapp.com",
  projectId: "habitapp-d5155",
  storageBucket: "habitapp-d5155.firebasestorage.app",
  messagingSenderId: "861867771680",
  appId: "1:861867771680:web:bb9715d01026da83fd7945"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Auth 초기화

export { db, auth }; // Firestore와 Auth 내보내기
export default app; // Firebase 앱 내보내기