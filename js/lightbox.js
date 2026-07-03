// =====================================================
// lightbox.js
// Ventana emergente para ver en grande las imágenes
// de los carruseles de proyectos (estilo galería).
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const imageEl = document.getElementById('lightboxImage');
    const counterEl = document.getElementById('lightboxCounter');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (!lightbox || !imageEl || !closeBtn || !prevBtn || !nextBtn) return;

    let images = [];
    let index = 0;
    let altText = '';
    let lastFocused = null;
    let onCloseCallback = null;

    const updateImage = () => {
        imageEl.src = images[index];
        imageEl.alt = altText;

        const multiple = images.length > 1;
        counterEl.textContent = multiple ? `${index + 1} / ${images.length}` : '';
        prevBtn.style.display = multiple ? 'flex' : 'none';
        nextBtn.style.display = multiple ? 'flex' : 'none';
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

        images = imgs;
        index = startIndex || 0;
        altText = alt || '';
        onCloseCallback = typeof onClose === 'function' ? onClose : null;
        lastFocused = document.activeElement;

        updateImage();

        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
        closeBtn.focus();
    };

    const close = () => {
        if (!lightbox.classList.contains('is-open')) return;

        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');

        if (onCloseCallback) onCloseCallback(index);
        onCloseCallback = null;

        if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
        }
    };

    const goTo = (i) => {
        if (!images.length) return;
        index = (i + images.length) % images.length;
        updateImage();
    };

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    // Cierra al hacer clic fuera de la imagen (sobre el fondo oscuro)
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox || event.target.classList.contains('lightbox__stage')) {
        close();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('is-open')) return;

        if (event.key === 'Escape') close();
        if (event.key === 'ArrowLeft') goTo(index - 1);
        if (event.key === 'ArrowRight') goTo(index + 1);
    });

    // Expuesto globalmente para que projects.js pueda invocarlo
    window.openLightbox = open;
});
