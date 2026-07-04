// =====================================================
// lightbox.js
// Ventana emergente para ver en grande las imágenes
// de los carruseles de proyectos (estilo galería), con
// deslizamiento tipo carrusel, navegador de posición y
// listado de miniaturas del proyecto.
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const trackEl = document.getElementById('lightboxTrack');
    const counterEl = document.getElementById('lightboxCounter');
    const titleEl = document.getElementById('lightboxTitle');
    const dotsEl = document.getElementById('lightboxDots');
    const thumbsEl = document.getElementById('lightboxThumbs');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (!lightbox || !trackEl || !closeBtn || !prevBtn || !nextBtn) return;

    const MAX_DOTS = 10; // más allá de esto, solo se muestran las miniaturas
    const SLIDE_MS = 450; // duración del deslizamiento del carrusel

    let images = [];
    let index = 0;
    let altText = '';
    let lastFocused = null;
    let onCloseCallback = null;
    let isAnimating = false;
    let slideTimeout = null;

    const buildTrack = () => {
        trackEl.innerHTML = '';
        trackEl.style.width = `${images.length * 100}%`;

        images.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.className = 'lightbox__slide';
        slide.style.width = `${100 / images.length}%`;

        const img = document.createElement('img');
        img.src = src;
        img.alt = altText ? `${altText} — imagen ${i + 1}` : '';
        img.draggable = false;

        slide.appendChild(img);
        trackEl.appendChild(slide);
        });
    };

    const buildDots = () => {
        dotsEl.innerHTML = '';

        if (images.length < 2 || images.length > MAX_DOTS) {
        dotsEl.style.display = 'none';
        return;
        }

        dotsEl.style.display = 'flex';
        images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'lightbox__dot';
        dot.setAttribute('aria-label', `Ver imagen ${i + 1} de ${images.length}`);
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
        });
    };

    const buildThumbs = () => {
        thumbsEl.innerHTML = '';

        if (images.length < 2) {
        thumbsEl.style.display = 'none';
        return;
        }

        thumbsEl.style.display = 'flex';
        images.forEach((src, i) => {
        const thumb = document.createElement('button');
        thumb.type = 'button';
        thumb.className = 'lightbox__thumb';
        thumb.setAttribute('aria-label', `Ir a la imagen ${i + 1} de ${images.length}`);

        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.draggable = false;

        thumb.appendChild(img);
        thumb.addEventListener('click', () => goTo(i));
        thumbsEl.appendChild(thumb);
        });
    };

    const updateActiveStates = () => {
        Array.prototype.forEach.call(dotsEl.children, (dot, i) => {
        dot.classList.toggle('is-active', i === index);
        });

        Array.prototype.forEach.call(thumbsEl.children, (thumb, i) => {
        thumb.classList.toggle('is-active', i === index);
        if (i === index) {
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
        });
    };

    const renderMeta = () => {
        const multiple = images.length > 1;

        counterEl.textContent = multiple ? `${index + 1} / ${images.length}` : '';
        prevBtn.style.display = multiple ? 'flex' : 'none';
        nextBtn.style.display = multiple ? 'flex' : 'none';

        titleEl.textContent = altText || '';

        updateActiveStates();
    };

    const moveTrackTo = (i) => {
        const slidePercent = 100 / images.length;
        trackEl.style.transform = `translateX(-${i * slidePercent}%)`;
    };

    /**
     * Abre el visor de imágenes.
     * @param {string[]} imgs - Rutas de las imágenes a mostrar.
     * @param {number} startIndex - Índice inicial dentro de imgs.
     * @param {string} alt - Texto alternativo (nombre del proyecto).
     * @param {(finalIndex:number)=>void} onClose - Se llama al cerrar,
     *   con el índice de la última imagen vista (útil para sincronizar
     *   el carrusel de origen).
     */
    const open = (imgs, startIndex, alt, onClose) => {
        if (!imgs || !imgs.length) return;

        window.clearTimeout(slideTimeout);
        isAnimating = false;

        images = imgs;
        index = startIndex || 0;
        altText = alt || '';
        onCloseCallback = typeof onClose === 'function' ? onClose : null;
        lastFocused = document.activeElement;

        buildTrack();
        buildDots();
        buildThumbs();

        // Coloca el carrusel en la imagen inicial sin animación.
        trackEl.style.transition = 'none';
        moveTrackTo(index);
        void trackEl.offsetWidth;
        trackEl.style.transition = '';

        renderMeta();

        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
        closeBtn.focus();
    };

    const close = () => {
        if (!lightbox.classList.contains('is-open')) return;

        window.clearTimeout(slideTimeout);
        isAnimating = false;

        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');

        if (onCloseCallback) onCloseCallback(index);
        onCloseCallback = null;

        if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
        }
    };

    /**
     * Cambia de imagen deslizando el carrusel a izquierda o derecha,
     * igual que un carrusel normal.
     * @param {number} i - Índice destino (se normaliza con wrap-around).
     */
    const goTo = (i) => {
        if (!images.length || isAnimating) return;

        const newIndex = (i + images.length) % images.length;
        if (newIndex === index) return;

        isAnimating = true;
        index = newIndex;
        moveTrackTo(index);
        renderMeta();

        slideTimeout = window.setTimeout(() => {
        isAnimating = false;
        }, SLIDE_MS);
    };

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    // Cierra al hacer clic fuera de la imagen (sobre el fondo oscuro)
    lightbox.addEventListener('click', (event) => {
        if (
        event.target === lightbox ||
        event.target.classList.contains('lightbox__backdrop')
        ) {
        close();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('is-open')) return;

        if (event.key === 'Escape') close();
        if (event.key === 'ArrowLeft') goTo(index - 1);
        if (event.key === 'ArrowRight') goTo(index + 1);
    });

    // Navegación por gestos táctiles (swipe)
    let touchStartX = 0;
    let touchStartY = 0;

    lightbox.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (event) => {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) goTo(index + 1);
        else goTo(index - 1);
        }
    }, { passive: true });

    // Expuesto globalmente para que projects.js pueda invocarlo
    window.openLightbox = open;
});
