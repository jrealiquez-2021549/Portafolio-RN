// =====================================================
// script.js
// Comportamiento del navbar: fondo sólido al hacer scroll,
// menú móvil y resaltado de la sección activa.
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelectorAll('[data-nav]');
    const sections = document.querySelectorAll('main section[id]');
    const yearEl = document.getElementById('year');

    const SCROLL_THRESHOLD = 60; // px antes de que el navbar se vuelva sólido

    /* -------------------------------------------------
        1) Navbar transparente -> sólido al hacer scroll
    ------------------------------------------------- */
    const handleScroll = () => {
        if (window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add('is-scrolled');
        } else {
        navbar.classList.remove('is-scrolled');
        }
    };

    handleScroll(); // por si la página carga ya desplazada
    window.addEventListener('scroll', handleScroll, { passive: true });

    /* -------------------------------------------------
        2) Menú móvil (hamburguesa)
    ------------------------------------------------- */
    if (navToggle) {
        navToggle.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Cierra el menú al elegir una sección (en móvil)
        navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
        });
    }

    /* -------------------------------------------------
        3) Resaltar el enlace de la sección visible
    ------------------------------------------------- */
    if ('IntersectionObserver' in window && sections.length) {
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach((link) => {
                const isMatch = link.getAttribute('href') === `#${id}`;
                link.classList.toggle('is-active', isMatch);
                });
            }
            });
        },
        {
            rootMargin: '-40% 0px -55% 0px', // activa el enlace cuando la sección cruza el centro
            threshold: 0,
        }
        );

        sections.forEach((section) => observer.observe(section));
    }

    /* -------------------------------------------------
        4) Año actual en el footer
    ------------------------------------------------- */
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});