const IS_SUBPAGE = window.location.pathname.indexOf('/pages/') !== -1;
const BASE_PATH = IS_SUBPAGE ? '../' : './';
const PRICES_DATA_URL = BASE_PATH + 'media/data/prices.json';
const PRICES_PAGE_URL = BASE_PATH + 'pages/tarifs.html';
const LIGHTBOX_ID = 'prices-lightbox';

const pricesRoot = document.getElementById('prices-root');
const homePricingRoot = document.getElementById('home-pricing-root');
const pricesPills = document.getElementById('prices-pills');
const pricesTitle = document.getElementById('prices-title');
const pricesSubtitle = document.getElementById('prices-subtitle');
const pricesUpdated = document.getElementById('prices-updated');

function hasText(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (hasText(className)) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function isNumericPrice(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value !== 'string') return false;
  const cleaned = value.replace(/\s/g, '').replace(',', '.');
  return cleaned !== '' && !Number.isNaN(Number(cleaned));
}

function formatPriceText(value, currency) {
  if (!hasText(value)) return '';
  const raw = String(value).trim();
  if (!isNumericPrice(raw) || !hasText(currency)) return raw;
  return raw + ' ' + currency;
}

function collectItems(data) {
  const items = [];
  (Array.isArray(data.categories) ? data.categories : []).forEach((category) => {
    if (!category || !Array.isArray(category.items)) return;
    category.items.forEach((item) => {
      if (item && typeof item === 'object') items.push(item);
    });
  });
  return items;
}

// ── Bloc prix : "250 CHF / la prestation" (ou "Sur devis") ──
function buildPriceLine(item) {
  const line = el('div', 'price-line');
  const numeric = hasText(item.price) && isNumericPrice(item.price);

  const amount = el('span', 'price-amount');
  if (!numeric) amount.classList.add('is-text');
  amount.textContent = hasText(item.price) ? String(item.price).trim() : 'Sur devis';

  if (numeric && hasText(item.currency)) {
    amount.appendChild(el('span', 'price-currency', item.currency));
  }

  if (hasText(item.oldPrice)) {
    line.appendChild(el('span', 'price-old', formatPriceText(item.oldPrice, item.currency)));
  }

  // Préfixe "dès" : prix mini, affiché en tout petit avant le montant
  if (numeric && hasText(item.pricePrefix)) {
    line.appendChild(el('span', 'price-prefix', String(item.pricePrefix).trim()));
  }

  line.appendChild(amount);

  if (numeric && hasText(item.unit)) {
    line.appendChild(el('span', 'price-unit', item.unit));
  }

  return line;
}

function buildBadge(text) {
  return el('span', 'price-badge', text);
}

function buildFeatures(features) {
  const list = el('ul', 'price-features');
  features.forEach((feature) => {
    if (!hasText(feature)) return;
    const li = el('li');
    const check = el('span', 'price-check', '✓');
    check.setAttribute('aria-hidden', 'true');
    li.appendChild(check);
    li.appendChild(document.createTextNode(String(feature)));
    list.appendChild(li);
  });
  return list.children.length > 0 ? list : null;
}

function buildCta(cta, extraClass) {
  if (!cta || typeof cta !== 'object' || !hasText(cta.href)) return null;
  const link = el('a', hasText(extraClass) ? 'btn ' + extraClass : 'btn', hasText(cta.label) ? cta.label : 'Réserver');
  link.href = String(cta.href);
  return link;
}

// ── Boutons d'action (hero, CTA) ──
function buildActions(actions) {
  if (!Array.isArray(actions)) return null;

  const wrap = el('div', 'prices-actions');
  actions.forEach((action) => {
    if (!action || typeof action !== 'object' || !hasText(action.href)) return;
    const link = el('a', action.style === 'ghost' ? 'btn btn-ghost' : 'btn',
      hasText(action.label) ? action.label : 'Voir plus');
    link.href = String(action.href);
    wrap.appendChild(link);
  });

  return wrap.children.length > 0 ? wrap : null;
}

