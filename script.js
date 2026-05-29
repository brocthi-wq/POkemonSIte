/* ----------------------------------------------------
   ⚙️  INITIALISATION Firebase (compat) 
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
const form                 = document.getElementById('auth-form');
const cardTitle            = document.getElementById('card-title');
const emailInput           = document.getElementById('email-input');
const pwdInput             = document.getElementById('password-input');
const submitBtn            = document.getElementById('submit-btn');
const switchLinkContainer  = document.getElementById('switch-link');
const helpText             = document.getElementById('pwd-help');
const messageDiv           = document.getElementById('message');

/* ---------- Mode : connexion / inscription ---------- */
let mode = 0; // 0 = connexion, 1 = inscription

function toggleMode() {
    mode = mode === 0 ? 1 : 0;

    if (mode === 1) {
        cardTitle.textContent = 'Inscription';
        submitBtn.textContent = 'S\'inscrire';
        switchLinkContainer.innerHTML = 'Déjà inscrit ? <a href="#">Se connecter</a>';
        helpText.textContent = 'Mot de passe : 6 caractères minimum, au moins 1 majuscule et 1 chiffre.';
    } else {
        cardTitle.textContent = 'Connexion';
        submitBtn.textContent = 'Se connecter';
        switchLinkContainer.innerHTML = 'Pas encore de compte ? <a href="#">S\'enregistrer</a>';
        helpText.textContent = '';
    }
    clearMessage();
}

function validatePassword(pwd) {
    const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(pwd);
}

function showMessage(msg, type = 'error') {
    if (!messageDiv) {
        alert(msg);
        return;
    }
    messageDiv.textContent = msg;
    messageDiv.className = type === 'success' ? 'message success' : 'message error';
    messageDiv.style.display = 'block';
}

function showError(msg) { showMessage(msg, 'error'); }
function showSuccess(msg) { showMessage(msg, 'success'); }
function clearMessage() {
    if (messageDiv) {
        messageDiv.textContent = '';
        messageDiv.style.display = 'none';
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    clearMessage();

    const email = emailInput.value.trim();
    const pwd = pwdInput.value;

    if (!email) {
        showError('Veuillez saisir un email.');
        return;
    }

    if (mode === 1 && !validatePassword(pwd)) {
        showError('Le mot de passe doit contenir 6 caractères, une majuscule et un chiffre.');
        return;
    }

    try {
        if (mode === 0) {
            await auth.signInWithEmailAndPassword(email, pwd);
            showSuccess('Connexion réussie !');
        } else {
            await auth.createUserWithEmailAndPassword(email, pwd);
            showSuccess('Inscription réussie ! Vous êtes maintenant connecté.');
        }
    } catch (err) {
        console.error(err);
        showError(err.message || 'Erreur lors de l’authentification.');
    }
}

switchLinkContainer.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        toggleMode();
    }
});

form.addEventListener('submit', handleSubmit);

auth.onAuthStateChanged(user => {
    if (user) {
        console.log('Utilisateur connecté :', user.email);
    } else {
        console.log('Aucun utilisateur connecté');
    }
});
