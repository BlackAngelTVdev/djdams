const reviewsContainer = document.getElementById('reviews-container');
const reviewsLoadMoreBtn = document.getElementById('reviews-load-more-btn');

if (reviewsContainer && reviewsLoadMoreBtn) {
  let allReviews = [];
  let currentReviewIndex = 0;
  const reviewsBatchSize = 6;

  function splitCsvLine(line) {
    const columns = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];

      if (char === '"') {
        // Double quote inside a quoted value.
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        columns.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    columns.push(current.trim());
    return columns;
  }

  function parseReviewsCsv(csvText) {
    return csvText
      .trim()
      .split('\n')
      .slice(1)
      .map((line) => {
        const [date, name, comment] = splitCsvLine(line);
        return {
          date: date || '',
          name: name || 'Anonyme',
          comment: comment || ''
        };
      })
      .filter((item) => item.comment.length > 0);
  }

  function formatDate(dateString) {
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) {
      return dateString;
    }

    return parsed.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  function createReviewCard(review) {
    const card = document.createElement('article');
    card.className = 'review-card';

    const header = document.createElement('div');
    header.className = 'review-header';

    const name = document.createElement('h4');
    name.className = 'review-name';
    name.textContent = review.name;

    const date = document.createElement('span');
    date.className = 'review-date';
    date.textContent = formatDate(review.date);

    const comment = document.createElement('p');
    comment.className = 'review-comment';
    comment.textContent = review.comment;

    header.appendChild(name);
    header.appendChild(date);
    card.appendChild(header);
    card.appendChild(comment);

    return card;
  }

  function updateReviewsButton() {
    if (currentReviewIndex >= allReviews.length) {
      reviewsLoadMoreBtn.disabled = true;
      reviewsLoadMoreBtn.textContent = "Tous les avis sont affichés";
    } else {
      reviewsLoadMoreBtn.disabled = false;
      reviewsLoadMoreBtn.textContent = "Afficher plus d'avis";
    }
  }

  function displayNextReviewsBatch() {
    const end = currentReviewIndex + reviewsBatchSize;
    const batch = allReviews.slice(currentReviewIndex, end);

    batch.forEach((review) => {
      reviewsContainer.appendChild(createReviewCard(review));
    });

    currentReviewIndex = end;
    updateReviewsButton();
  }

  fetch('./media/data/reviews.csv')
    .then((res) => res.text())
    .then((csvText) => {
      allReviews = parseReviewsCsv(csvText).reverse();

      if (allReviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="reviews-empty">Aucun avis pour le moment.</p>';
        reviewsLoadMoreBtn.style.display = 'none';
        return;
      }

      displayNextReviewsBatch();
      reviewsLoadMoreBtn.addEventListener('click', displayNextReviewsBatch);
    })
    .catch((error) => {
      console.error('Erreur lors du chargement des avis :', error);
      reviewsContainer.innerHTML = '<p class="reviews-empty">Impossible de charger les avis pour le moment.</p>';
      reviewsLoadMoreBtn.style.display = 'none';
    });
}
