// js/ui.js

// 导航栏汉堡菜单
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
}

// 滚动动画观察器
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

function observeElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#' || targetId === '#home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 轮播图逻辑
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    function createIndicators() {
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }

    function updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((ind, index) => {
            ind.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        if (index < 0) currentIndex = slides.length - 1;
        else if (index >= slides.length) currentIndex = 0;
        else currentIndex = index;

        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateIndicators();
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    createIndicators();
    setInterval(() => goToSlide(currentIndex + 1), 5000);
}

// 筛选逻辑
function initFilter() {
    const filterMoreBtn = document.querySelector('.filter-more-btn');
    const worksFilter = document.querySelector('.works-filter');
    const parentTags = document.querySelectorAll('.parent-tag');
    const allFilterTags = document.querySelectorAll('.filter-tag');

    if (filterMoreBtn && worksFilter) {
        filterMoreBtn.addEventListener('click', () => {
            worksFilter.classList.toggle('expanded');
            filterMoreBtn.innerHTML = worksFilter.classList.contains('expanded')
                ? '收起 <i class="fas fa-chevron-up"></i>'
                : '更多 <i class="fas fa-chevron-down"></i>';
        });
    }

    parentTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const targetId = tag.dataset.target;
            const subgroup = document.getElementById(targetId);
            const parentFilter = tag.dataset.parentFilter;

            if (subgroup) {
                const isActive = tag.classList.contains('active');
                document.querySelectorAll('.filter-subgroup').forEach(group => group.classList.remove('active'));
                parentTags.forEach(t => t.classList.remove('active'));

                if (!isActive) {
                    tag.classList.add('active');
                    subgroup.classList.add('active');
                    filterCards(parentFilter);
                } else {
                    filterCards('all');
                }
            }
        });
    });

    document.querySelectorAll('.sub-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            allFilterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            filterCards(tag.dataset.filter);
        });
    });

    const allBtn = document.querySelector('.filter-tag[data-filter="all"]');
    if (allBtn) {
        allBtn.addEventListener('click', (e) => {
            allFilterTags.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            document.querySelectorAll('.filter-subgroup').forEach(group => group.classList.remove('active'));
            parentTags.forEach(t => t.classList.remove('active'));
            filterCards('all');
        });
    }
}

function filterCards(filter) {
    const currentCards = document.querySelectorAll('#portfolio-grid .work-card');
    currentCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';

        setTimeout(() => {
            const shouldShow = filter === 'all' ||
                card.dataset.category === filter ||
                (filter === 'web' && card.dataset.category.startsWith('web-'));

            card.style.display = shouldShow ? 'flex' : 'none';

            if (shouldShow) {
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                });
            }
        }, 300);
    });
}