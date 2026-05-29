/* ------------------------------------------------------------------
   UTILITAIRES
------------------------------------------------------------------ */

/**
 * Vérifie si l’adresse e‑mail est valide (regex simplifiée)
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Affiche le modal avec un message
 */
function showModal(message) {
    document.getElementById('modal-msg').textContent = message;
    document.getElementById('modal').classList.remove('hidden');
}

/**
 * Cache le modal
 */
function hideModal() {
    document.getElementById('modal').classList.add('hidden');
}

/**
 * Récupère l’objet des comptes stockés dans localStorage.
 * Format : { "email@example.com": "hashPassword" }
 */
function getUsers() {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : {};
}

/**
 * Enregistre les comptes mis à jour dans localStorage
 */
function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

/* ------------------------------------------------------------------
   LOGIQUE PRINCIPALE
------------------------------------------------------------------ */

const form = document.getElementById('auth-form');
const toggleLink = document.getElementById('toggle-mode');
const actionBtn  = document.getElementById('action-btn');
const confirmField = document.getElementById('confirm-field');

let mode = 'login'; // ou 'signup'

/**
 * Basculer entre login et signup
 */
function toggleMode() {
    if (mode === 'login') {
        mode = 'signup';
        actionBtn.textContent = "Créer le compte";
        confirmField.classList.remove('hidden');
        document.getElementById('form-title').textContent = 'Créer un compte';
        toggleLink.innerHTML = 'Se connecter';
    } else {
        mode = 'login';
        actionBtn.textContent = "Se connecter";
        confirmField.classList.add('hidden');
        document.getElementById('form-title').textContent = 'Se connecter';
        toggleLink.innerHTML = 'Créer un compte';
    }
}

/**
 * Traitement du formulaire
 */
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email   = form.email.value.trim().toLowerCase();
    const pwd     = form.password.value;
    const users   = getUsers();

    // ---------------------------------------
    // Validation d’entrée
    // ---------------------------------------
    if (!isValidEmail(email)) {
        showModal('Adresse e‑mail invalide.');
        return;
    }

    if (pwd.length < 6) {
        showModal('Le mot de passe doit contenir au moins 6 caractères.');
        return;
    }

    // ---------------------------------------
    // Mode connexion
    // ---------------------------------------
    if (mode === 'login') {
        if (!users[email]) {
            showModal('Compte inconnu. Veuillez vous inscrire d’abord.');
            return;
        }
        if (users[email] !== pwd) {   // On ne fait pas de hash – on garde le plain‑text
            showModal('Mot de passe incorrect.');
            return;
        }

        showModal(`Bienvenue ${email}! Vous êtes connecté.`);
        form.reset();
    }

    // ---------------------------------------
    // Mode création de compte
    // ---------------------------------------
    else {
        const confirmPwd = form['confirm-password'].value;

        if (users[email]) {
            showModal('Compte déjà existant.');
            return;
        }
        if (pwd !== confirmPwd) {
            showModal('Les mots de passe ne correspondent pas.');
            return;
        }

        // On stocke le compte
        users[email] = pwd;   // En production, hacher le mot de passe !
        setUsers(users);

        showModal(`Compte créé pour ${email}. Vous êtes connecté.`);
        form.reset();
    }
});

/* ------------------------------------------------------------------
   ÉVÉNEMENTS DU MODAL
------------------------------------------------------------------ */
document.getElementById('close-modal').addEventListener('click', hideModal);

/* ------------------------------------------------------------------
   LIAISON AU LIEN TOSTOGGLE
------------------------------------------------------------------ */
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMode();
});

/* ------------------------------------------------------------------
   FIN DE LA LOGIQUE
------------------------------------------------------------------ */
