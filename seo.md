# SEO — Guide de référencement du site DJ Dam's

Ce fichier récapitule **ce qui est déjà fait dans le code** et **les étapes à faire de votre côté**
(plateformes externes) pour que le site apparaisse dans Google.

---

## 1. Ce qui est déjà en place dans le code

| Élément | Où | Rôle |
|---|---|---|
| `<title>` + meta description uniques | toutes les pages indexées | ce que Google affiche dans les résultats |
| Balises Open Graph + Twitter Card | index, tarifs, contact | aperçu propre quand on partage le lien (Facebook, WhatsApp, X…) |
| Balise `canonical` | toutes les pages | indique l'URL officielle, évite le contenu dupliqué |
| Données structurées `EntertainmentBusiness` | index.html | fiche entreprise (nom, prix, réseaux sociaux) lisible par Google |
| Données structurées `FAQPage` | pages/tarifs.html | peut faire apparaître les questions/réponses en résultat enrichi |
| `sitemap.xml` | racine, URLs propres sans `.html` | liste des pages à indexer |
| `robots.txt` | racine | autorise Google, déclare le sitemap |
| `cleanUrls` (Vercel) | vercel.json | URLs propres : `/pages/tarifs` au lieu de `/pages/tarifs.html` |
| `noindex` | merci.html, 404.html, pages avis | empêche Google d'indexer les pages sans intérêt |
| `lang="fr"` | toutes les pages | langue du site |
| AdSense + ads.txt | en-tête des pages | monétisation vérifiée par Google |

---

## 2. Étapes à faire de votre côté (les plus importantes)

### Étape 1 — Google Search Console (obligatoire)
C'est **LA** étape qui fait référencer un site. Gratuit.

1. Allez sur <https://search.google.com/search-console>
2. Ajoutez une propriété : `https://dj-dams.vercel.app`
3. Vérification la plus simple : méthode « Fichier HTML » — Google vous donne un fichier
   `googleXXXX.html` à déposer à la racine du projet, puis **redéployez**.
   (Alternative plus propre : ajouter un enregistrement TXT dans le DNS du nom de domaine.)
4. Une fois vérifié : **Indexation → Sitemaps** → envoyez `https://dj-dams.vercel.app/sitemap.xml`
5. Dans **Indexation → Pages**, demandez l'indexation manuelle des 4 pages principales
   (accueil, tarifs, contact, legal) via « Inspection d'URL » → « Demander une indexation ».
   Le premier indexage peut prendre de quelques heures à quelques jours.

### Étape 2 — Bing Webmaster Tools (5 minutes)
Bing alimente aussi DuckDuckGo et ChatGPT.

1. Allez sur <https://www.bing.com/webmasters>
2. Connectez-vous avec un compte Microsoft
3. Vous pouvez **importer directement depuis Google Search Console** (un clic)
4. Soumettez le sitemap : `https://dj-dams.vercel.app/sitemap.xml`

### Étape 3 — Fiche établissement Google (très important pour un DJ local)
C'est ce qui fait apparaître votre nom sur **Google Maps** et dans les recherches
« DJ + [votre ville] ».

1. Allez sur <https://business.google.com>
2. Créez la fiche : nom « DJ Dam's », catégorie « DJ » ou « Prestataire de divertissement »
3. Zone desservie : ajoutez vos **villes/cantons** où vous vous déplacez (ex. Lausanne, Genève…)
4. Lien vers le site : `https://dj-dams.vercel.app`
5. **Vérification de la fiche** : Google envoie un code par courrier postal ou par téléphone
6. Ajoutez quelques photos (soirées, matériel, logo) — les fiches avec photos ont plus de clics
7. Demandez des avis à vos clients passés : chaque avis renforce le référencement local.
   Vous avez déjà les pages `avis/bal` et `avis/presta` pour ça.

### Étape 4 — Annuaires et répertoires (liens entrants)
Google positionne mieux les sites que d'autres sites citent. Inscrivez-vous sur :

- PagesJaunes / local.ch / search.ch (fiche pro suisse)
- Annuaire des DJ de votre région (associations, plateformes comme DJbooking, Eventplanner)
- Fête de l'emploi / annuaires locaux de votre canton
- Groupes Facebook locaux « animation mariage/soirée [région] » (avec lien vers le site)

Règle d'or : **mieux vaut 5 annuaires sérieux que 50 liens spam**.

### Étape 5 — Réseaux sociaux (liens déjà sur le site)
Le site lie déjà Instagram et YouTube. Ajoutez vous-même le lien du site dans vos bios :

- Instagram `@dj_dams08` → bio : `https://dj-dams.vercel.app`
- YouTube `@Dj-Dam-s` → bio / À propos : le lien du site
- TikTok si vous en avez un

### Étape 6 — Google Business → « Enregistrer l'activité »
Si vous avez un compte Google Ads ou Analytics, reliez-le à la Search Console pour
suivre les impressions et clics dans les résultats.

---

## 3. À surveiller régulièrement

- **Search Console → Performance** : quelles requêtes amènent des visites, quelles pages
- **Core Web Vitals** (dans Search Console) : le site est statique sur Vercel, normalement vert
- Après chaque gros changement de tarifs : resoumettre la page tarifs dans
  l'inspection d'URL pour un réindexage rapide

---

## 4. Petits gestes qui aident (sans coût)

1. **Partagez le lien** sur vos réseaux après chaque soirée (les clics et partages comptent)
2. **Écrivez des avis croisés** : si un client laisse un avis sur votre fiche Google,
   demandez-lui aussi de citer « DJ Dam's » (le nom de marque dans les avis aide)
3. Ajoutez un lien vers `dj-dams.vercel.app` dans vos **emails** (signature) et vos devis PDF
4. Gardez le site **actif** : une page tarifs mise à jour régulièrement (date « Tarifs mis à jour le… ») est un bon signal
5. Ne dupliquez pas de textes d'autres DJ : Google pénalise le contenu copié

---

## 5. Ce qu'il ne faut PAS faire

- ❌ Acheter des liens ou des avis payants ( sanction de Google )
- ❌ Se soumettre à des « annuaires SEO » automatiques de mauvaise qualité
- ❌ Bourrer les mots-clés dans les textes (la lecture naturelle passe mieux)
- ❌ Créer des dizaines de pages vides « ville + DJ » : mieux vaut une page services solide

---

*Dernière mise à jour de ce guide : 16 octobre 2026.*
