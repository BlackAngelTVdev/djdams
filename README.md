# DJ Dam's — site vitrine

Site vitrine du DJ **Dam's** (Damien) : prestations, tarifs, médiathèque, avis clients et prise de contact.
**HTML / CSS / JavaScript statique** — pas de framework, pas de build, pas de dépendance : on édite les fichiers et c'est en ligne.

🌍 En ligne : <https://dj-dams.vercel.app>

---

## Les pages

| Page | Fichier | Rôle |
|---|---|---|
| Accueil | `index.html` | Héros animé, à propos, services, aperçu des tarifs, galerie, avis |
| Tarifs | `pages/tarifs.html` | Forfaits, tableau comparatif, FAQ, demande de devis |
| Contact | `pages/contact.html` | Formulaire + calendrier de disponibilités |
| Merci | `pages/merci.html` | Confirmation après envoi du formulaire (noindex) |
| Légal | `pages/legal.html` | Mentions légales et politique de confidentialité |
| Avis bal | `avis/bal/index.html` | Redirection vers le formulaire d'avis après un bal |
| Avis presta | `avis/presta/index.html` | Idem pour une prestation |

## Arborescence

```
index.html              page d'accueil
pages/                  tarifs, contact, merci, légal
avis/                   pages de collecte d'avis (bal / prestation)
media/
  css/                  acceuil.css (globale) · tarifs.css · merci.css
  js/                   prices · gallery · reviews · calendar · cookie · scroll
  data/                 prices.json · gallery.csv · reviews.csv
  img/                  logo.png, Banner.png
ads.txt  robots.txt  sitemap.xml  LICENSE
```

## Les données : tout se modifie sans toucher au code

### `media/data/prices.json` — les tarifs

C'est le seul fichier à modifier pour changer les prix, les forfaits, la FAQ…

```jsonc
"page":    { "title", "subtitle", "actions", "actionNote" },
"categories": [{
  "items": [{
    "name":  "Anniversaires & petits événements",
    "price": "250",
    "currency": "CHF",
    "unit": "la prestation",
    "pricePrefix": "dès",        // affiché en tout petit devant le montant
    "duration", "description", "image", "imageAlt",
    "cta": { "label", "href" }
  }]
}],
"comparison": {                 // tableau comparatif
  "rows": [
    { "label": "Son", "values": ["Sans caisson", "2 caissons", "3 caissons"] }
  ]
},
"notes": [...],                 // bloc « Bon à savoir »
"faq":   [ { "question", "answer" } ],
"cta":   { "title", "text", "button" }
```

**Tableau comparatif** — chaque cellule accepte trois formes :
- `true` → affiche **✓**
- `false` → affiche **✗**
- une chaîne → affichée telle quelle (`"20km"`, `"45 jours"`, `"En option"`…)

### `media/data/gallery.csv` — la médiathèque

```
type,src
img,https://i.postimg.cc/...
iframe,<iframe ...youtube/soundcloud/spotify...></iframe>
```

### `media/data/reviews.csv` — les avis affichés sur l'accueil

## Fonctionnalités

- **Tarifs dynamiques** — cartes, tableau comparatif, FAQ et notes rendus à partir du JSON (`prices.js`), sur l'accueil et la page tarifs
- **Galerie** — filtres (images / vidéos), chargement progressif, lightbox
- **Avis** — chargés depuis le CSV, bouton « afficher plus »
- **Calendrier de disponibilités** — jours passés/occupés/libres, pré-réservation via l'API agenda (`agenda.laxacube.ch`)
- **Contact** — FormSubmit envoie le formulaire à `dj.dams08@gmail.com`, puis redirige vers `merci.html`
- **Cookies** — bandeau + gestionnaire (préférences en `localStorage`)
- **Responsive** — menu burger, animations AOS, effet machine à écrire (héros)
- **Monétisation / SEO** — AdSense (pages principales), `ads.txt`, `robots.txt`, `sitemap.xml`

## Développement local

Aucune installation requise, un simple serveur statique suffit :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

> Les pages chargent les JSON/CSV en `fetch` : ouvrir `index.html` en `file://` ne fonctionne pas, il faut le serveur.

## Déploiement

Déploiement automatique sur **Vercel** à chaque push sur `main`.
Pense à vérifier que l'URL de redirection du formulaire contact (`_next`) correspond bien au domaine en production.

## Licence

Voir [`LICENSE`](./LICENSE).
