/* ------------------------------------------------------------------
   1️⃣ Firebase & Firestore initialisation
------------------------------------------------------------------ */
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();          // <‑‑ Firestore

/* ------------------------------------------------------------------
   2️⃣ Authentification (login / signup) – inchangé
------------------------------------------------------------------ */
const auth = firebase.auth();

/* ... le code existant pour login/signup reste tel quel ... */

/* ------------------------------------------------------------------
   3️⃣ Récupération & affichage de la collection en temps réel
------------------------------------------------------------------ */
let currentUserId = null;

auth.onAuthStateChanged(user => {
    const appSection = document.getElementById('app-section');
    if (user) {
        document.getElementById('user-email').textContent = user.displayName || user.email;
        appSection.classList.remove('hidden');

        // On écoute la collection de cartes de l’utilisateur
        currentUserId = user.uid;

        db.collection('users')
          .doc(currentUserId)
          .collection('cards')
          .onSnapshot(snapshot => {
              const cardsDiv = document.getElementById('cards-list');
              cardsDiv.innerHTML = ''; // on réinitialise

              if (snapshot.empty) {
                  cardsDiv.innerHTML = '<p>Aucune carte dans votre collection.</p>';
                  return;
              }

              snapshot.forEach(doc => {
                  const card = doc.data();
                  const cardEl = document.createElement('div');
                  cardEl.className = 'card-item';

                  // Image
                  if (card.imageUrl) {
                      const img = document.createElement('img');
                      img.src = card.imageUrl;
                      img.alt = card.name || 'Carte';
                      cardEl.appendChild(img);
                  }

                  // Détails
                  const detailsDiv = document.createElement('div');
                  detailsDiv.className = 'card-details';

                  detailsDiv.innerHTML = `
                      <h4>${card.name || 'Carte sans nom'}</h4>
                      <p><strong>Langue:</strong> ${card.language.toUpperCase()}</p>
                      <p><strong>N° carte:</strong> ${card.number}</p>
                      <p><strong>Achat:</strong> €${parseFloat(card.purchasePrice).toFixed(2)}</p>
                      <p><strong>Prix actuel (NM):</strong> €${parseFloat(card.currentPrice).toFixed(2)}</p>
                  `;
                  cardEl.appendChild(detailsDiv);

                  cardsDiv.appendChild(cardEl);
              });
          });

    } else {
        appSection.classList.add('hidden');
        currentUserId = null;
    }
});

/* ------------------------------------------------------------------
   4️⃣ Ajout de carte – logique client (exemple)
------------------------------------------------------------------ */

/**
 * Simule la requête vers CardsMarket
 * @param {string} name  Nom de la carte (facultatif)
 * @param {string} lang  Langue sélectionnée
 * @returns {Promise<{imageUrl:string, currentPrice:number}>}
 */
async function fetchCardData(name, lang) {
    // NOTE : En production vous auriez un backend qui fait le scraping.
    // Ici on simule avec un endpoint fictif.
    const query = encodeURIComponent(name);
    const url = `https://api.example.com/cardsmarket?name=${query}&lang=${lang}`;

    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('Erreur de récupération des données');
        const data = await resp.json();

        // On suppose que le premier résultat est déjà filtré sur "NM"
        return {
            imageUrl: data.image_url || '',
            currentPrice: data.nm_price || 0
        };
    } catch (e) {
        console.warn(e);
        // En cas d’erreur on retourne des valeurs par défaut
        return { imageUrl: '', currentPrice: 0 };
    }
}

/**
 * Gestion du formulaire "Ajouter une carte"
 */
const addCardForm = document.getElementById('add-card-form');
addCardForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Récupération des champs
    const name = document.getElementById('card-name').value.trim();
    const lang = document.getElementById('card-lang').value;
    const number = document.getElementById('card-number').value.trim();
    const purchasePrice = parseFloat(document.getElementById('purchase-price').value);

    // Validation rapide
    if (!number || isNaN(purchasePrice)) {
        document.getElementById('add-card-error').textContent =
            'Veuillez renseigner un numéro valide et un prix d’achat.';
        return;
    }

    try {
        // ① On demande les infos actuelles (image + prix NM)
        const { imageUrl, currentPrice } = await fetchCardData(name, lang);

        if (!currentUserId) throw new Error('Utilisateur non authentifié');

        // ② On crée l’objet à sauvegarder
        const cardDoc = {
            name: name || 'Carte sans nom',
            language: lang,
            number,
            purchasePrice: purchasePrice.toFixed(2),
            currentPrice: currentPrice.toFixed(2),
            imageUrl
        };

        // ③ On upload dans Firestore sous l’utilisateur courant
        await db.collection('users')
                .doc(currentUserId)
                .collection('cards')
                .add(cardDoc);

        document.getElementById('add-card-success').textContent =
            'Carte ajoutée à votre collection !';
        document.getElementById('add-card-error').textContent = '';

        // Nettoyage du formulaire
        addCardForm.reset();
    } catch (err) {
        console.error(err);
        document.getElementById('add-card-error').textContent =
            err.message || 'Erreur lors de l’ajout de la carte.';
    }
});
