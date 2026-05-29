/* ----------------------------------------------------
   ⚙️  INITIALISATION Firebase
   ---------------------------------------------------- */
const firebaseConfig = {
    apiKey: "AIzaSyCr1B9DpzHwktKKzaV5-buKcibs_4EXJKk",
  authDomain: "pokedex-17938.firebaseapp.com",
  projectId: "pokedex-17938",
  storageBucket: "pokedex-17938.firebasestorage.app",
  messagingSenderId: "268509858726",
  appId: "1:268509858726:web:1a644d77d3affc8d619d67",
  measurementId: "G-3GZ307S10L"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/* ----------------------------------------------------
   🔒  AUTHENTIFICATION
   ---------------------------------------------------- */
const loginForm   = document.getElementById('login-form');
const signupForm  = document.getElementById('signup-form');

const loginError  = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

/* ---------- Connexion -------------------------------- */
loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    loginError.textContent = '';               // reset

    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try{
        await auth.signInWithEmailAndPassword(email, password);
        /* onAuthStateChanged (ci‑dessous) gère l’affichage */
    }catch(err){
        console.error('[Login] ', err);
        if(['auth/wrong-password','auth/user-not-found'].includes(err.code)){
            loginError.textContent = "mot de passe incorrect";
        }else{
            loginError.textContent = "Erreur lors de la connexion.";
        }
    }
});

/* ---------- Inscription -------------------------------- */
signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    signupError.textContent = '';               // reset

    const email    = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    try{
        await auth.createUserWithEmailAndPassword(email, password);
        /* onAuthStateChanged (ci‑dessous) gère l’affichage */
    }catch(err){
        console.error('[Signup] ', err);
        if(err.code === 'auth/email-already-in-use'){
            signupError.textContent = "pseudo déjà utilisé";
        }else if(err.code === 'auth/weak-password'){
            signupError.textContent = "mot de passe trop court (min 6 caractères)";
        }else{
            signupError.textContent = "Erreur lors de l’inscription.";
        }
    }
});

/* ----------------------------------------------------
   📂  ÉCOUTEUR d’état utilisateur
   ---------------------------------------------------- */
auth.onAuthStateChanged(user => {
    const loginSec   = document.getElementById('login-section');
    const signupSec  = document.getElementById('signup-section');
    const userSec    = document.getElementById('user-section');

    if(user){
        /* Utilisateur connecté – on masque les formulaires */
        loginSec.style.display = 'none';
        signupSec.style.display= 'none';

        /* On affiche l’email dans la zone utilisateur  */
        document.getElementById('user-email').textContent = user.email;
        userSec.style.display = 'block';
    }else{
        /* Pas de session : on réaffiche login + signup */
        loginSec.style.display   = 'block';
        signupSec.style.display  = 'block';
        userSec.style.display    = 'none';
    }
});

/* ----------------------------------------------------
   🔓  Déconnexion
   ---------------------------------------------------- */
document.getElementById('logout-btn').addEventListener('click', async () => {
    try{
        await auth.signOut();
    }catch(err){
        console.error('[Logout] ', err);
    }
});
