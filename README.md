# 🎥 Backdrop Studio

**Backdrop Studio** est un outil web interactif et hautement performant conçu pour créer, personnaliser et exporter des fonds d'écran animés et des overlays textuels en temps réel pour vos visioconférences (Zoom, Teams, Google Meet) et vos streams (OBS Studio).

Ce projet est entièrement autonome, conteneurisé avec Docker, propulsé par Vite pour un bundling optimal, et intègre une gestion de version dynamique liée à Git.

---

## ✨ Fonctionnalités clés

*   **Rendu Canvas Haute Performance (60 FPS)** : Les halos lumineux et animations d'ambiance (`pulse`, `wave`, `shimmer`, `monochrome`, `eclipse`) sont générés en JavaScript sur un élément HTML5 `<canvas>` ultra-fluide.
*   **Export d'Image HD (2x)** : Exportez vos créations instantanément au format PNG en résolution doublée (retina) pour un affichage net sur tous les écrans.
*   **Exporter en Vidéo de Promotion (5s)** : Enregistrez une boucle vidéo de 5 secondes de votre fond d'écran animé en haute définition (avec son texte et ses effets de lueur) directement depuis le navigateur grâce à l'API `MediaRecorder` (génère un fichier `.webm` léger et ultra-fluide).
*   **Sauvegarde automatique (`localStorage`)** : Vos choix de personnalisation (textes, alignement, polices, couleurs d'accentuation, animations) sont sauvegardés localement dans le navigateur et restaurés automatiquement au rechargement de la page.
*   **Personnalisation par URL** : Toutes les options peuvent être passées directement en paramètres d'URL (idéal pour l'intégration comme source navigateur dans OBS).
*   **Analytics unifiés (GTM & GA4)** : Intègre un suivi analytique Google Tag Manager et GA4 pré-configuré via les API de télémétrie de l'écosystème.

---

## 🚀 Démarrage Rapide en Local

### Option A : Avec Node.js & Vite (Recommandé pour le développement)

1.  Placez-vous dans le dossier du projet :
    ```bash
    cd backdrop-studio
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Lancez le serveur de développement :
    ```bash
    npm run dev
    ```
4.  Ouvrez votre navigateur sur [http://localhost:5173](http://localhost:5173) pour accéder au configurateur. L'overlay en plein écran est disponible sur `http://localhost:5173/renderer.html`.

### Option B : Avec Docker

1.  Lancez le conteneur de développement :
    ```bash
    docker compose -f docker/docker-compose.yml up -d
    ```
2.  Accédez à l'application sur [http://localhost:3030](http://localhost:3030).

---

## ⚙️ Paramètres d'URL (Query Parameters)

L'overlay final (`renderer.html`) se configure dynamiquement en y ajoutant des paramètres de requête :

| Paramètre | Valeurs possibles | Description |
| :--- | :--- | :--- |
| **`theme`** | `dark` (défaut) \| `light` | Choix du thème général (sombre profond ou clair épuré). |
| **`mode`** | `business` (défaut) \| `artist` | Prérégle les polices (Outfit ou Lora) et le style de marque. |
| **`lang`** | `fr` (défaut) \| `en` | Choix de la langue pour les textes par défaut. |
| **`name`** | `on` \| `off` \| *Texte* | Masque ou personnalise le nom affiché. |
| **`title`** | `on` \| `off` \| *Texte* | Masque ou personnalise le sous-titre/titre pro. |
| **`position`**| `bottom` (défaut) \| `top` \| `middle` \| `center` | Position verticale de l'encart textuel. |
| **`align`** | `right` (défaut) \| `left` \| `center` | Alignement horizontal du texte. |
| **`size`** | `small` \| `medium` (défaut) \| `big` \| *Valeur en rem* | Taille d'échelle de la typographie. |
| **`accent`** | Code hex (ex: `%2338bdf8`) | Couleur du titre et de la barre inférieure. |
| **`glow`** | Code hex (ex: `%230f172a`) | Couleur du halo lumineux de fond principal. |
| **`texteffect`**| `none` \| `shadow-soft` \| `shadow-strong` \| `glow-neon` \| `glow-matched` | Effet d'ombrage ou de halo autour des lettres. |
| **`animation`**| `none` \| `pulse` \| `wave` \| `shimmer` \| `monochrome` \| `eclipse` | Style d'animation fluide des halos lumineux. |
| **`speed`** | `slow` \| `medium` (défaut) \| `fast` | Vitesse de l'animation en arrière-plan. |
| **`borderanim`**| `on` (défaut) \| `off` | Active ou désactive le défilement du dégradé de la barre inférieure. |
| **`bg`** | `transparent` | Rend l'arrière-plan transparent (utile pour OBS). |

---

## 🎥 Intégrations Visioconférence & Live

### 1. Incrustation dans OBS Studio (Source Navigateur)
Pour intégrer directement l'animation fluide derrière votre caméra :
1.  Dans OBS, ajoutez une source **Navigateur (Browser Source)**.
2.  Collez votre URL personnalisée (ex: `https://backdrop.eole.me/renderer.html?mode=artist&animation=pulse`).
3.  Définissez la résolution sur **1920x1080** (ou la taille de votre scène).
4.  Cochez **"Rafraîchir le navigateur lorsque la scène devient active"**.
5.  Positionnez cette source en arrière-plan (sous votre capture de caméra).
6.  *(Optionnel)* Si vous voulez uniquement le texte par-dessus une autre source, ajoutez le paramètre `&bg=transparent` à l'URL.

### 2. Utilisation dans Zoom / Teams / Meet
1.  Configurez votre fond d'écran dans le configurateur.
2.  Sélectionnez le format souhaité (16:9, Carré ou Bannière).
3.  Cliquez sur **Exporter l'Image** pour télécharger le fichier PNG haute définition.
4.  Importez ce fichier comme **Fond d'écran virtuel (Virtual Background)** directement dans les paramètres de votre application de visioconférence.

---

## 📦 Conteneurisation & Déploiement

### Déploiement Continu (CI/CD via GitHub Actions)
À chaque push sur la branche `main`, le workflow `.github/workflows/docker-publish.yml` compile automatiquement l'application avec Vite, construit l'image Docker de production et la publie sur le registre GitHub :
`ghcr.io/gnueole/backdrop-studio:latest` et `ghcr.io/gnueole/backdrop-studio:<version>` (déterminée dynamiquement via le `package.json`).

### Déploiement en Production (VPS)
Pour déployer ou mettre à jour le projet sur votre VPS :
```bash
make deploy
```
Ce script :
1.  Crée le dossier cible sur le serveur distant.
2.  Télécharge vos secrets de production depuis Doppler (`prd_eole-me-backdrop-studio`).
3.  Transmet le fichier `docker-compose.prod.yml` contenant la configuration de routage réseau Traefik sur le sous-domaine `backdrop.eole.me`.
4.  Force le VPS à pull l'image depuis GHCR et à recréer proprement le conteneur.
