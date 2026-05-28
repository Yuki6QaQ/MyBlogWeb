// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化 UI 组件
    initNavigation();
    initSmoothScroll();
    initCarousel();
    initFilter();
    initSidebar();

    // 2. 渲染动态内容
    renderProjects();
    renderNotes();

    // 3. 绑定滚动动画
    observeElements('.site-card, .work-card, .blog-card, .info-card, .tags-card, .timeline-card');
});

function renderProjects() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    grid.innerHTML = projectsData.map(project => `
        <a href="${project.link}" class="work-card-link">
            <div class="work-card glass" data-category="${project.category}">
                <div class="work-info">
                    <h3>${project.title}</h3>
                    <p>${project.desc}</p>
                </div>
                <div class="work-icon">${project.icon}</div>
            </div>
        </a>
    `).join('');

    observeElements('#portfolio-grid .work-card');
}

function renderNotes() {
    const grid = document.getElementById('notes-grid');
    if (!grid) return;

    grid.innerHTML = notesData.map(note => `
        <a href="${note.link}" class="work-card-link">
            <div class="work-card glass">
                <div class="work-info">
                    <h3>${note.title}</h3>
                    <p>${note.desc}</p>
                </div>
                <div class="work-icon">${note.icon}</div>
            </div>
        </a>
    `).join('');

    observeElements('#notes-grid .work-card');
}