const gamesData = [
    {
        id: 1,
        title: "接小球",
        desc: "考验反应速度，接住所有掉落的小球。",
        icon: "⚽",
        link: "./2502011087 洪梓铖/ball.html"
    },
    {
        id: 2,
        title: "记忆宫殿",
        desc: "挑战你的记忆极限，记住每一个图案。",
        icon: "🧠",
        link: "./2502011053 王俊/memory game.html"
    },
    {
        id: 3,
        title: "飞机大战",
        desc: "驾驶战机，消灭来袭的敌人。",
        icon: "✈️",
        link: "./2502011072 李保宏/index.html"
    },
    {
        id: 4,
        title: "像素鸟",
        desc: "控制小鸟，不要碰到建筑。",
        icon: "🐦",
        link: "./2502015756 王嘉玉/index.html"
    }
];

const container = document.getElementById('game-container');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('welcome-modal');
const closeBtn = document.getElementById('close-modal-btn');

function renderGames(games) {
    container.innerHTML = '';
    games.forEach(game => {
        const card = document.createElement('a');
        card.href = game.link;
        card.className = 'game-card';

        card.innerHTML = `
            <div class="card-image">
                ${game.icon}
            </div>
            <div class="card-content">
                <div class="card-title">${game.title}</div>
                <div class="card-desc">${game.desc}</div>
            </div>
        `;

        container.appendChild(card);
    });
    const placeholderCard = document.createElement('a');
    placeholderCard.href = "#";
    placeholderCard.className = 'game-card placeholder';
    placeholderCard.innerHTML = `
        <div class="placeholder-content">
            <span class="placeholder-icon">+</span>
            <span>待添加游戏</span>
        </div>
    `;
    container.appendChild(placeholderCard);
}

renderGames(gamesData);

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filteredGames = gamesData.filter(game =>
        game.title.toLowerCase().includes(searchTerm) ||
        game.desc.toLowerCase().includes(searchTerm)
    );
    renderGames(filteredGames);
});

window.addEventListener('load', () => {
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});