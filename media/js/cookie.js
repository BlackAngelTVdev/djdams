  const COOKIE_STORAGE_KEY = 'djdam_cookies_preferences';

  const cookieBanner = document.getElementById('cookie-banner');
  const cookieManager = document.getElementById('cookie-manager');
  const fixedManageBtn = document.getElementById('manage-cookies-fixed-btn');
  const footerManageBtn = document.getElementById('manage-cookies-footer-btn');
  const acceptBtn = document.getElementById('accept-cookies-btn');
  const manageBtn = document.getElementById('manage-cookies-btn');
  const closeManagerBtn = document.getElementById('close-manager-btn');
  const cookieForm = document.getElementById('cookie-form');

  function openCookieManager() {
    cookieManager.style.display = 'block';
  }

  // Affiche le bandeau si pas encore de choix enregistré
  function checkCookieConsent() {
    const prefs = JSON.parse(localStorage.getItem(COOKIE_STORAGE_KEY));
    if (!prefs) {
      cookieBanner.style.display = 'flex';
    } else {
      cookieBanner.style.display = 'none';
      // Remplit le formulaire avec les prefs
      for (const [key, val] of Object.entries(prefs)) {
        const checkbox = cookieForm.elements[key];
        if (checkbox) checkbox.checked = val;
      }
    }
  }

  // Accepter tout : nécessaire + analytics + marketing
  acceptBtn.addEventListener('click', () => {
    const prefs = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    cookieBanner.style.display = 'none';
  });

  // Ouvrir popup gestion cookies
  manageBtn.addEventListener('click', openCookieManager);
  if (fixedManageBtn) {
    fixedManageBtn.addEventListener('click', openCookieManager);
  }
  if (footerManageBtn) {
    footerManageBtn.addEventListener('click', openCookieManager);
  }

  // Fermer popup gestion sans sauvegarder
  closeManagerBtn.addEventListener('click', () => {
    cookieManager.style.display = 'none';
  });

  // Valider gestion cookies
  cookieForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Nécéssaire toujours true
    const prefs = {
      necessary: true,
      analytics: cookieForm.elements['analytics'].checked,
      marketing: cookieForm.elements['marketing'].checked,
    };
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    cookieManager.style.display = 'none';
    cookieBanner.style.display = 'none';
    // Tu peux ici appeler des fonctions pour activer/désactiver les scripts de tracking
  });

  // Au chargement de la page
  window.addEventListener('DOMContentLoaded', () => {
    checkCookieConsent();
  });