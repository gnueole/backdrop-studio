# 🎥 Guide d'Utilisation du Fond d'Écran Virtuel (Backdrop)

Ce document explique comment utiliser et configurer la page de fond d'écran dynamique (Backdrop) conçue pour vos appels visio (Zoom, Teams) ou vos enregistrements/streams via des outils comme **OBS Studio**.

Le système comprend deux pages complémentaires :
* **La page de rendu final** : `http://localhost:3020/backdrop/` (ou en production `https://eole.me/backdrop/`)
* **Le configurateur visuel interactif** : `http://localhost:3020/backdrop/config.html` (ou en production `https://eole.me/backdrop/config.html`)

Le configurateur vous permet d'ajuster les couleurs, les textes et les alignements en temps réel avec un aperçu dynamique en direct, de récupérer automatiquement les chartes graphiques de **eole.me** ou **avarre.com** par défaut, de copier l'URL générée en un clic ou d'**exporter une capture PNG haute définition (2x)** de votre création !

---

## ⚙️ 1. Paramètres de Configuration (Query Parameters)

Vous pouvez personnaliser intégralement le texte, le thème, la position, la taille et les couleurs en ajoutant des paramètres à la fin de l'URL (ex: `?theme=dark&mode=artist`).

| Paramètre | Valeurs possibles | Description / Rôle |
| :--- | :--- | :--- |
| **`theme`** | `dark` (défaut) \| `light` | Alterne entre le mode sombre profond et le mode clair épuré du site. |
| **`mode`** | `business` (défaut) \| `artist` | Ajuste automatiquement le nom et le titre par défaut pour correspondre à votre persona. |
| **`lang`** | `fr` (défaut) \| `en` | Traduit le titre par défaut en français ou anglais. |
| **`title`** | `on` \| `off` \| *Texte personnalisé* | **off** masque le titre. Tout autre texte remplace le titre par défaut (encodage URL requis pour les espaces, ex: `%20`). |
| **`name`** | `on` \| `off` \| *Texte personnalisé* | **off** masque le nom. Tout autre texte remplace le nom par défaut. |
| **`position`**| `bottom` (défaut) \| `top` | Aligne l'encart de texte en haut ou en bas de l'écran. |
| **`align`** | `right` (défaut) \| `left` | Aligne l'encart de texte à gauche ou à droite. |
| **`size`** | `small` \| `medium` (défaut) \| `big` | Ajuste l'échelle typographique de l'encart de texte. |
| **`accent`** | Code couleur hex (ex: `%23ff3333`) | Force une couleur d'accentuation personnalisée pour le titre et la barre inférieure. |
| **`glow`** | Code couleur rgba (ex: `rgba(0,100,255,0.15)`) | Force une couleur personnalisée pour les halos lumineux de fond. |

---

## 💡 2. Exemples d'URLs Prêtes à l'Emploi

Copiez-collez ces exemples directement dans votre navigateur ou dans OBS :

### 🎨 Mode Artiste (Éole)
* **Éole — Standard (Français, Bas-Droite)**
  `https://eole.me/backdrop/?mode=artist&lang=fr`
* **Éole — Minimaliste (Anglais, sans Titre, Petit, Haut-Gauche)**
  `https://eole.me/backdrop/?mode=artist&lang=en&title=off&size=small&position=top&align=left`
* **Éole — Ambiance Neon Rouge/Rose (Personnalisé)**
  `https://eole.me/backdrop/?mode=artist&accent=%23ff0077&glow=rgba(255,0,119,0.18)&size=big`

### 💻 Mode Business (Julien Avarre)
* **Julien Avarre — Standard (Français, Bas-Droite)**
  `https://eole.me/backdrop/?mode=business&lang=fr`
* **Julien Avarre — Pro Anglais (Grand Texte, Bas-Gauche)**
  `https://eole.me/backdrop/?mode=business&lang=en&size=big&align=left`
* **Julien Avarre — Thème Clair Épuré (Français)**
  `https://eole.me/backdrop/?mode=business&theme=light&lang=fr`

### 🎤 Mode Réunion / Stream Spécifique
* **Titre de Réunion personnalisé (ex: "Live Coding Session")**
  `https://eole.me/backdrop/?title=Live%20Coding%20Session&align=left`

---

## 🎥 3. Intégration dans OBS Studio (Recommandé)

Pour utiliser ce fond d'écran derrière vous (avec un effet de transparence ou d'incrustation caméra) :

1. Ouvrez **OBS Studio**.
2. Dans le panneau **Sources**, cliquez sur le bouton `+` et sélectionnez **Navigateur (Browser)**.
3. Nommez la source (ex: `Backdrop Virtuel`).
4. Dans les propriétés de la source :
   * **URL** : Collez l'URL configurée (ex: `https://eole.me/backdrop/?mode=artist&lang=fr`).
   * **Largeur (Width)** : `1920` (ou la largeur de votre canevas).
   * **Hauteur (Height)** : `1080` (ou la hauteur de votre canevas).
   * Cochez **"Rafraîchir le navigateur lorsque la scène devient active"** (permet de relancer proprement les animations fluides).
5. Placez cette source **tout en bas** de votre liste de sources (derrière votre caméra).
6. Si vous utilisez un fond vert, appliquez le filtre d'effet *Incrustation couleur (Chroma Key)* sur votre caméra pour faire apparaître le backdrop en arrière-plan.

---

## 💻 4. Utilisation sur Zoom / Teams (Sans OBS)

Si vous n'utilisez pas OBS mais souhaitez utiliser ce fond d'écran directement dans Zoom ou Teams :

1. Ouvrez la page dans votre navigateur en plein écran (touche `F11`).
2. Lors de votre appel Zoom/Teams :
   * Utilisez l'option **Partager l'écran** et sélectionnez uniquement la fenêtre du navigateur en plein écran.
   * *Alternative Premium* : Vous pouvez utiliser le plugin de **Caméra Virtuelle d'OBS** pour envoyer le rendu d'OBS (votre caméra incrustée sur le backdrop) comme s'il s'agissait d'une webcam physique standard.