// ── Photo du forfait (clic -> agrandie) ──
function buildCardMedia(item) {
  if (!hasText(item.image)) return null;

  const src = String(item.image).trim();
  const link = el('a', 'price-card-media');
  link.href = src;
  link.setAttribute('aria-label', 'Agrandir la photo : ' + (hasText(item.name) ? String(item.name) : 'forfait'));

  const img = el('img');
  img.src = src;
  img.alt = hasText(item.imageAlt) ? String(item.imageAlt)
    : (hasText(item.name) ? String(item.name) : '');
  img.loading = 'lazy';
  link.appendChild(img);

  return link;
}

function ensureLightbox() {
  if (document.getElementById(LIGHTBOX_ID)) return;

  const box = el('div', 'prices-lightbox');
  box.id = LIGHTBOX_ID;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo en grand');
  box.setAttribute('hidden', '');

  const img = el('img');
  img.alt = '';

  const close = el('button', 'prices-lightbox-close', '✕');
  close.type = 'button';
  close.setAttribute('aria-label', 'Fermer la photo');

  box.appendChild(img);
  box.appendChild(close);
  document.body.appendChild(box);

  const shut = () => box.setAttribute('hidden', '');
  box.addEventListener('click', (event) => {
    if (event.target === box || event.target === close) shut();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') shut();
  });
}

function bindCardMedia(scope) {
  const links = scope.querySelectorAll('.price-card-media');
  if (links.length === 0) return;

  ensureLightbox();
  const box = document.getElementById(LIGHTBOX_ID);
  const boxImg = box.querySelector('img');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const thumb = link.querySelector('img');
      boxImg.src = link.getAttribute('href');
      boxImg.alt = thumb ? thumb.alt : '';
      box.removeAttribute('hidden');
      box.querySelector('.prices-lightbox-close').focus();
    });
  });
}

// ── Carte (grille) ──
function renderCard(item) {
  const card = el('article', 'price-card');
  if (item.featured === true) card.classList.add('is-featured');

  const media = buildCardMedia(item);
  if (media) card.appendChild(media);

  const head = el('div', 'price-card-head');
  if (hasText(item.name)) head.appendChild(el('h4', 'price-name', item.name));
  // Badge sous le titre (et non au-dessus)
  if (hasText(item.badge)) head.appendChild(buildBadge(item.badge));
  if (hasText(item.duration)) head.appendChild(el('p', 'price-duration', item.duration));
  card.appendChild(head);

  card.appendChild(buildPriceLine(item));

  if (hasText(item.priceNote)) {
    card.appendChild(el('p', 'price-note', String(item.priceNote)));
  }

  if (hasText(item.description)) {
    card.appendChild(el('p', 'price-description', item.description));
  }

  if (Array.isArray(item.features)) {
    const features = buildFeatures(item.features);
    if (features) card.appendChild(features);
  }

  const cta = buildCta(item.cta, 'price-card-cta');
  if (cta) card.appendChild(cta);

  return card;
}

// ── Ligne (liste) ──
function renderRow(item) {
  const row = el('li', 'price-row');
  if (item.featured === true) row.classList.add('is-featured');

  const info = el('div', 'price-row-info');
  const title = el('div', 'price-row-title');

  if (hasText(item.name)) title.appendChild(el('h4', 'price-name', item.name));
  if (hasText(item.badge)) title.appendChild(buildBadge(item.badge));
  info.appendChild(title);

  if (hasText(item.duration)) info.appendChild(el('p', 'price-duration', item.duration));
  if (hasText(item.description)) info.appendChild(el('p', 'price-description', item.description));

  if (Array.isArray(item.features)) {
    const features = buildFeatures(item.features);
    if (features) info.appendChild(features);
  }

  const cta = buildCta(item.cta, 'price-row-cta');
  if (cta) info.appendChild(cta);

  row.appendChild(info);
  const priceBox = row.appendChild(el('div', 'price-row-price', null));
  priceBox.appendChild(buildPriceLine(item));
  if (hasText(item.priceNote)) {
    priceBox.appendChild(el('p', 'price-note', String(item.priceNote)));
  }

  return row;
}

