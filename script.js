/* ==========================================================
   1. Initialisation de Firebase
========================================================== */
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet-id",
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdefghijk"
};
firebase.initializeApp(firebaseConfig);

/* ==========================================================
   2. Gestion de l’authentification
========================================================== */
const auth = firebase.auth();

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

const loginErrorMsg = document.getElementById('login-error');
const signupErrorMsg = document.getElementById('signup-error');

// Fonction de connexion
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        // Si on arrive ici, l’utilisateur est connecté
    } catch (err) {
        loginErrorMsg.textContent = err.message;
    }
});

// Fonction d’inscription
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupForm['new-email'].value.trim();
    const password = signupForm['new-password'].value;

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        // Le nouvel utilisateur est automatiquement connecté après l’inscription
    } catch (err) {
        signupErrorMsg.textContent = err.message;
    }
});

/* ==========================================================
   3. Gestion des sections visibles en fonction de l’état
========================================================== */
const loginSection   = document.getElementById('login-section');
const signupSection  = document.getElementById('signup-section');
const appSection     = document.getElementById('app-section');

auth.onAuthStateChanged(user => {
    if (user) {                 // Utilisateur connecté
        loginSection.classList.add('hidden');
        signupSection.classList.add('hidden');
        appSection.classList.remove('hidden');

        document.getElementById('user-email').textContent = user.email;
    } else {                    // Pas d’utilisateur connecté
        loginSection.classList.remove('hidden');
        signupSection.classList.add('hidden');
        appSection.classList.add('hidden');
    }
});

/* ==========================================================
   4. Déconnexion
========================================================== */
document.getElementById('logout-btn').addEventListener('click', () => {
    auth.signOut().catch(err => console.error(err));
});

/* ==========================================================
   5. Basculer entre login / signup
========================================================== */
document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('hidden');
    signupSection.classList.remove('hidden');
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    signupSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});
