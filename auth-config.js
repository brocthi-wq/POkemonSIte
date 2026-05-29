/* ==============================
   Firebase Configuration
   ============================== */

const firebaseConfig = {
  apiKey: "AIzaSyCr1B9DpzHwktKKzaV5-buKcibs_4EXJKk",
  authDomain: "pokedex-17938.firebaseapp.com",
  projectId: "pokedex-17938",
  storageBucket: "pokedex-17938.firebasestorage.app",
  messagingSenderId: "268509858726",
  appId: "1:268509858726:web:1a644d77d3affc8d619d67",
  measurementId: "G-3GZ307S10L"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
