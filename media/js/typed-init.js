document.addEventListener('DOMContentLoaded', () => {
  if (typeof Typed === 'undefined') return;
  const el = document.getElementById('typed');
  if (!el) return;
  new Typed(el, {
    strings: ['Anniversaires', 'Bals', 'Soirées Privées', 'Événements'],
    typeSpeed: 60,
    backDelay: 2000,
    backSpeed: 40,
    loop: true
  });
});
