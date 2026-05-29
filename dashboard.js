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
        userId: auth.currentUser.uid,
        createdAt: new Date(),
    };

    // Validation
    if (!data.name || !data.number || !data.hp || !data.condition || !data.language || !data.price) {
        showFormMessage('Veuillez remplir tous les champs.', 'error');
        return;
    }

    try {
        // Ajouter le document à Firestore
        await db.collection('pokemon-cards').add(data);
        
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
