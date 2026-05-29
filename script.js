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


/* ---------- DOM Elements ---------- */
const form          = document.getElementById('auth-form');
const title         = document.getElementById('form-title');
const emailInput    = document.getElementById('email');
const pwdInput      = document.getElementById('password');
const submitBtn     = document.getElementById('submit-btn');
const toggleLink    = document.getElementById('show-signup');
const messageDiv    = document.getElementById('message');

/* ---------- Mode : connexion / inscription ---------- */
let isSignupMode = false;

toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isSignupMode = !isSignupMode;
    title.textContent   = isSignupMode ? 'S’inscrire' : 'Se connecter';
    submitBtn.textContent= isSignupMode ? 'Créer le compte' : 'Se connecter';
    toggleLink.innerHTML = isSignupMode ?
        'Déjà inscrit ? <a href="#">Connexion</a>' :
        'Pas encore de compte ? <a href="#">Inscription</a>';
});

/* ---------- Validation du mot‑de‑passe (regex) ---------- */
function validatePassword(pwd) {
    const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(pwd);
}

/* ---------- Gestion du formulaire ---------- */
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const email = emailInput.value.trim();
    const pwd   = pwdInput.value;

    if (!validatePassword(pwd)) {
        showError("Le mot de passe doit contenir 6 caractères, une majuscule et un chiffre.");
        return;
    }

    try {
        if (isSignupMode) { // inscription
            await auth.createUserWithEmailAndPassword(email, pwd);
            showSuccess('Compte créé ! Vous êtes maintenant connecté.');
        } else {             // connexion
            await auth.signInWithEmailAndPassword(email, pwd);
            showSuccess('Connexion réussie !');
        }
    } catch (err) {
        console.error(err);
        showError(err.message || "Erreur lors de l’authentification.");
    }
});

/* ---------- Helpers messages ---------- */
function showMessage(msg, type = 'error') {
    messageDiv.textContent = msg;
    messageDiv.className   = type === 'success' ? 'success' : 'error';
    messageDiv.style.display = 'block';
}
function showError(msg) { showMessage(msg, 'error'); }
function showSuccess(msg){ showMessage(msg, 'success'); }
function clearMessage(){ messageDiv.style.display='none'; }

/* ---------- Auth state listener (facultatif) ---------- */
auth.onAuthStateChanged(user => {
    if (user) {
        // L'utilisateur est connecté.
        console.log('Utilisateur connecté :', user.email);
        // Ici vous pouvez rediriger vers la page principale
        // window.location.href = 'dashboard.html';
    } else {
        // Pas de connexion
    }
});
