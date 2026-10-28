// Tea-themed card pairs
const teaCards = [
    { emoji: '🍵', name: 'Green Tea' },
    { emoji: '🍵', name: 'Green Tea' },
    { emoji: '☕', name: 'Black Tea' },
    { emoji: '☕', name: 'Black Tea' },
    { emoji: '🫖', name: 'Teapot' },
    { emoji: '🫖', name: 'Teapot' },
    { emoji: '🍯', name: 'Honey Pot' },
    { emoji: '🍯', name: 'Honey Pot' },
    { emoji: '🌿', name: 'Mint' },
    { emoji: '🌿', name: 'Mint' },
    { emoji: '🍋', name: 'Lemon' },
    { emoji: '🍋', name: 'Lemon' },
    { emoji: '🥛', name: 'Milk' },
    { emoji: '🥛', name: 'Milk' },
    { emoji: '🍪', name: 'Biscuit' },
    { emoji: '🍪', name: 'Biscuit' },
];

class TeaMatchingGame {
    constructor() {
        this.cards = [];
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.matches = 0;
        this.gameActive = true;
        this.startTime = null;
        this.timerInterval = null;
        this.hintUsed = false;

        this.gameBoard = document.getElementById('gameBoard');
        this.movesDisplay = document.getElementById('moves');
        this.matchesDisplay = document.getElementById('matches');
        this.timerDisplay = document.getElementById('timer');
        this.resetBtn = document.getElementById('resetBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.winModal = document.getElementById('winModal');

        this.resetBtn.addEventListener('click', () => this.reset());
        this.hintBtn.addEventListener('click', () => this.showHint());

        this.init();
    }

    init() {
        this.cards = this.shuffleCards([...teaCards]);
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.matches = 0;
        this.gameActive = true;
        this.hintUsed = false;
        this.startTime = Date.now();

        this.updateDisplay();
        this.renderBoard();
        this.startTimer();
    }

    shuffleCards(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;

            if (this.matched.includes(index)) {
                cardElement.classList.add('matched');
            }
            if (this.flipped.includes(index)) {
                cardElement.classList.add('flipped');
                cardElement.textContent = card.emoji;
            }

            cardElement.addEventListener('click', () => this.flipCard(index, cardElement));
            this.gameBoard.appendChild(cardElement);
        });
    }

    flipCard(index, element) {
        if (!this.gameActive) return;
        if (this.flipped.includes(index)) return;
        if (this.matched.includes(index)) return;
        if (this.flipped.length >= 2) return;

        this.flipped.push(index);
        element.classList.add('flipped', 'flipping');
        element.textContent = this.cards[index].emoji;

        if (this.flipped.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkMatch();
        }
    }

    checkMatch() {
        const [first, second] = this.flipped;
        const isMatch = this.cards[first].name === this.cards[second].name;

        this.gameActive = false;

        setTimeout(() => {
            if (isMatch) {
                this.matched.push(first, second);
                this.matches++;
                this.updateDisplay();

                const elements = document.querySelectorAll('.card');
                elements[first].classList.add('matched');
                elements[second].classList.add('matched');

                this.flipped = [];
                this.gameActive = true;

                if (this.matched.length === this.cards.length) {
                    this.endGame();
                }
            } else {
                const elements = document.querySelectorAll('.card');
                elements[first].classList.remove('flipped', 'flipping');
                elements[second].classList.remove('flipped', 'flipping');
                elements[first].textContent = '';
                elements[second].textContent = '';

                this.flipped = [];
                this.gameActive = true;
            }
        }, 1000);
    }

    showHint() {
        if (this.hintUsed || this.flipped.length > 0 || this.matched.length === this.cards.length) {
            return;
        }

        this.hintUsed = true;
        this.hintBtn.disabled = true;
        this.hintBtn.style.opacity = '0.5';

        // Find an unmatched card
        const unmatched = [];
        for (let i = 0; i < this.cards.length; i++) {
            if (!this.matched.includes(i)) {
                unmatched.push(i);
            }
        }

        if (unmatched.length > 0) {
            const randomIndex = unmatched[Math.floor(Math.random() * unmatched.length)];
            const element = document.querySelector(`[data-index="${randomIndex}"]`);

            element.classList.add('flipped');
            element.textContent = this.cards[randomIndex].emoji;

            setTimeout(() => {
                element.classList.remove('flipped');
                element.textContent = '';
            }, 1500);
        }
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.timerDisplay.textContent = elapsed + 's';
        }, 100);
    }

    updateDisplay() {
        this.movesDisplay.textContent = this.moves;
        this.matchesDisplay.textContent = this.matches;
    }

    endGame() {
        this.gameActive = false;
        clearInterval(this.timerInterval);

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;

        const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
        const winStats = document.getElementById('winStats');
        winStats.innerHTML = `
            <strong>Congratulations!</strong><br>
            Moves: ${this.moves}<br>
            Time: ${timeStr}<br>
            Matches: ${this.matches}
        `;

        this.winModal.classList.add('show');
    }

    reset() {
        clearInterval(this.timerInterval);
        this.winModal.classList.remove('show');
        this.init();
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TeaMatchingGame();
});
