// Tea matching pairs
const teaPairs = [
    {
        tea: "Green Tea",
        description: "Light, fresh, and grassy with antioxidants"
    },
    {
        tea: "Black Tea",
        description: "Bold, robust, and fully oxidized flavor"
    },
    {
        tea: "Oolong Tea",
        description: "Semi-oxidized with fruity and floral notes"
    },
    {
        tea: "White Tea",
        description: "Delicate, subtle, and minimally processed"
    },
    {
        tea: "Pu-erh Tea",
        description: "Earthy, aged, and deeply fermented"
    },
    {
        tea: "Herbal Tea",
        description: "Caffeine-free blend of herbs and flowers"
    }
];

let gameState = {
    selectedTea: null,
    selectedDescription: null,
    matches: 0,
    attempts: 0,
    matchedPairs: new Set(),
    teaOrder: [],
    descriptionOrder: []
};

// Initialize game
function initGame() {
    // Shuffle and create tea cards
    gameState.teaOrder = teaPairs.map((pair, idx) => idx);
    gameState.descriptionOrder = teaPairs.map((pair, idx) => idx);
    
    shuffleArray(gameState.teaOrder);
    shuffleArray(gameState.descriptionOrder);
    
    renderCards();
}

// Shuffle array in place
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Render cards
function renderCards() {
    const teaTypesContainer = document.getElementById('teaTypes');
    const descriptionsContainer = document.getElementById('descriptions');
    
    teaTypesContainer.innerHTML = '';
    descriptionsContainer.innerHTML = '';
    
    // Render tea types
    gameState.teaOrder.forEach((idx) => {
        const card = createCard(teaPairs[idx].tea, `tea-${idx}`);
        teaTypesContainer.appendChild(card);
    });
    
    // Render descriptions
    gameState.descriptionOrder.forEach((idx) => {
        const card = createCard(teaPairs[idx].description, `desc-${idx}`);
        descriptionsContainer.appendChild(card);
    });
}

// Create a card element
function createCard(text, id) {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = text;
    card.dataset.id = id;
    
    if (gameState.matchedPairs.has(id)) {
        card.classList.add('matched');
    }
    
    card.addEventListener('click', () => selectCard(id, card));
    return card;
}

// Select a card
function selectCard(id, cardElement) {
    // Don't allow selection of matched cards
    if (gameState.matchedPairs.has(id)) {
        return;
    }
    
    const isTeaCard = id.startsWith('tea-');
    
    // If clicking the same card, deselect it
    if (isTeaCard && gameState.selectedTea === id) {
        gameState.selectedTea = null;
        cardElement.classList.remove('selected');
        return;
    }
    
    if (!isTeaCard && gameState.selectedDescription === id) {
        gameState.selectedDescription = null;
        cardElement.classList.remove('selected');
        return;
    }
    
    // Select the card
    if (isTeaCard) {
        // Deselect previous tea card
        if (gameState.selectedTea) {
            const prevCard = document.querySelector(`[data-id="${gameState.selectedTea}"]`);
            if (prevCard) prevCard.classList.remove('selected');
        }
        gameState.selectedTea = id;
        cardElement.classList.add('selected');
    } else {
        // Deselect previous description card
        if (gameState.selectedDescription) {
            const prevCard = document.querySelector(`[data-id="${gameState.selectedDescription}"]`);
            if (prevCard) prevCard.classList.remove('selected');
        }
        gameState.selectedDescription = id;
        cardElement.classList.add('selected');
    }
    
    // Check if both are selected
    if (gameState.selectedTea && gameState.selectedDescription) {
        checkMatch();
    }
}

// Check if selected cards match
function checkMatch() {
    gameState.attempts++;
    document.getElementById('attempts').textContent = gameState.attempts;
    
    const teaIdx = parseInt(gameState.selectedTea.split('-')[1]);
    const descIdx = parseInt(gameState.selectedDescription.split('-')[1]);
    
    if (teaIdx === descIdx) {
        // Match found!
        gameState.matches++;
        gameState.matchedPairs.add(gameState.selectedTea);
        gameState.matchedPairs.add(gameState.selectedDescription);
        
        document.getElementById('matches').textContent = gameState.matches;
        
        const teaCard = document.querySelector(`[data-id="${gameState.selectedTea}"]`);
        const descCard = document.querySelector(`[data-id="${gameState.selectedDescription}"]`);
        
        teaCard.classList.remove('selected');
        descCard.classList.remove('selected');
        teaCard.classList.add('matched');
        descCard.classList.add('matched');
        
        showMessage(`✓ Correct! "${teaPairs[teaIdx].tea}" matched!`, 'success');
        
        gameState.selectedTea = null;
        gameState.selectedDescription = null;
        
        // Check if game is won
        if (gameState.matches === teaPairs.length) {
            setTimeout(() => {
                showMessage(`🎉 You won! Completed in ${gameState.attempts} attempts!`, 'success');
            }, 500);
        }
    } else {
        // No match
        const teaCard = document.querySelector(`[data-id="${gameState.selectedTea}"]`);
        const descCard = document.querySelector(`[data-id="${gameState.selectedDescription}"]`);
        
        teaCard.classList.add('incorrect');
        descCard.classList.add('incorrect');
        
        showMessage('✗ Not a match. Try again!', 'error');
        
        setTimeout(() => {
            teaCard.classList.remove('selected', 'incorrect');
            descCard.classList.remove('selected', 'incorrect');
            gameState.selectedTea = null;
            gameState.selectedDescription = null;
            showMessage('');
        }, 800);
    }
}

// Show message
function showMessage(text, type = '') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = 'message ' + type;
}

// Reset game
function resetGame() {
    gameState = {
        selectedTea: null,
        selectedDescription: null,
        matches: 0,
        attempts: 0,
        matchedPairs: new Set(),
        teaOrder: [],
        descriptionOrder: []
    };
    
    document.getElementById('matches').textContent = '0';
    document.getElementById('attempts').textContent = '0';
    showMessage('');
    
    initGame();
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);
