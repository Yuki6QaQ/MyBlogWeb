// 全局状态
let canvas, ctx;
let gameLoopId;
let activeGame = null;
let score = 0;
let lives = 3;
let isGameOver = false;

// 游戏配置
const CONFIG = {
    catch: { w: 600, h: 400 },
    plane: { w: 600, h: 400 },
    bird: { w: 400, h: 600 }
};

// --- 导航与初始化 ---

function startGame(type) {
    document.getElementById('main-menu').classList.add('hidden');
    document.querySelector('header').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');

    activeGame = type;
    resetGameState();

    // 设置画布尺寸
    canvas = document.getElementById('game-canvas');
    const wrapper = document.getElementById('canvas-wrapper');

    if (type === 'memory') {
        canvas.classList.add('hidden');
        document.getElementById('memory-board').classList.remove('hidden');
        document.getElementById('lives-container').classList.add('hidden');
        initMemoryGame();
    } else {
        canvas.classList.remove('hidden');
        document.getElementById('memory-board').classList.add('hidden');
        document.getElementById('lives-container').classList.remove('hidden');

        if (CONFIG[type]) {
            canvas.width = CONFIG[type].w;
            canvas.height = CONFIG[type].h;
        }
        ctx = canvas.getContext('2d');

        if (type === 'catch') initCatchGame();
        else if (type === 'plane') initPlaneGame();
        else if (type === 'bird') initBirdGame();
    }
}

function backToMenu() {
    cancelAnimationFrame(gameLoopId);
    document.getElementById('game-area').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    document.querySelector('header').classList.remove('hidden');
    activeGame = null;

    // 清理事件监听
    window.onkeydown = null;
    window.onkeyup = null;
    canvas.onclick = null;
}

function resetGameState() {
    score = 0;
    lives = 3;
    isGameOver = false;
    updateHUD();
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('controls-hint').innerText = getHintText(activeGame);
}

function updateHUD() {
    document.getElementById('current-score').innerText = score;
    document.getElementById('lives-count').innerText = lives;
}

function getHintText(type) {
    const hints = {
        catch: "⬅️ ➡️ 方向键移动",
        plane: "⬅️ ➡️ 移动 | 空格 射击",
        bird: "点击或空格 跳跃",
        memory: "点击卡片寻找配对"
    };
    return hints[type] || "";
}

function showGameOver(finalScore) {
    isGameOver = true;
    document.getElementById('final-score').innerText = finalScore;
    document.getElementById('game-over-screen').classList.remove('hidden');
}

function restartCurrentGame() {
    startGame(activeGame);
}

