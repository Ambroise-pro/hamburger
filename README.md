# EPS Mission Everest

Application web statique (HTML + Tailwind CDN + Firebase Auth/Firestore).

## Structure
- `public/index.html` : l'application (servie par Vercel)
- `firestore.rules` : règles de sécurité à publier dans la console Firebase (Firestore > Règles)
- `docs-firebase.md` : guide de configuration Firebase
- `vercel.json` : configuration de déploiement

## Déploiement sur Vercel
1. Sur <https://vercel.com/new>, importez le dépôt GitHub `ambroise-pro/hamburger`.
2. Framework Preset : **Other**. Aucune commande de build ; le dossier de sortie (`public`) est lu depuis `vercel.json`.
3. Cliquez sur **Deploy**.
4. **Indispensable** : ajoutez le domaine Vercel (ex. `hamburger.vercel.app`) dans Firebase Console > Authentication > Paramètres > **Domaines autorisés**, sinon l'inscription et la connexion échoueront.
5. Publiez `firestore.rules` dans Firestore > Règles, et activez E-mail/Mot de passe dans Authentication.

Modes de test : `?demo=1` (données locales) et `?test=1` (simulation en mémoire).
