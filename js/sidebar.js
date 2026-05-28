// js/sidebar.js
function updateSidebarStatus() {
    const timeElement = document.getElementById('sidebar-time');
    const quoteElement = document.getElementById('sidebar-quote');

    if (timeElement) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }

    if (quoteElement) {
        const quotes = [
            "Stay hungry, stay foolish.",
            "Code is poetry.",
            "Keep it simple, stupid.",
            "Hello World!",
            "Design is intelligence made visible."
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.textContent = randomQuote;
    }
}

function initSidebar() {
    updateSidebarStatus();
    setInterval(updateSidebarStatus, 60000);
}