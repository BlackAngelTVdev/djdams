document.querySelectorAll('a.scroll-link[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (!targetElement) return;

    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  });
});

const menuToggleButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

function closeMobileMenu() {
  document.body.classList.remove('nav-open');
  if (menuToggleButton) {
    menuToggleButton.setAttribute('aria-expanded', 'false');
    menuToggleButton.setAttribute('aria-label', 'Ouvrir le menu');
  }
}

if (menuToggleButton && mainNav) {
  menuToggleButton.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    menuToggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuToggleButton.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  document.addEventListener('click', (event) => {
    if (!document.body.classList.contains('nav-open')) {
      return;
    }

    if (mainNav.contains(event.target) || menuToggleButton.contains(event.target)) {
      return;
    }

    closeMobileMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}
