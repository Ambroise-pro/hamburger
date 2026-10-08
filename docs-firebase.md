# EPS Mission Everest : mise en ligne avec Firebase

L'application `calculateur-eps-everest.html` fonctionne de deux façons :

| Mode | Quand | Données |
|---|---|---|
| **Démonstration locale** | `FIREBASE_CONFIG = null`, ou `?demo=1` dans l'adresse | Restent sur l'appareil, non partagées. Un bandeau jaune l'indique. |
| **Défi réel (Firebase)** | `FIREBASE_CONFIG` renseigné | Partagées entre tous les établissements, cumul visible par tous. |

## Ce que fait l'application

- **Deux écrans** : « Cumul collectif » (paliers jusqu'à l'Everest) et « Mon établissement » (objectifs de l'établissement : élève de CM1 1,40 m, professeur 1,75 m, arbre 8 m, école 12 m, château d'eau 40 m). Le second s'ouvre automatiquement après confirmation de l'adresse e-mail.
- **Page d'accueil publique** : tour collective, paliers, classement des établissements. Aucune connexion nécessaire.
- **Inscription d'un établissement** : nom, ville, pays, **adresse e-mail** et **mot de passe** (8 caractères minimum, choisi par l'enseignant). L'e-mail reste dans Firebase Authentication : il n'est jamais copié dans la base publique ni affiché.
- **E-mail de confirmation** : envoyé à l'inscription. Tant que l'adresse n'est pas confirmée, la saisie des séances est bloquée (dans l'application **et** par les règles Firestore). La page détecte la confirmation automatiquement, ou via le bouton « J'ai confirmé mon adresse ».
- **Mot de passe oublié** : le lien « Mot de passe oublié ? » envoie un e-mail de réinitialisation.
- **Espace établissement** (après connexion) : saisie des séances, journal, export JSON, statistiques de l'établissement.
- **Aucune donnée d'élève** : seuls des totaux par séance (nombre d'élèves, durée, calories) sont enregistrés.

## Mise en place (environ 15 minutes)

### 1. Créer le projet Firebase
1. Allez sur <https://console.firebase.google.com> et créez un projet (le forfait gratuit « Spark » suffit pour démarrer).
2. *Paramètres du projet > Vos applications > Web (`</>`)* : enregistrez une application web.
3. Copiez l'objet de configuration (`apiKey`, `authDomain`, `projectId`, `appId`…).

### 2. Brancher la configuration
Dans `calculateur-eps-everest.html`, remplacez `const FIREBASE_CONFIG = null;` par :

```js
const FIREBASE_CONFIG = {
  apiKey: "…",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  appId: "…"
};
```
(Ces valeurs ne sont pas secrètes ; la sécurité repose sur les règles de l'étape 4.)

### 3. Activer l'authentification
*Authentication > Sign-in method > E-mail/Mot de passe* : activer (laisser « Lien par e-mail » désactivé).
Optionnel : *Authentication > Modèles > Réinitialisation du mot de passe* : choisir la langue **Français** et personnaliser le message.

### 4. Créer la base et publier les règles
1. *Firestore Database > Créer une base* (mode production, région européenne conseillée, par ex. `eur3`).
2. Onglet *Règles* : collez le contenu de `firestore.rules`, puis **Publier**.

### 5. Héberger la page (obligatoire)
Firebase Authentication **ne fonctionne pas depuis un fichier ouvert en `file://`**. La page doit être servie en `http(s)` :
- **Test local** : dans ce dossier, `python3 -m http.server 8000`, puis <http://localhost:8000/calculateur-eps-everest.html>.
- **En ligne** : *Hosting* de Firebase (`npm i -g firebase-tools`, `firebase init hosting`, `firebase deploy`) ou n'importe quel hébergeur statique. Ajoutez ensuite le domaine dans *Authentication > Paramètres > Domaines autorisés*.

## Points d'attention

- **Adresses e-mail = données personnelles** (RGPD). Elles sont stockées uniquement par Firebase Authentication, visibles seulement dans votre console. Prévenez les enseignants dans votre message de lancement et supprimez les comptes en fin de défi (*Authentication > Utilisateurs*).
- **Modèle d'e-mail.** *Authentication > Modèles > Validation de l'adresse e-mail* : choisissez le français et personnalisez le message. L'expéditeur par défaut est `noreply@hamburger-6d3aa.firebaseapp.com` ; les messages peuvent arriver dans les courriers indésirables, prévenez les enseignants.
- **Inscription ouverte.** N'importe qui connaissant l'adresse peut créer un établissement. Les règles bornent chaque séance et chaque écriture, mais pas la sincérité des données. Pour durcir : code d'invitation, activation de **Firebase App Check**, ou modération du classement.
- **Quotas.** La page d'accueil lit la liste des établissements en temps réel (≈ 300 lectures par visiteur, plus les mises à jour). Avec 300 établissements actifs chaque jour, comptez de l'ordre de 100 000 à 200 000 lectures par jour : au-dessus du quota gratuit (50 000), soit quelques centimes par jour avec le forfait « Blaze ». Une alternative sans surcoût est d'ajouter un document de cumul mis à jour par une Cloud Function.
- **Sincérité des totaux.** Le cumul est calculé côté navigateur de chaque enseignant. Les règles empêchent les écarts importants (une séance par écriture, valeurs bornées), mais un enseignant déterminé pourrait tricher. C'est un jeu pédagogique, pas un registre officiel.
- **Mode démonstration** : ajoutez `?demo=1` à l'adresse pour tester l'interface sans rien écrire dans Firebase (données locales à l'appareil).
- **Mode test** : ajoutez `?test=1` à l'adresse. Les simulations restent en mémoire, ne sont jamais enregistrées et disparaissent au rechargement.
- Ce code n'a pas pu être testé contre un vrai projet Firebase (création de compte réservée au propriétaire). La logique a été vérifiée en mode démonstration locale ; testez l'inscription, la saisie et la connexion sur votre projet avant le lancement.
