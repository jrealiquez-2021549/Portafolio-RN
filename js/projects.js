
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projectsGrid');
    const detailSection = document.getElementById('proyectoDetalle');
    const detail = document.getElementById('projectDetail');

    if (!grid || !detail || !detailSection || typeof PROJECTS_DATA === 'undefined') {
        return;
    }

    /* -------------------------------------------------
        1) Construir las tarjetas resumen
    ------------------------------------------------- */
    const buildCard = (project) => `
        <article
        class="project__card project__card--${project.id}"
        data-project="${project.id}"
        tabindex="0"
        role="button"
        aria-pressed="false"
        >
        <span class="project__card-icon">
            <img src="${project.icon}" alt="" />
        </span>
        <span class="project__card-divider" aria-hidden="true"></span>
        <span class="project__card-body">
            <h3>${project.title}</h3>
            <p>${project.shortDescription}</p>
        </span>
        </article>
    `;

    grid.innerHTML = PROJECTS_DATA.map(buildCard).join('');

    /* -------------------------------------------------
        1.1) Carrusel horizontal de tarjetas de proyecto
        Mantiene siempre 3 tarjetas visibles en escritorio
        (2 en tablet, 1 en móvil) y permite desplazarse con
        flechas cuando hay más proyectos de los que caben.
    ------------------------------------------------- */
    const projectsPrev = document.getElementById('projectsPrev');
    const projectsNext = document.getElementById('projectsNext');

    if (projectsPrev && projectsNext) {
        let cardIndex = 0;

        const getCardsPerView = () => {
        const width = window.innerWidth;
        if (width <= 560) return 1;
        if (width <= 900) return 2;
        return 3;
        };

        const getMaxIndex = () => Math.max(0, PROJECTS_DATA.length - getCardsPerView());

        const renderCarousel = () => {
        const cardEls = grid.querySelectorAll('.project__card');
        if (!cardEls.length) return;

        const maxIndex = getMaxIndex();
        cardIndex = Math.min(cardIndex, maxIndex);

        const cardWidth = cardEls[0].getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(grid).columnGap || getComputedStyle(grid).gap) || 0;
        grid.style.transform = `translateX(-${cardIndex * (cardWidth + gap)}px)`;

        const needsArrows = maxIndex > 0;
        projectsPrev.classList.toggle('is-hidden', !needsArrows);
        projectsNext.classList.toggle('is-hidden', !needsArrows);
        projectsPrev.disabled = cardIndex === 0;
        projectsNext.disabled = cardIndex >= maxIndex;
        };

        const goToCard = (index) => {
        cardIndex = Math.min(Math.max(index, 0), getMaxIndex());
        renderCarousel();
        };

        projectsPrev.addEventListener('click', () => goToCard(cardIndex - 1));
        projectsNext.addEventListener('click', () => goToCard(cardIndex + 1));
        window.addEventListener('resize', renderCarousel);

        renderCarousel();
    }

    /* -------------------------------------------------
        2) Construir el panel de detalle (con carrusel)
    ------------------------------------------------- */
    const buildActionButton = (href, icon, label, variant) => {
        if (!href) return '';
        return `
        <a
            class="project__btn project__btn--${variant}"
            href="${href}"
            target="_blank"
            rel="noopener noreferrer"
        >
            <img src="${icon}" alt="" />
            <span>${label}</span>
        </a>
        `;
    };

    const buildDetailContent = (project) => `
        <div class="project__detail-inner">
        <div class="project__detail-text">
            <h3>${project.title}</h3>
            <p>${project.description}</p>

            <div class="project__actions">
            ${buildActionButton(project.links.repo, 'assets/icons/github.png', 'Repositorio', 'repo')}
            ${buildActionButton(project.links.presentacion, 'assets/icons/presentacion.png', 'Presentación', 'presentacion')}
            ${buildActionButton(project.links.sitio, 'assets/icons/sitio.png', 'Ir al sitio', 'sitio')}
            </div>
        </div>

        <div class="project__carousel project__carousel--${project.id}" data-carousel>
            <div class="project__carousel-track">
            ${project.images
                .map(
                (src) => `
                    <div class="project__carousel-slide">
                    <img src="${src}" alt="${project.title}" loading="lazy" />
                    </div>
                `
                )
                .join('')}
            </div>

            ${
            project.images.length > 1
                ? `
                <button class="project__carousel-arrow project__carousel-arrow--prev" data-dir="-1" aria-label="Imagen anterior">‹</button>
                <button class="project__carousel-arrow project__carousel-arrow--next" data-dir="1" aria-label="Imagen siguiente">›</button>
                <div class="project__carousel-dots">
                    ${project.images
                    .map(
                        (_, i) => `
                        <button
                            class="project__carousel-dot${i === 0 ? ' is-active' : ''}"
                            data-index="${i}"
                            aria-label="Ver imagen ${i + 1}"
                        ></button>
                        `
                    )
                    .join('')}
                </div>
                `
                : ''
            }
        </div>
        </div>
    `;

    let carouselTimer = null;

    const initCarousel = (root, project) => {
        const carousel = root.querySelector('[data-carousel]');
        const track = root.querySelector('.project__carousel-track');
        const dots = root.querySelectorAll('.project__carousel-dot');
        const arrows = root.querySelectorAll('.project__carousel-arrow');
        const slideImages = root.querySelectorAll('.project__carousel-slide img');

        let index = 0;

        const goTo = (i) => {
        if (!track) return;
        index = (i + project.images.length) % project.images.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, di) => dot.classList.toggle('is-active', di === index));
        };

        const resetAutoplay = () => {
        if (carouselTimer) clearInterval(carouselTimer);
        if (project.images.length > 1) {
            carouselTimer = setInterval(() => goTo(index + 1), 5000);
        }
        };

        // Al hacer clic en una imagen del carrusel, se abre el visor en grande
        slideImages.forEach((img, i) => {
        img.addEventListener('click', () => {
            if (typeof window.openLightbox !== 'function') return;

            if (carouselTimer) clearInterval(carouselTimer);

            window.openLightbox(project.images, i, project.title, (finalIndex) => {
            // Al cerrar el visor, el carrusel queda sincronizado con la
            // última imagen vista y retoma el autoplay.
            goTo(finalIndex);
            resetAutoplay();
            });
        });
        });

        if (!track || project.images.length <= 1) return;

        dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            goTo(Number(dot.dataset.index));
            resetAutoplay();
        });
        });

        arrows.forEach((arrow) => {
        arrow.addEventListener('click', () => {
            goTo(index + Number(arrow.dataset.dir));
            resetAutoplay();
        });
        });

        resetAutoplay();

        // Pausa el autoplay mientras el usuario interactúa con el carrusel
        if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(carouselTimer));
        carousel.addEventListener('mouseleave', resetAutoplay);
        }
    };

    /* -------------------------------------------------
        3) Selección de proyecto
    ------------------------------------------------- */
    const cards = () => grid.querySelectorAll('.project__card');

    const selectProject = (id) => {
        const project = PROJECTS_DATA.find((p) => p.id === id);
        if (!project) return;

        if (carouselTimer) clearInterval(carouselTimer);

        // El fondo y el tinte de color ahora viven en la sección completa
        // (no solo en la tarjeta de detalle), sin perder clases como
        // "is-visible" que controla la animación de aparición al hacer scroll.
        detailSection.classList.remove(
        'project__detail--kp',
        'project__detail--kgh',
        'project__detail--kb',
        'project__detail--ek'
        );
        detailSection.classList.add(`project__detail--${project.id}`);
        detailSection.style.backgroundImage = `url('${project.background}')`;

        detail.classList.remove('is-active');
        detail.innerHTML = buildDetailContent(project);
        // Fuerza un reflow para que la animación de aparición se repita
        // cada vez que se selecciona un proyecto distinto.
        void detail.offsetWidth;
        detail.classList.add('is-active');

        cards().forEach((card) => {
        const active = card.dataset.project === id;
        card.classList.toggle('is-active', active);
        card.setAttribute('aria-pressed', String(active));
        });

        initCarousel(detail, project);
    };

    cards().forEach((card) => {
        card.addEventListener('click', () => selectProject(card.dataset.project));
        card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectProject(card.dataset.project);
        }
        });
    });

    // Proyecto seleccionado por defecto: el primero de la lista
    if (PROJECTS_DATA.length) {
        selectProject(PROJECTS_DATA[0].id);
    }
});