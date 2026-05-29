/* ==============================
   Dashboard JavaScript
   ============================== */

// DOM Elements
const btnNouveau = document.getElementById('btn-nouveau');
const btnCollections = document.getElementById('btn-collections');
const logoutBtn = document.getElementById('logout-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeModal = document.getElementById('close-modal');
const btnCancel = document.getElementById('btn-cancel');
const cardForm = document.getElementById('card-form');
const formMessage = document.getElementById('form-message');

// Form inputs
const cardName = document.getElementById('card-name');
const cardNumber = document.getElementById('card-number');
const cardHp = document.getElementById('card-hp');
const cardCondition = document.getElementById('card-condition');
const cardLanguage = document.getElementById('card-language');
const cardPrice = document.getElementById('card-price');
const cardLink = document.getElementById('card-link');
const btnAutofill = document.getElementById('btn-autofill');

// URL de la Cloud Function à déployer (remplacez par votre URL après déploiement)
const PARSER_URL = '';

/* ==============================
   Authentication Check
   ============================== */

// Vérifier si l'utilisateur est connecté
auth.onAuthStateChanged(user => {
    if (!user) {
        // Rediriger vers la page de connexion si pas connecté
        window.location.href = 'index.html';
    }
});

/* ==============================
   Modal Functions
   ============================== */

function openModal() {
    modalOverlay.classList.remove('hidden');
    cardForm.reset();
    formMessage.classList.add('hidden');
}

function closeModalFunc() {
    modalOverlay.classList.add('hidden');
    formMessage.classList.add('hidden');
}

/* ==============================
   Event Listeners
   ============================== */

// Ouvrir modal au clic sur "Nouveau"
btnNouveau.addEventListener('click', () => {
    openModal();
});

// Fermer modal au clic sur X
closeModal.addEventListener('click', () => {
    closeModalFunc();
});

// Fermer modal au clic sur Annuler
btnCancel.addEventListener('click', () => {
    closeModalFunc();
});

// Fermer modal au clic en dehors (sur l'overlay)
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModalFunc();
    }
});

// Soumettre le formulaire
cardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    const data = {
        name: cardName.value.trim(),
        number: cardNumber.value.trim(),
        hp: parseInt(cardHp.value),
        condition: cardCondition.value,
        language: cardLanguage.value,
        price: parseFloat(cardPrice.value),
        link: cardLink.value.trim(),
        createdAt: new Date(),
    };

    // Validation
    if (!data.name || !data.number || !data.hp || !data.condition || !data.language || !data.price) {
        showFormMessage('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
    }

    try {
        // Ajouter le document à Firestore : users/{userId}/collection/{cardId}
        await db.collection('users').doc(auth.currentUser.uid).collection('collection').add(data);
        
        // Afficher le message de succès
        showFormMessage('Carte ajoutée avec succès ! 🎉', 'success');
        
        // Réinitialiser le formulaire
        cardForm.reset();
        
        // Fermer la modal après 2 secondes
        setTimeout(() => {
            closeModalFunc();
        }, 2000);
    } catch (err) {
        console.error(err);
        showFormMessage('Erreur lors de l\'ajout de la carte. Veuillez réessayer.', 'error');
    }
});

// Auto-fill from Cardsmarket link
if (btnAutofill) {
    btnAutofill.addEventListener('click', async () => {
        const url = cardLink.value.trim();
        if (!url) {
            showFormMessage('Veuillez coller un lien Cardsmarket avant.', 'error');
            return;
        }

        if (!PARSER_URL) {
            showFormMessage('PARSER_URL non configurée. Déployez la Cloud Function et mettez à jour la variable.', 'error');
            return;
        }

        showFormMessage('Recherche des informations...', 'success');

        try {
            const resp = await fetch(PARSER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!resp.ok) {
                const errBody = await resp.json().catch(() => ({}));
                throw new Error(errBody.error || 'Erreur lors du parsing');
            }

            const data = await resp.json();

            if (data.name) cardName.value = data.name;
            if (data.number) cardNumber.value = data.number;
            if (data.hp) cardHp.value = data.hp;
            if (data.language) {
                // Try to match one of the select values
                const langMap = { 'Français': 'francais', 'English': 'anglais', 'Chinois': 'chinois', '日本語': 'japonais', '한국어': 'coreen', 'Español': 'espagnol', 'Italiano': 'italien', 'Deutsch': 'allemand' };
                const mapped = langMap[data.language] || data.language.toLowerCase();
                cardLanguage.value = mapped;
            }
            if (data.price) cardPrice.value = data.price;

            showFormMessage('Informations auto-remplies.', 'success');
        } catch (err) {
            console.error(err);
            showFormMessage('Impossible de récupérer les informations depuis le lien.', 'error');
        }
    });
}

// Voir la collection
btnCollections.addEventListener('click', () => {
    // Rediriger vers la page collections
    window.location.href = 'collections.html';
});

// Déconnexion
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Erreur lors de la déconnexion:', err);
    }
});

/* ==============================
   Helper Functions
   ============================== */

function showFormMessage(msg, type) {
    formMessage.textContent = msg;
    formMessage.className = `form-message ${type}`;
}
