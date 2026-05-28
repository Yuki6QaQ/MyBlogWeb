const game = document.getElementById('game');
const scoreText = document.getElementById('score');
const gameOverPanel = document.getElementById('gameOver');
const finalScoreText = document.getElementById('finalScore');
const restartBtn = document.getElementById('restart');

const gameWidth = 600;
const gameHeight = 800;
let score = 0;
let isGameOver = false;

const player = {
  width: 80,
  height: 100,
  speed: 5,
  x: gameWidth / 2 - 40,
  y: gameHeight - 120,
  element: null
};

let bullets = [];
const bulletSpeed = 10;

let enemies = [];
const enemySpeed = 4;

let bulletInterval;
let enemyInterval;
let animationId;

function createPlayer() {
  player.element = document.createElement('div');
  player.element.style.cssText = `
    position:absolute;
    width:${player.width}px;
    height:${player.height}px;
    left:${player.x}px;
    top:${player.y}px;
    background:#00ff00;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  `;
  game.appendChild(player.element);
}

game.addEventListener('mousemove', (e) => {
  if (isGameOver) return;
  const rect = game.getBoundingClientRect();
  let x = e.clientX - rect.left - player.width / 2;
  x = Math.max(0, Math.min(x, gameWidth - player.width));
  player.x = x;
  player.element.style.left = x + 'px';
});

function createBullet() {
  if (isGameOver) return;
  const bullet = document.createElement('div');
  bullet.style.cssText = `
    position:absolute;
    width:8px;
    height:20px;
    background:#ffff00;
    left:${player.x + player.width / 2 - 4}px;
    top:${player.y - 20}px;
  `;
  game.appendChild(bullet);
  bullets.push({ element: bullet, y: player.y - 20 });
}

function createEnemy() {
  if (isGameOver) return;
  const size = Math.random() * 30 + 50;
  const x = Math.random() * (gameWidth - size);
  const enemy = document.createElement('div');
  enemy.style.cssText = `
    position:absolute;
    width:${size}px;
    height:${size}px;
    left:${x}px;
    top:-${size}px;
    background:#ff0000;
    border-radius:50%;
  `;
  game.appendChild(enemy);
  enemies.push({ element: enemy, x: x, y: -size, size: size });
}

function isCollide(a, b) {
  const r1 = a.element.getBoundingClientRect();
  const r2 = b.element.getBoundingClientRect();
  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
}

function gameLoop() {
  if (isGameOver) return;

  bullets.forEach((b, i) => {
    b.y -= bulletSpeed;
    b.element.style.top = b.y + 'px';
    if (b.y < 0) {
      b.element.remove();
      bullets.splice(i, 1);
    }
  });

  enemies.forEach((enemy, i) => {
    enemy.y += enemySpeed;
    enemy.element.style.top = enemy.y + 'px';

    if (enemy.y > gameHeight) {
      enemy.element.remove();
      enemies.splice(i, 1);
    }

    if (isCollide(enemy, player)) {
      gameOver();
    }

    bullets.forEach((bullet, j) => {
      if (isCollide(bullet, enemy)) {
        enemy.element.remove();
        bullet.element.remove();
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        scoreText.textContent = `分数: ${score}`;
      }
    });
  });

  animationId = requestAnimationFrame(gameLoop);
}

function gameOver() {
  isGameOver = true;
  finalScoreText.textContent = `最终分数: ${score}`;
  gameOverPanel.style.display = 'block';
  cancelAnimationFrame(animationId);
}

function restartGame() {
  clearInterval(bulletInterval);
  clearInterval(enemyInterval);

  bullets.forEach(b => b.element.remove());
  enemies.forEach(e => e.element.remove());
  if (player.element) game.removeChild(player.element);

  score = 0;
  bullets = [];
  enemies = [];
  isGameOver = false;
  player.x = gameWidth / 2 - player.width / 2;
  scoreText.textContent = `分数: ${score}`;
  gameOverPanel.style.display = 'none';

  createPlayer();

  bulletInterval = setInterval(createBullet, 250);
  enemyInterval = setInterval(createEnemy, 700);
  gameLoop();
}

restartBtn.addEventListener('click', restartGame);

createPlayer();
bulletInterval = setInterval(createBullet, 250);
enemyInterval = setInterval(createEnemy, 700);
gameLoop();