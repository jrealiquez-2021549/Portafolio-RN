
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

        if (!track || project.images.length <= 1) return;

        let index = 0;

        const goTo = (i) => {
        index = (i + project.images.length) % project.images.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, di) => dot.classList.toggle('is-active', di === index));
        };

        const resetAutoplay = () => {
        if (carouselTimer) clearInterval(carouselTimer);
        carouselTimer = setInterval(() => goTo(index + 1), 5000);
        };

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
        'project__detail--kb'
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