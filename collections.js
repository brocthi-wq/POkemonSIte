/* ==============================
   Collections JavaScript
   ============================== */

const cardsList = document.getElementById('cards-list');
const logoutBtn = document.getElementById('logout-btn');
const totalCardsSpan = document.getElementById('total-cards');
const totalValueSpan = document.getElementById('total-value');

let userCards = [];

/* ==============================
   Authentication Check
   ============================== */

auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        loadUserCards();
    }
});

/* ==============================
   Load Cards from Firestore
   ============================== */

function loadUserCards() {
    db.collection('users')
        .doc(auth.currentUser.uid)
        .collection('collection')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            userCards = [];
            cardsList.innerHTML = '';
            let totalValue = 0;

            if (snapshot.empty) {
                cardsList.innerHTML = '<p class="empty-message">Aucune carte trouvée. Allez en ajouter une ! 📝</p>';
                totalCardsSpan.textContent = '0';
                totalValueSpan.textContent = '0€';
                return;
            }

            snapshot.forEach(doc => {
                const card = doc.data();
                card.docId = doc.id;
                userCards.push(card);
                totalValue += card.price;
                renderCard(card);
            });

            totalCardsSpan.textContent = userCards.length;
            totalValueSpan.textContent = totalValue.toFixed(2) + '€';
        });
}

/* ==============================
   Render Card
   ============================== */

function renderCard(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card-item';
    
    const linkHTML = card.link ? `<a href="${escapeHtml(card.link)}" target="_blank" class="card-link">Voir sur Cardsmarket ↗</a>` : '';
    
    cardElement.innerHTML = `
        <div class="card-header">
            <div>
                <h3 class="card-name">${escapeHtml(card.name)}</h3>
                <span class="card-number">#${escapeHtml(card.number)}</span>
            </div>
            <button class="card-delete-btn" data-doc-id="${card.docId}" title="Supprimer">🗑️</button>
        </div>
        
        <div class="card-info">
            <div class="info-field">
                <span class="info-label">PV</span>
                <span class="info-value">${card.hp}</span>
            </div>
            <div class="info-field">
                <span class="info-label">État</span>
                <span class="info-value">
                    <span class="card-condition ${card.condition}">
                        ${getConditionLabel(card.condition)}
                    </span>
                </span>
            </div>
            <div class="info-field">
                <span class="info-label">Langue</span>
                <span class="info-value">${getLanguageLabel(card.language)}</span>
            </div>
            <div class="info-field">
                <span class="info-label">Prix</span>
                <span class="info-value">${card.price.toFixed(2)}€</span>
            </div>
        </div>
        
        ${linkHTML}
    `;

    // Ajouter l'événement de suppression
    const deleteBtn = cardElement.querySelector('.card-delete-btn');
    deleteBtn.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
            deleteCard(card.docId);
        }
    });

    cardsList.appendChild(cardElement);
}

/* ==============================
   Delete Card
   ============================== */

async function deleteCard(docId) {
    try {
        await db.collection('users').doc(auth.currentUser.uid).collection('collection').doc(docId).delete();
    } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression de la carte.');
    }
}

/* ==============================
   Logout
   ============================== */

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

function getConditionLabel(condition) {
    const labels = {
        'near-mint': 'Near Mint',
        'mint': 'Mint',
        'good': 'Good',
        'played': 'Played'
    };
    return labels[condition] || condition;
}

function getLanguageLabel(language) {
    const labels = {
        'francais': 'Français',
        'anglais': 'Anglais',
        'chinois': 'Chinois',
        'japonais': 'Japonais',
        'coreen': 'Coréen',
        'espagnol': 'Espagnol',
        'italien': 'Italien',
        'allemand': 'Allemand'
    };
    return labels[language] || language;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
