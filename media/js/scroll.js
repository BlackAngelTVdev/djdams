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
