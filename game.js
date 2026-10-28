class MatchingGame {
  constructor() {
    this.emojis = ['🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎸', '🎹'];
    this.cards = [];
    this.flipped = [];
    this.matched = [];
    this.moves = 0;
    this.matchCount = 0;
    this.gameActive = true;
    this.startTime = null;
    this.timerInterval = null;

    this.gameBoard = document.getElementById('gameBoard');
    this.movesDisplay = document.getElementById('moves');
    this.matchesDisplay = document.getElementById('matches');
    this.timerDisplay = document.getElementById('timer');
    this.resetBtn = document.getElementById('resetBtn');
    this.hintBtn = document.getElementById('hintBtn');
    this.winModal = document.getElementById('winModal');
    this.playAgainBtn = document.getElementById('playAgainBtn');
    this.winStats = document.getElementById('winStats');

    this.resetBtn.addEventListener('click', () => this.reset());
    this.hintBtn.addEventListener('click', () => this.showHint());
    this.playAgainBtn.addEventListener('click', () => this.reset());

    this.init();
  }

  init() {
    this.createCards();
    this.render();
    this.startTimer();
  }

  createCards() {
    // Create pairs of cards
    const cardPairs = [...this.emojis, ...this.emojis];
    this.cards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji: emoji,
        flipped: false,
        matched: false,
      }));
  }

  render() {
    this.gameBoard.innerHTML = '';
    this.cards.forEach((card) => {
      const cardEl = document.createElement('button');
      cardEl.className = 'card';
      if (card.flipped || card.matched) {
        cardEl.classList.add('flipped');
      }
      if (card.matched) {
        cardEl.classList.add('matched');
      }
      if (!this.gameActive) {
        cardEl.classList.add('disabled');
      }

      cardEl.textContent = card.flipped || card.matched ? card.emoji : '?';
      cardEl.setAttribute('aria-label', `Card ${card.id + 1}`);
      cardEl.addEventListener('click', () => this.flipCard(card.id));

      // Add 3D mouse tracking effect
      cardEl.addEventListener('mousemove', (e) => this.handleCardMouseMove(e, cardEl));
      cardEl.addEventListener('mouseleave', () => this.handleCardMouseLeave(cardEl));

      this.gameBoard.appendChild(cardEl);
    });
  }

  handleCardMouseMove(e, cardEl) {
    if (cardEl.classList.contains('matched') || cardEl.classList.contains('flipped')) return;

    const rect = cardEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;

    cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }

  handleCardMouseLeave(cardEl) {
    cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  }

  flipCard(id) {
    if (!this.gameActive) return;
    if (this.flipped.length >= 2) return;

    const card = this.cards[id];
    if (card.flipped || card.matched) return;

    card.flipped = true;
    this.flipped.push(id);
    this.render();

    if (this.flipped.length === 2) {
      this.moves++;
      this.movesDisplay.textContent = this.moves;
      this.checkMatch();
    }
  }

  checkMatch() {
    const [id1, id2] = this.flipped;
    const card1 = this.cards[id1];
    const card2 = this.cards[id2];

    if (card1.emoji === card2.emoji) {
      // Match found
      card1.matched = true;
      card2.matched = true;
      this.matched.push(id1, id2);
      this.matchCount++;
      this.matchesDisplay.textContent = this.matchCount;
      this.flipped = [];
      this.render();

      if (this.matchCount === this.emojis.length) {
        this.win();
      }
    } else {
      // No match
      this.gameActive = false;
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
        this.flipped = [];
        this.gameActive = true;
        this.render();
      }, 1000);
    }
  }

  showHint() {
    if (!this.gameActive || this.flipped.length > 0) return;

    // Find an unmatched card
    const unmatchedCards = this.cards.filter((c) => !c.matched);
    if (unmatchedCards.length < 2) return;

    // Flip two random unmatched cards briefly
    const hint1 = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
    let hint2 = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
    while (hint2.id === hint1.id) {
      hint2 = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
    }

    hint1.flipped = true;
    hint2.flipped = true;
    this.render();

    setTimeout(() => {
      hint1.flipped = false;
      hint2.flipped = false;
      this.render();
    }, 1500);
  }

  startTimer() {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.timerDisplay.textContent = `${elapsed}s`;
    }, 100);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  win() {
    this.gameActive = false;
    this.stopTimer();

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    this.winStats.innerHTML = `
      <strong>Congratulations!</strong><br>
      Moves: ${this.moves}<br>
      Time: ${timeStr}
    `;

    setTimeout(() => {
      this.winModal.classList.add('show');
    }, 500);
  }

  reset() {
    this.flipped = [];
    this.matched = [];
    this.moves = 0;
    this.matchCount = 0;
    this.gameActive = true;
    this.stopTimer();
    this.winModal.classList.remove('show');

    this.movesDisplay.textContent = '0';
    this.matchesDisplay.textContent = '0';
    this.timerDisplay.textContent = '0s';

    this.createCards();
    this.render();
    this.startTimer();
  }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MatchingGame();
});