function renderCategory(category, index) {
  const items = Array.isArray(category.items)
    ? category.items.filter((item) => item && typeof item === 'object')
    : [];

  const section = el('section', 'prices-category');
  const id = hasText(category.id)
    ? String(category.id).trim()
    : 'categorie-' + (index + 1);
  section.id = id;

  if (items.length === 0) return { section: null, id: id, title: category.title };

  const head = el('div', 'prices-category-head');
  head.appendChild(el('h3', null, hasText(category.title) ? category.title : 'Tarifs'));
  if (hasText(category.subtitle)) {
    head.appendChild(el('p', 'prices-category-sub', category.subtitle));
  }
  section.appendChild(head);

  if (category.layout === 'list') {
    const list = el('ul', 'price-list');
    items.forEach((item) => list.appendChild(renderRow(item)));
    section.appendChild(list);
  } else {
    const grid = el('div', 'price-grid price-grid--' + Math.min(items.length, 4));
    items.forEach((item) => grid.appendChild(renderCard(item)));
    section.appendChild(grid);
  }

  return { section: section, id: id, title: hasText(category.title) ? category.title : id };
}

function renderPills(categories) {
  if (!pricesPills || categories.length < 2) return;

  categories.forEach((entry) => {
    const link = el('a', 'prices-pill', entry.title);
    link.href = '#' + entry.id;
    pricesPills.appendChild(link);
  });

  pricesPills.hidden = false;

  if (!('IntersectionObserver' in window)) return;

  const pills = Array.from(pricesPills.querySelectorAll('a.prices-pill'));
  const sections = categories
    .map((entry) => document.getElementById(entry.id))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      pills.forEach((pill) => {
        pill.classList.toggle('is-active', pill.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

// ── Tableau comparatif : ✓ / ✗ / valeur texte par forfait ──
function buildComparisonCell(value, planName) {
  const td = document.createElement('td');
  // Nom du forfait affiché en étiquette quand le tableau passe en pile (mobile)
  if (hasText(planName)) td.setAttribute('data-plan', String(planName));

  if (value === true) {
    td.className = 'cmp-yes';
    const mark = el('span', 'cmp-mark', '✓');
    mark.setAttribute('aria-label', 'Inclus');
    td.appendChild(mark);
  } else if (value === false) {
    td.className = 'cmp-no';
    const mark = el('span', 'cmp-mark', '✗');
    mark.setAttribute('aria-label', 'Non inclus');
    td.appendChild(mark);
  } else if (hasText(value)) {
    td.className = 'cmp-text';
    const text = String(value).trim();

    // "En option" affiché en badge plutôt qu'en texte brut
    if (/^en option$/i.test(text)) {
      const chip = el('span', 'cmp-chip cmp-chip--option', 'En option');
      chip.setAttribute('aria-label', 'En option');
      td.appendChild(chip);
    } else {
      td.textContent = text;
    }
  } else {
    td.className = 'cmp-empty';
  }

  return td;
}

function renderComparison(comparison, items) {
  if (!comparison || typeof comparison !== 'object') return null;

  const rows = (Array.isArray(comparison.rows) ? comparison.rows : [])
    .filter((row) => row && typeof row === 'object' && hasText(row.label));

  if (rows.length === 0 || items.length === 0) return null;

  const section = el('section', 'prices-comparison');
  if (hasText(comparison.title)) section.appendChild(el('h3', null, comparison.title));
  if (hasText(comparison.text)) section.appendChild(el('p', 'prices-comparison-text', comparison.text));

  const scroller = el('div', 'cmp-scroll');
  scroller.setAttribute('tabindex', '0');
  scroller.setAttribute('role', 'region');
  scroller.setAttribute('aria-label', 'Tableau comparatif des forfaits');

  const table = el('table', 'cmp-table');

  const thead = el('thead');
  const headRow = el('tr');
  headRow.appendChild(el('th', 'cmp-feature-col', 'Ce qui est compris'));

  items.forEach((item, index) => {
    const th = document.createElement('th');
    if (item.featured === true) th.classList.add('is-featured');
    th.appendChild(el('span', 'cmp-plan-name',
      hasText(item.name) ? item.name : 'Forfait ' + (index + 1)));
    if (hasText(item.price) && isNumericPrice(item.price)) {
      th.appendChild(el('span', 'cmp-plan-price', formatPriceText(item.price, item.currency)));
    }
    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = el('tbody');
  rows.forEach((row) => {
    const tr = el('tr');
    tr.appendChild(el('td', 'cmp-feature-label', row.label));

    items.forEach((item, index) => {
      tr.appendChild(buildComparisonCell(
        Array.isArray(row.values) ? row.values[index] : undefined,
        hasText(item.name) ? item.name : 'Forfait ' + (index + 1)
      ));
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  scroller.appendChild(table);
  section.appendChild(scroller);

  // Note discrète sous le tableau (ex. politique de déplacement kilométrique)
  if (hasText(comparison.footnote)) {
    section.appendChild(el('p', 'cmp-footnote', String(comparison.footnote)));
  }

  return section;
}

function renderNotes(notes) {
  const section = el('section', 'prices-notes');
  section.appendChild(el('h3', null, 'Bon à savoir'));

  const list = el('ul', 'prices-notes-list');
  notes.forEach((note) => {
    const li = el('li');
    if (typeof note === 'string') {
      if (!hasText(note)) return;
      li.textContent = note;
    } else if (note && typeof note === 'object') {
      if (hasText(note.title)) li.appendChild(el('strong', null, note.title + ' — '));
      if (hasText(note.text)) li.appendChild(document.createTextNode(String(note.text)));
      if (!li.textContent.trim()) return;
    } else {
      return;
    }
    list.appendChild(li);
  });

  if (list.children.length === 0) return null;
  section.appendChild(list);
  return section;
}

function renderFaq(faq) {
  const section = el('section', 'prices-faq');
  section.appendChild(el('h3', null, 'Questions fréquentes'));

  faq.forEach((entry) => {
    if (!entry || typeof entry !== 'object') return;
    if (!hasText(entry.question)) return;

    const details = el('details', 'price-faq-item');
    details.appendChild(el('summary', null, entry.question));
    if (hasText(entry.answer)) details.appendChild(el('p', null, entry.answer));
    section.appendChild(details);
  });

  return section.children.length > 1 ? section : null;
}

function renderCta(cta) {
  if (!cta || typeof cta !== 'object') return null;

  const section = el('section', 'prices-cta');
  if (hasText(cta.title)) section.appendChild(el('h3', null, cta.title));
  if (hasText(cta.text)) section.appendChild(el('p', null, cta.text));

  const button = buildCta(cta.button, 'prices-cta-btn');
  const actions = buildActions(cta.actions);

  // Bouton principal et actions secondaires partagent la même rangée centrée
  if (button && actions) {
    actions.insertBefore(button, actions.firstChild);
    section.appendChild(actions);
  } else if (button) {
    section.appendChild(button);
  } else if (actions) {
    section.appendChild(actions);
  }

  return section.children.length > 0 ? section : null;
}

function renderHero(page) {
  if (!page || typeof page !== 'object') return;

  if (hasText(page.title) && pricesTitle) pricesTitle.textContent = String(page.title);
  if (hasText(page.subtitle) && pricesSubtitle) pricesSubtitle.textContent = String(page.subtitle);
  if (hasText(page.updated) && pricesUpdated) {
    pricesUpdated.textContent = 'Tarifs mis à jour le ' + page.updated;
  }

  const heroActions = document.getElementById('prices-hero-actions');
  if (heroActions) {
    heroActions.innerHTML = '';
    const actions = buildActions(page.actions);
    if (actions) heroActions.appendChild(actions);
    if (hasText(page.actionNote)) {
      heroActions.appendChild(el('p', 'prices-action-note', page.actionNote));
    }
  }
}

function renderPrices(data) {
  renderHero(data.page);

  const categories = (Array.isArray(data.categories) ? data.categories : [])
    .filter((category) => category && typeof category === 'object');

  pricesRoot.innerHTML = '';

  if (categories.length === 0) {
    pricesRoot.appendChild(el('p', 'prices-empty', 'Les tarifs seront bientôt disponibles.'));
    return;
  }

  const rendered = [];
  categories.forEach((category, index) => {
    const result = renderCategory(category, index);
    if (result.section) rendered.push(result);
  });

  renderPills(rendered);

  rendered.forEach((entry) => pricesRoot.appendChild(entry.section));

  // « Tarifs mis à jour le … » : affiché sous les cartes de prix, plus dans le hero
  if (pricesUpdated && hasText(pricesUpdated.textContent)) {
    const updatedWrap = el('div', 'prices-updated-wrap');
    updatedWrap.appendChild(pricesUpdated);
    pricesRoot.appendChild(updatedWrap);
  }

  // Ordre : prix -> tableau comparatif -> questions -> modalités -> action
  const comparison = renderComparison(data.comparison, collectItems(data));
  if (comparison) pricesRoot.appendChild(comparison);

  if (Array.isArray(data.faq)) {
    const faq = renderFaq(data.faq);
    if (faq) pricesRoot.appendChild(faq);
  }

  if (Array.isArray(data.notes)) {
    const notes = renderNotes(data.notes);
    if (notes) pricesRoot.appendChild(notes);
  }

  const cta = renderCta(data.cta);
  if (cta) pricesRoot.appendChild(cta);

  bindCardMedia(pricesRoot);
}

// ── Teaser des tarifs sur la page d'accueil ──
function renderHomePricing(data) {
  homePricingRoot.innerHTML = '';

  const items = collectItems(data);

  if (items.length === 0) {
    homePricingRoot.appendChild(el('p', 'prices-empty', 'Les tarifs seront bientôt disponibles.'));
    return;
  }

  items.forEach((item) => {
    const card = el('a', 'home-price-card');
    card.href = PRICES_PAGE_URL;

    if (hasText(item.image)) {
      const img = el('img');
      img.src = String(item.image).trim();
      img.alt = hasText(item.imageAlt) ? String(item.imageAlt)
        : (hasText(item.name) ? String(item.name) : '');
      img.loading = 'lazy';
      card.appendChild(img);
    }

    const body = el('div', 'home-price-card-body');
    if (hasText(item.name)) body.appendChild(el('h4', 'home-price-name', item.name));
    body.appendChild(buildPriceLine(item));
    if (hasText(item.description)) {
      body.appendChild(el('p', 'home-price-desc', item.description));
    }
    card.appendChild(body);

    homePricingRoot.appendChild(card);
  });
}

if (pricesRoot || homePricingRoot) {
  fetch(PRICES_DATA_URL)
    .then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then((data) => {
      if (pricesRoot) renderPrices(data);
      if (homePricingRoot) renderHomePricing(data);
    })
    .catch((error) => {
      console.error('Erreur lors du chargement des tarifs :', error);

      [pricesRoot, homePricingRoot].filter(Boolean).forEach((target) => {
        target.innerHTML = '';
        const box = el('div', 'prices-error');
        box.appendChild(el('p', null, 'Impossible de charger les tarifs pour le moment.'));
        box.appendChild(
          el('p', null, 'Veuillez réessayer dans un instant ou écrivez-moi à dj.dams08@gmail.com pour recevoir les prix.')
        );
        target.appendChild(box);
      });
    });
}
