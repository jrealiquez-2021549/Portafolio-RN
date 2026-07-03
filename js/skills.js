// =====================================================
// skills.js
// Genera las pestañas y paneles de la sección Habilidades
// a partir de SKILLS_DATA (skills-data.js) y anima las
// barras de progreso cuando el panel se muestra.
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const tabsContainer = document.getElementById('skillsTabs');
  const panelsContainer = document.getElementById('skillsPanels');

  if (!tabsContainer || !panelsContainer || typeof SKILLS_DATA === 'undefined') {
    return;
  }

  const buildIcon = (item) => `
    <span class="skill__icon">
      <iconify-icon icon="${item.icon}" width="22" height="22"></iconify-icon>
    </span>
  `;

  const buildSkillRow = (item) => `
    <div class="skill__row">
      ${buildIcon(item)}
      <div class="skill__info">
        <div class="skill__head">
          <span class="skill__name">${item.name}</span>
          <span class="skill__percent">${item.percent}%</span>
        </div>
        <div class="skill__bar">
          <div class="skill__bar-fill" data-target="${item.percent}%"></div>
        </div>
      </div>
    </div>
  `;

  let tabsHTML = '';
  let panelsHTML = '';

  SKILLS_DATA.forEach((category, index) => {
    const isActive = index === 0;

    tabsHTML += `
      <button
        class="skills__tab${isActive ? ' is-active' : ''}"
        data-category="${category.id}"
        role="tab"
        aria-selected="${isActive}"
      >
        ${category.title}
      </button>
    `;

    panelsHTML += `
      <div class="skills__panel${isActive ? ' is-active' : ''}" data-category="${category.id}" role="tabpanel">
        <div class="skills__list">
          ${category.items.map(buildSkillRow).join('')}
        </div>
      </div>
    `;
  });

  tabsContainer.innerHTML = tabsHTML;
  panelsContainer.innerHTML = panelsHTML;

  const animatePanel = (panel) => {
    if (!panel || panel.dataset.animated === 'true') return;

    const fills = panel.querySelectorAll('.skill__bar-fill');
    // Doble rAF para asegurar que el navegador registre el width
    // inicial (0%) antes de animar hacia el valor objetivo.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fills.forEach((fill) => {
          fill.style.width = fill.dataset.target;
        });
      });
    });

    panel.dataset.animated = 'true';
  };

  const tabs = tabsContainer.querySelectorAll('.skills__tab');
  const panels = panelsContainer.querySelectorAll('.skills__panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });

      panels.forEach((panel) => {
        const active = panel.getAttribute('data-category') === category;
        panel.classList.toggle('is-active', active);
        if (active) animatePanel(panel);
      });
    });
  });

  const habilidadesSection = document.getElementById('habilidades');
  const firstPanel = panelsContainer.querySelector('.skills__panel.is-active');

  if ('IntersectionObserver' in window && habilidadesSection) {
    const skillsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animatePanel(firstPanel);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    skillsObserver.observe(habilidadesSection);
  } else {
    animatePanel(firstPanel);
  }
});
