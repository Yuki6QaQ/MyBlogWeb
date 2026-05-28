class MemoryGame {
    constructor() {
        this.board = document.getElementById('gameBoard');
        this.movesElement = document.getElementById('moves');
        this.matchesElement = document.getElementById('matches');
        this.timerElement = document.getElementById('timer');
        this.winMessage = document.getElementById('winMessage');
        this.finalMoves = document.getElementById('finalMoves');
        this.finalTime = document.getElementById('finalTime');

        this.flipSound = document.getElementById('flipSound');
        this.matchSound = document.getElementById('matchSound');
        this.bgMusic = document.getElementById('bgMusic');

        this.restartBtn = document.getElementById('restartBtn');
        this.soundBtn = document.getElementById('soundBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');

        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.timer = 0;
        this.timerInterval = null;
        this.soundEnabled = true;
        this.bgMusicPlayed = false;

        this.symbols = [
            '🌟', '💫', '✨', '🌙', '⭐', '🔥', '🌈', '🌺',
            '🌸', '🌹', '🌻', '🌷', '🌼', '🍀', '🌿', '🍁',
            '🍂', '🍃', '🍄', '🐚', '🪸', '🪼', '🦋', '🐝',
            '🐞', '🐌', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡',
            '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐢',
            '🦎', '🐍', '🐉', '🦕', '🦖', '🦴', '🦷', '🦾',
            '🦿', '🧠', '👁️', '👂', '👃', '👄', '👅', '🦵',
            '🦶', '👶', '🧒', '👦', '👧', '🧑', '👨', '👩',
            '👴', '👵', '🧓', '🧔', '👱', '👨‍🦰', '👨‍🦱', '👨‍🦳'
        ];

        this.init();
    }

    init() {
        this.createBackgroundDecorations();
        this.setupEventListeners();
        this.startGame();
    }

    createBackgroundDecorations() {
        const decorationContainer = document.getElementById('backgroundDecoration');
        for (let i = 0; i < 15; i++) {
            const circle = document.createElement('div');
            circle.className = 'decoration-circle';
            circle.style.width = `${Math.random() * 200 + 50}px`;
            circle.style.height = circle.style.width;
            circle.style.left = `${Math.random() * 100}%`;
            circle.style.top = `${Math.random() * 100}%`;
            circle.style.animationDelay = `${Math.random() * 15}s`;
            decorationContainer.appendChild(circle);
        }
    }

    setupEventListeners() {
        this.restartBtn.addEventListener('click', () => this.startGame());
        this.playAgainBtn.addEventListener('click', () => {
            this.winMessage.classList.remove('show');
            this.startGame();
        });

        this.soundBtn.addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            this.soundBtn.textContent = this.soundEnabled ? '🔊 音效开' : '🔇 音效关';
            if (this.soundEnabled && this.bgMusicPlayed) {
                this.bgMusic.volume = 0.3;
                this.bgMusic.play().catch(e => console.log('Audio play failed:', e));
            } else if (!this.soundEnabled) {
                this.bgMusic.pause();
            }
        });
    }

    startGame() {
        this.board.innerHTML = '';
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.timer = 0;
        this.timerElement.textContent = 0;
        this.bgMusicPlayed = false;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        this.updateStats();


        const cardValues = this.createCardValues();
        this.cards = [];

        cardValues.forEach((value, index) => {
            const card = this.createCard(value, index);
            this.board.appendChild(card);
            this.cards.push(card);
        });
    }

    createCardValues() {
        const pairsNeeded = 72;
        let selectedSymbols = [];

        if (this.symbols.length < pairsNeeded) {
            for (let i = 0; i < pairsNeeded; i++) {
                const symbolIndex = i % this.symbols.length;
                selectedSymbols.push(this.symbols[symbolIndex]);
            }
        } else {
            const shuffled = [...this.symbols].sort(() => 0.5 - Math.random());
            selectedSymbols = shuffled.slice(0, pairsNeeded);
        }
        const cardValues = [];
        selectedSymbols.forEach(symbol => {
            cardValues.push(symbol);
            cardValues.push(symbol);
        });

        return cardValues.sort(() => 0.5 - Math.random());
    }

    createCard(value, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.value = value;
        card.dataset.index = index;

        const cardFront = document.createElement('div');
        cardFront.className = 'card-face card-front';
        const icon = document.createElement('span');
        icon.className = 'card-icon';
        icon.textContent = value;
        cardFront.appendChild(icon);

        const cardBack = document.createElement('div');
        cardBack.className = 'card-face card-back';

        card.appendChild(cardBack);
        card.appendChild(cardFront);

        card.addEventListener('click', () => this.handleCardClick(card));

        return card;
    }

    handleCardClick(card) {
        if (card.classList.contains('flipped') ||
            card.classList.contains('matched') ||
            this.flippedCards.length >= 2) {
            return;
        }

        if (!this.bgMusicPlayed && this.soundEnabled) {
            this.bgMusic.volume = 0.3;
            this.bgMusic.play().catch(e => console.log('Background music play failed:', e));
            this.bgMusicPlayed = true;
        }

        if (!this.gameStarted) {
            this.gameStarted = true;
            this.startTimer();
        }

        card.classList.add('flipped');
        this.flippedCards.push(card);


        if (this.soundEnabled) {
            this.flipSound.currentTime = 0;
            this.flipSound.play().catch(e => console.log('Flip sound failed:', e));
        }


        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            setTimeout(() => this.checkMatch(), 800);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const value1 = card1.dataset.value;
        const value2 = card2.dataset.value;

        if (value1 === value2) {

            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matchedPairs++;

            if (this.soundEnabled) {
                this.matchSound.currentTime = 0;
                this.matchSound.play().catch(e => console.log('Match sound failed:', e));
            }


            if (this.matchedPairs === 72) {
                this.endGame();
            }
        } else {

            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        this.flippedCards = [];
        this.updateStats();
    }

    startTimer() {

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.timerElement.textContent = this.timer;
        }, 1000);
    }


    updateStats() {
        this.movesElement.textContent = this.moves;
        this.matchesElement.textContent = `${this.matchedPairs}/72`;
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.bgMusic.pause();


        this.finalMoves.textContent = this.moves;
        this.finalTime.textContent = this.timer;
        setTimeout(() => {
            this.winMessage.classList.add('show');
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});