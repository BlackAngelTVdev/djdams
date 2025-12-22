let allGalleryItems = [];
let currentIndex = 0;
const batchSize = 10;
let currentFilter = 'all';

const loadMoreBtn = document.getElementById('load-more-btn');
const galleryContainer = document.getElementById('gallery-container');
const filterSelect = document.getElementById('filter-select');

// Création lightbox (tu peux garder ton code lightbox ici)

const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
document.body.appendChild(lightbox);
lightbox.style.position = 'fixed';
lightbox.style.top = 0;
lightbox.style.left = 0;
lightbox.style.width = '100%';
lightbox.style.height = '100%';
lightbox.style.background = 'rgba(0,0,0,0.8)';
lightbox.style.display = 'none';
lightbox.style.justifyContent = 'center';
lightbox.style.alignItems = 'center';
lightbox.style.zIndex = 9999;

const lightboxImg = document.createElement('img');
lightboxImg.style.maxWidth = '90%';
lightboxImg.style.maxHeight = '90%';
lightboxImg.style.borderRadius = '8px';
lightbox.appendChild(lightboxImg);

lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

window.addEventListener('scroll', () => {
  if (lightbox.style.display === 'flex') {
    lightbox.style.display = 'none';
  }
});

function createElement(type, src, alt) {
  if (type === 'img') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.style.cursor = 'pointer';

    img.addEventListener('click', () => {
      lightboxImg.src = src;
      lightbox.style.display = 'flex';
    });

    return img;
  } else if (type === 'iframe') {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = src;
    return wrapper;
  }
  return null;
}

function filterItems() {
  if (currentFilter === 'all') {
    return allGalleryItems;
  } else {
    return allGalleryItems.filter(item => item.type === currentFilter);
  }
}

function displayNextBatch() {
  const filteredItems = filterItems();

  const end = currentIndex + batchSize;
  const batch = filteredItems.slice(currentIndex, end);

  batch.forEach(({ type, src, alt }) => {
    const el = createElement(type, src, alt);
    if (el) galleryContainer.appendChild(el);
  });

  currentIndex = end;

  if (currentIndex >= filteredItems.length) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.innerText = "Aucun média supplémentaire";
  } else {
    loadMoreBtn.disabled = false;
    loadMoreBtn.innerText = "Afficher plus";
  }
}

function applyFilter(filter) {
  currentFilter = filter;
  currentIndex = 0;
  galleryContainer.innerHTML = '';
  displayNextBatch();
}

filterSelect.addEventListener('change', (e) => {
  applyFilter(e.target.value);
});

fetch('./media/data/gallery.csv')
  .then(res => res.text())
  .then(text => {
    allGalleryItems = text.trim().split('\n').slice(1).map(row => {
      const [type, ...rest] = row.split(',');
      const src = rest.join(',');
      return { type, src, alt: '' };
    });

    applyFilter('all');

    loadMoreBtn.addEventListener('click', displayNextBatch);
  })
  .catch(err => {
    console.error('Erreur lors du chargement de la galerie :', err);
    loadMoreBtn.style.display = 'none';
  });
