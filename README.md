# EPS Mission Everest

Application web statique (HTML + JS sans framework, Tailwind compilé, Firebase Auth/Firestore), hébergée sur Vercel.

## Structure
- `public/` : seul dossier publié (`index.html`, `app.js`, pages légales, `robots.txt`). `public/assets/` et `public/vendor/` sont générés par le build.
- `src/input.css`, `tailwind.config.js` : sources du CSS.
- `scripts/build.mjs` : compile le CSS et copie le SDK Firebase (auto-hébergé).
- `firestore.rules` : règles de sécurité, déployées par GitHub Actions.
- `SECURITE.md` : checklist sécurité et journal d'audit.
- `docs-firebase.md` : guide de configuration Firebase.

## Développement
```bash
npm ci
npm run build      # génère public/assets/app.css et public/vendor/
npm run lint       # ESLint (règles sécurité)
python3 -m http.server 8000 -d public   # puis http://localhost:8000/?demo=1
```

## Déploiement sur Vercel
1. Importer le dépôt sur <https://vercel.com/new>, preset **Other**. Les commandes (`npm ci`, `npm run build`, dossier `public`) et les en-têtes de sécurité sont lus depuis `vercel.json`.
2. Ajouter le domaine Vercel dans Firebase › Authentication › Paramètres › **Domaines autorisés**.
3. Suivre les actions « console » listées dans `SECURITE.md`.

Modes de test : `?demo=1` (données locales) et `?test=1` (simulation en mémoire).