// ==========================================
// 1. 接小球 (Catch) - 增强版
// ==========================================
function initCatchGame() {
    let basket = { x: 250, y: 350, w: 100, h: 20, color: '#00f3ff' };
    let balls = [];
    let keys = {};
    let frame = 0;

    window.onkeydown = e => keys[e.key] = true;
    window.onkeyup = e => keys[e.key] = false;

    function spawnBall() {
        balls.push({
            x: Math.random() * (canvas.width - 20),
            y: -20,
            r: 10 + Math.random() * 10,
            speed: 3 + Math.random() * 2 + (score * 0.1), // 难度随分数增加
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
    }

    function update() {
        if (isGameOver) return;
        frame++;

        // 移动篮子
        if (keys['ArrowLeft'] && basket.x > 0) basket.x -= 7;
        if (keys['ArrowRight'] && basket.x < canvas.width - basket.w) basket.x += 7;

        // 生成球
        if (frame % 60 === 0) spawnBall();

        // 更新球
        for (let i = balls.length - 1; i >= 0; i--) {
            let b = balls[i];
            b.y += b.speed;

            // 碰撞检测
            if (b.y + b.r > basket.y && b.x > basket.x && b.x < basket.x + basket.w) {
                score += 10;
                updateHUD();
                balls.splice(i, 1);
                createParticles(b.x, b.y, b.color);
            } else if (b.y > canvas.height) {
                lives--;
                updateHUD();
                balls.splice(i, 1);
                if (lives <= 0) showGameOver(score);
            }
        }
    }

    function draw() {
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; // 拖尾效果
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 画篮子 (发光效果)
        ctx.shadowBlur = 20;
        ctx.shadowColor = basket.color;
        ctx.fillStyle = basket.color;
        ctx.fillRect(basket.x, basket.y, basket.w, basket.h);
        ctx.shadowBlur = 0;

        // 画球
        balls.forEach(b => {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
        });

        drawParticles();
    }

    function loop() {
        if (activeGame !== 'catch') return;
        update();
        draw();
        gameLoopId = requestAnimationFrame(loop);
    }
    loop();
}

// ==========================================
// 2. 飞机大战 (Plane) - 增强版
// ==========================================
function initPlaneGame() {
    let player = { x: 280, y: 350, w: 40, h: 40 };
    let bullets = [];
    let enemies = [];
    let particles = [];
    let keys = {};
    let frame = 0;

    window.onkeydown = e => {
        keys[e.key] = true;
        if (e.code === 'Space') shoot();
    };
    window.onkeyup = e => keys[e.key] = false;

    function shoot() {
        bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 15, color: '#ffeaa7' });
    }

    function createExplosion(x, y, color) {
        for (let i = 0; i < 10; i++) {
            particles.push({
                x: x, y: y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 20,
                color: color
            });
        }
    }

    function update() {
        if (isGameOver) return;
        frame++;

        // 玩家移动
        if (keys['ArrowLeft'] && player.x > 0) player.x -= 5;
        if (keys['ArrowRight'] && player.x < canvas.width - player.w) player.x += 5;

        // 子弹
        bullets.forEach((b, i) => {
            b.y -= 10;
            if (b.y < 0) bullets.splice(i, 1);
        });

        // 敌人
        if (frame % 50 === 0) {
            enemies.push({
                x: Math.random() * (canvas.width - 40),
                y: -40,
                w: 40, h: 40,
                speed: 2 + Math.random() * 2,
                color: '#ff7675'
            });
        }

        enemies.forEach((e, ei) => {
            e.y += e.speed;

            // 碰撞：子弹打敌人
            bullets.forEach((b, bi) => {
                if (rectIntersect(b, e)) {
                    createExplosion(e.x + e.w / 2, e.y + e.h / 2, e.color);
                    enemies.splice(ei, 1);
                    bullets.splice(bi, 1);
                    score += 100;
                    updateHUD();
                }
            });

            // 碰撞：敌人撞玩家
            if (rectIntersect(player, e)) {
                lives--;
                updateHUD();
                createExplosion(player.x, player.y, '#00f3ff');
                enemies.splice(ei, 1);
                if (lives <= 0) showGameOver(score);
            }

            if (e.y > canvas.height) enemies.splice(ei, 1);
        });

        // 粒子更新
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            if (p.life <= 0) particles.splice(i, 1);
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 玩家
        ctx.fillStyle = '#0984e3';
        ctx.beginPath();
        ctx.moveTo(player.x + player.w / 2, player.y);
        ctx.lineTo(player.x, player.y + player.h);
        ctx.lineTo(player.x + player.w, player.y + player.h);
        ctx.fill();

        // 子弹
        ctx.fillStyle = '#ffeaa7';
        bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

        // 敌人
        enemies.forEach(e => {
            ctx.fillStyle = e.color;
            ctx.fillRect(e.x, e.y, e.w, e.h);
        });

        // 粒子
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 20;
            ctx.fillRect(p.x, p.y, 4, 4);
            ctx.globalAlpha = 1;
        });
    }

    function loop() {
        if (activeGame !== 'plane') return;
        update();
        draw();
        gameLoopId = requestAnimationFrame(loop);
    }
    loop();
}

