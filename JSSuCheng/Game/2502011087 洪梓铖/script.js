const game = document.getElementById('game');
const paddle = document.getElementById('paddle');
const scoreText = document.getElementById('score');
const livesText = document.getElementById('lives');
const uiLayer = document.getElementById('ui-layer');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScoreDisplay = document.getElementById('final-score');
const gameTitle = document.getElementById('game-title');

const GAME_WIDTH = 600;
const GAME_HEIGHT = 700;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const PADDLE_BOTTOM_OFFSET = 20;
const BALL_SIZE = 20;
const INITIAL_SPEED = 4;
const MAX_LIVES = 3;

let score = 0;
let lives = MAX_LIVES;
let isGameRunning = false;
let paddleX = (GAME_WIDTH - PADDLE_WIDTH) / 2;
let balls = [];
let animationFrameId;
let spawnIntervalId;
let baseSpeed = INITIAL_SPEED;
let lastTime = 0;

updatePaddlePosition();

game.addEventListener('mousemove', (e) => {
    if (!isGameRunning) return;
    const rect = game.getBoundingClientRect();
    let newX = e.clientX - rect.left - PADDLE_WIDTH / 2;
    setPaddleX(newX);
});

document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    const step = 25;
    if (e.key === 'ArrowLeft') {
        setPaddleX(paddleX - step);
    } else if (e.key === 'ArrowRight') {
        setPaddleX(paddleX + step);
    }
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function setPaddleX(x) {
    paddleX = x;
    if (paddleX < 0) paddleX = 0;
    if (paddleX > GAME_WIDTH - PADDLE_WIDTH) paddleX = GAME_WIDTH - PADDLE_WIDTH;
    updatePaddlePosition();
}

function updatePaddlePosition() {
    paddle.style.left = paddleX + 'px';
}

function startGame() {
    score = 0;
    lives = MAX_LIVES;
    baseSpeed = INITIAL_SPEED;

    balls.forEach(ball => {
        if (ball.element.parentNode) {
            ball.element.remove();
        }
    });
    balls = [];

    updateUI();

    uiLayer.classList.remove('active');
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    finalScoreDisplay.style.display = 'none';
    gameTitle.innerText = "游戏中...";

    isGameRunning = true;
    lastTime = performance.now();

    animationFrameId = requestAnimationFrame(gameLoop);

    if (spawnIntervalId) clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(createBall, 1000);
}

function gameOver() {
    isGameRunning = false;
    cancelAnimationFrame(animationFrameId);
    clearInterval(spawnIntervalId);

    gameTitle.innerText = "游戏结束";
    finalScoreDisplay.innerText = `最终得分：${score}`;
    finalScoreDisplay.style.display = 'block';
    restartBtn.style.display = 'block';
    uiLayer.classList.add('active');
}

function createBall() {
    if (!isGameRunning) return;

    const ballElem = document.createElement('div');
    ballElem.classList.add('ball');

    const startX = Math.random() * (GAME_WIDTH - BALL_SIZE);
    ballElem.style.left = startX + 'px';
    ballElem.style.top = '0px';

    game.appendChild(ballElem);

    balls.push({
        element: ballElem,
        x: startX,
        y: 0,
        speed: baseSpeed + (Math.random() * 1.5 - 0.75)
    });
}

function gameLoop(timestamp) {
    if (!isGameRunning) return;

    for (let i = balls.length - 1; i >= 0; i--) {
        let ball = balls[i];

        ball.y += ball.speed;
        ball.element.style.top = ball.y + 'px';

        const paddleTopY = GAME_HEIGHT - PADDLE_BOTTOM_OFFSET - PADDLE_HEIGHT;

        if (ball.y + BALL_SIZE >= paddleTopY && ball.y < paddleTopY + PADDLE_HEIGHT) {
            if (ball.x + BALL_SIZE > paddleX && ball.x < paddleX + PADDLE_WIDTH) {
                score++;

                if (score % 5 === 0) {
                    baseSpeed += 0.5;
                }

                updateUI();

                ball.element.remove();
                balls.splice(i, 1);
                continue;
            }
        }

        if (ball.y > GAME_HEIGHT) {
            ball.element.remove();
            balls.splice(i, 1);

            lives--;
            updateUI();

            if (lives <= 0) {
                gameOver();
                return;
            }
        }
    }

    if (isGameRunning) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function updateUI() {
    scoreText.textContent = `得分：${score}`;
    let hearts = "";
    for (let i = 0; i < lives; i++) hearts += "❤️";
    livesText.textContent = `生命：${hearts}`;
}