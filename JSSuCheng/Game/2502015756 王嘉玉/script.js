(() => {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d', { alpha: false });
    const overlay = document.getElementById('overlay');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlayText = document.getElementById('overlayText');
    const scoreEl = document.getElementById('score');
    const bestEl = document.getElementById('best');
    const board = document.getElementById('board');
    const spark = document.getElementById('spark');

    const W = canvas.width;
    const H = canvas.height;

    const GRAVITY = 1900;
    const JUMP_VY = -520;
    const PIPE_SPEED = 240;
    const PIPE_GAP = 165;
    const PIPE_W = 72;
    const PIPE_INTERVAL = 1.25;
    const GROUND_H = 90;

    const BIRD_X = 118;
    const BIRD_W = 34;
    const BIRD_H = 26;

    const PIXEL = 1;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const rand = (a, b) => a + Math.random() * (b - a);

    let state = 'idle';
    let lastT = 0;

    let bird = { x: BIRD_X, y: H / 2, vy: 0 };

    let pipes = [];
    let pipeTimer = 0;

    let score = 0;
    let best = Number(localStorage.getItem('pixelbird_best') || '0');
    bestEl.textContent = String(best);

    function setOverlay(show, title, text) {
        overlay.classList.toggle('hidden', !show);
        if (title != null) overlayTitle.textContent = title;
        if (text != null) overlayText.textContent = text;
    }

    function reset() {
        state = 'idle';
        lastT = 0;
        bird.y = H / 2;
        bird.vy = 0;
        pipes = [];
        pipeTimer = 0;
        score = 0;
        scoreEl.textContent = '0';
        setOverlay(true, '像素鸟', '点击画面 / 按【空格】跳跃\n按【Enter】开始\n按【R】重开');
    }

    function start() {
        if (state === 'running') return;
        state = 'running';
        setOverlay(false);
    }

    function dead() {
        if (state !== 'running') return;
        state = 'dead';

        if (score > best) {
            best = score;
            localStorage.setItem('pixelbird_best', String(best));
            bestEl.textContent = String(best);
        }

        const t = `游戏结束！\n分数：${score}\n最佳：${best}\n\n按【R】重开`;
        setOverlay(true, '再来一次', t);
    }

    function jump() {
        if (state === 'idle') start();
        if (state === 'dead') return;
        bird.vy = JUMP_VY;
        popSpark();
    }

    function popSpark() {
        const r = Math.random();
        spark.style.left = `${W / 2 + (r - 0.5) * 12}px`;
        spark.style.top = `${Math.max(0, bird.y - 5)}px`;
        spark.classList.remove('show');
        void spark.offsetWidth;
        spark.classList.add('show');
    }

    function spawnPipe() {
        const topLimit = 110;
        const bottomLimit = H - GROUND_H - 110;
        const center = rand(topLimit + PIPE_GAP / 2, bottomLimit - PIPE_GAP / 2);
        const gapTop = center - PIPE_GAP / 2;
        const gapBottom = center + PIPE_GAP / 2;

        pipes.push({
            x: W + 20,
            gapTop,
            gapBottom,
            passed: false
        });
    }

    function aabbIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }

    function drawPixelRect(x, y, w, h, color) {
        ctx.fillStyle = color;
        x = Math.round(x / PIXEL) * PIXEL;
        y = Math.round(y / PIXEL) * PIXEL;
        w = Math.round(w / PIXEL) * PIXEL;
        h = Math.round(h / PIXEL) * PIXEL;
        ctx.fillRect(x, y, w, h);
    }

    function draw() {
        ctx.fillStyle = '#071024';
        ctx.fillRect(0, 0, W, H);

        const t = performance.now() * 0.001;
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        for (let i = 0; i < 18; i++) {
            const sx = (i * 83 + Math.floor(t * 60)) % (W + 40) - 20;
            const sy = 20 + ((i * 37) % 120);
            drawPixelRect(sx, sy, 2, 2, 'rgba(255,255,255,0.14)');
        }

        const groundY = H - GROUND_H;
        for (let x = 0; x < W; x += 12) {
            const alt = ((x / 12 | 0) % 2) === 0;
            drawPixelRect(x, groundY, 12, GROUND_H, alt ? 'rgba(50, 255, 170, 0.08)' : 'rgba(0,0,0,0)');
        }
        const base = '#0f4a2c';
        for (let x = 0; x < W; x += 8) {
            const h = 8 + ((x * 13) % 7);
            drawPixelRect(x, groundY + GROUND_H - h, 8, h, base);
        }

        for (const p of pipes) {
            const topH = p.gapTop;
            const botY = p.gapBottom;
            const botH = groundY - botY;

            drawPipe(p.x, 0, PIPE_W, topH, true);
            drawPipe(p.x, botY, PIPE_W, botH, false);

            drawPixelRect(p.x - 4, topH - 14, PIPE_W + 8, 14, '#2ee59d');
            drawPixelRect(p.x - 4, botY, PIPE_W + 8, 14, '#2ee59d');
        }

        drawBird(bird.x, bird.y);

        if (state !== 'running') {
            ctx.fillStyle = 'rgba(255,209,102,0.12)';
            ctx.fillRect(0, 0, W, 38);
            ctx.fillStyle = 'rgba(255,209,102,0.85)';
            ctx.font = '800 14px ui-sans-serif, system-ui';
            ctx.fillText(state === 'dead' ? '已撞击' : '等待开始', 14, 24);
        }
    }

    function drawPipe(x, y, w, h, isTop) {
        const dark = isTop ? '#1f7a51' : '#1a6b4a';
        const bright = isTop ? 'rgba(52,211,153,0.95)' : 'rgba(52,211,153,0.9)';

        for (let yy = 0; yy < h; yy += 8) {
            const useBright = ((yy / 8 | 0) % 2) === 0;
            const color = useBright ? bright : dark;
            drawPixelRect(x, y + yy, w, Math.min(8, h - yy), color);
        }

        drawPixelRect(x + 12, y + 10, w - 24, Math.max(0, h - 20), 'rgba(255,255,255,0.07)');
        drawPixelRect(x - 2, y - 2, w + 4, 6, 'rgba(52,211,153,0.35)');
    }

    function drawBird(x, y) {
        const flap = Math.sin(performance.now() * 0.02) * 2 + bird.vy * 0.015;
        const wing = flap < 0 ? 1 : -1;

        const body = '#ffcc4d';
        const body2 = '#e1a93a';

        drawPixelRect(x - 6, y + 10, 6, 10, body2);
        drawPixelRect(x - 4, y + 6 + wing * 2, 6, 7, 'rgba(255,255,255,0.10)');

        drawPixelRect(x, y, BIRD_W, BIRD_H, body);
        drawPixelRect(x + 12, y + 6, 10, 7, body2);
        drawPixelRect(x + 6, y + 10, 8, 5, 'rgba(255,255,255,0.16)');

        drawPixelRect(x + BIRD_W - 10, y + 7, 5, 4, '#0b1020');
        drawPixelRect(x + BIRD_W - 8, y + 8, 2, 2, '#ffffff');

        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 2;
        ctx.strokeRect(Math.round(x), Math.round(y), BIRD_W, BIRD_H);
    }

    function update(dt) {
        const speedBoost = Math.min(1.25, 1 + score * 0.006);
        const gravityBoost = Math.min(1.15, 1 + score * 0.003);

        bird.vy += GRAVITY * gravityBoost * dt;
        bird.y += bird.vy * dt;

        pipeTimer -= dt;
        if (pipeTimer <= 0) {
            spawnPipe();
            pipeTimer = PIPE_INTERVAL * rand(0.85, 1.15);
        }

        const vx = PIPE_SPEED * speedBoost;
        for (const p of pipes) {
            p.x -= vx * dt;
        }

        pipes = pipes.filter(p => p.x + PIPE_W > -40);

        const birdBox = { x: bird.x, y: bird.y, w: BIRD_W, h: BIRD_H };
        const groundY = H - GROUND_H;

        if (bird.y + BIRD_H >= groundY) { dead(); }
        if (bird.y <= -10) { dead(); }

        for (const p of pipes) {
            if (!p.passed && (p.x + PIPE_W) < bird.x) {
                p.passed = true;
                score++;
                scoreEl.textContent = String(score);
            }

            const topRect = { x: p.x, y: 0, w: PIPE_W, h: p.gapTop };
            const botRect = { x: p.x, y: p.gapBottom, w: PIPE_W, h: groundY - p.gapBottom };

            if (aabbIntersect(birdBox.x, birdBox.y, birdBox.w, birdBox.h, topRect.x, topRect.y, topRect.w, topRect.h) ||
                aabbIntersect(birdBox.x, birdBox.y, birdBox.w, birdBox.h, botRect.x, botRect.y, botRect.w, botRect.h)) {
                dead();
            }
        }
    }

    function loop(t) {
        const tt = t || 0;
        let dt = (tt - lastT) / 1000;
        lastT = tt;
        if (!Number.isFinite(dt) || dt <= 0) dt = 1 / 60;
        dt = Math.min(1 / 30, dt);

        if (state === 'running') update(dt);

        draw();
        requestAnimationFrame(loop);
    }

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault();
            jump();
        } else if (e.key === 'Enter') {
            if (state === 'idle') start();
        } else if (e.key === 'r' || e.key === 'R') {
            reset();
        }
    }, { passive: false });

    board.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        jump();
    }, { passive: false });

    reset();
    requestAnimationFrame(loop);
})();