// ==========================================
// 3. 像素鸟 (Bird) - 增强版
// ==========================================
function initBirdGame() {
    let bird = { x: 50, y: 200, v: 0, g: 0.5, jump: -8, r: 15 };
    let pipes = [];
    let frame = 0;

    canvas.onclick = () => bird.v = bird.jump;
    window.onkeydown = e => { if (e.code === 'Space') bird.v = bird.jump; };

    function update() {
        if (isGameOver) return;
        frame++;

        bird.v += bird.g;
        bird.y += bird.v;

        // 生成管道
        if (frame % 120 === 0) {
            let gap = 160;
            let topH = Math.random() * (canvas.height - gap - 100) + 50;
            pipes.push({ x: canvas.width, top: topH, gap: gap, w: 60, passed: false });
        }

        pipes.forEach((p, i) => {
            p.x -= 3;

            // 碰撞
            if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + p.w) {
                if (bird.y - bird.r < p.top || bird.y + bird.r > p.top + p.gap) {
                    showGameOver(score);
                }
            }

            // 计分
            if (p.x + p.w < bird.x && !p.passed) {
                score++;
                updateHUD();
                p.passed = true;
            }

            if (p.x + p.w < 0) pipes.splice(i, 1);
        });

        if (bird.y + bird.r > canvas.height || bird.y - bird.r < 0) {
            showGameOver(score);
        }
    }

    function draw() {
        // 背景渐变
        let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#2d3436');
        grad.addColorStop(1, '#000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 管道
        ctx.fillStyle = '#00b894';
        pipes.forEach(p => {
            ctx.fillRect(p.x, 0, p.w, p.top);
            ctx.fillRect(p.x, p.top + p.gap, p.w, canvas.height);
            // 管道口高光
            ctx.fillStyle = '#55efc4';
            ctx.fillRect(p.x - 2, p.top - 20, p.w + 4, 20);
            ctx.fillRect(p.x - 2, p.top + p.gap, p.w + 4, 20);
            ctx.fillStyle = '#00b894';
        });

        // 小鸟 (带旋转)
        ctx.save();
        ctx.translate(bird.x, bird.y);
        ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.v * 0.1))));
        ctx.fillStyle = '#fdcb6e';
        ctx.beginPath();
        ctx.arc(0, 0, bird.r, 0, Math.PI * 2);
        ctx.fill();
        // 眼睛
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(6, -6, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath(); ctx.arc(8, -6, 2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    function loop() {
        if (activeGame !== 'bird') return;
        update();
        draw();
        gameLoopId = requestAnimationFrame(loop);
    }
    loop();
}

// ==========================================
// 4. 记忆翻牌 (Memory)
// ==========================================
function initMemoryGame() {
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    const emojis = ['🚀', '🪐', '👽', '🤖', '👾', '⭐', '🌙', '☄️'];
    let cards = [...emojis, ...emojis].sort(() => 0.5 - Math.random());

    let flipped = [];
    let matched = 0;
    let locked = false;

    cards.forEach(emoji => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `<span>${emoji}</span>`;

        card.onclick = () => {
            if (locked || card.classList.contains('flipped')) return;

            card.classList.add('flipped');
            flipped.push({ el: card, val: emoji });

            if (flipped.length === 2) {
                score++; // 这里用score代表步数
                updateHUD();
                checkMatch();
            }
        };
        board.appendChild(card);
    });

    function checkMatch() {
        locked = true;
        const [c1, c2] = flipped;
        if (c1.val === c2.val) {
            matched++;
            flipped = [];
            locked = false;
            if (matched === emojis.length) {
                setTimeout(() => showGameOver(score), 500);
            }
        } else {
            setTimeout(() => {
                c1.el.classList.remove('flipped');
                c2.el.classList.remove('flipped');
                flipped = [];
                locked = false;
            }, 1000);
        }
    }
}

// --- 工具函数 ---

function rectIntersect(r1, r2) {
    return !(r2.x > r1.x + r1.w ||
        r2.x + r2.w < r1.x ||
        r2.y > r1.y + r1.h ||
        r2.y + r2.h < r1.y);
}

// 简单的粒子系统用于接小球
let catchParticles = [];
function createParticles(x, y, color) {
    for (let i = 0; i < 5; i++) {
        catchParticles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 15,
            color: color
        });
    }
}

function drawParticles() {
    catchParticles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        if (p.life <= 0) catchParticles.splice(i, 1);
    });
}