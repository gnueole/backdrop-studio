# 🎥 Backdrop Studio

**Backdrop Studio** is an interactive, high-performance web tool designed to customize, preview, and export animated backgrounds and text overlays in real-time for video calls (Zoom, Teams, Google Meet) and live streaming setups (OBS Studio).

This project is fully standalone, containerized with Docker, powered by Vite for optimal bundling, and features dynamic version tracking tied directly to Git commits.

---

## ✨ Key Features

*   **High-Performance Canvas Rendering (60 FPS)**: Ambient glows and background animations (`pulse`, `wave`, `shimmer`, `monochrome`, `eclipse`) are rendered on an HTML5 `<canvas>` element using smooth, time-based JavaScript functions.
*   **HD Image Export (2x)**: Instantly export your customized backdrops as PNG files in double resolution (retina-ready) for crisp display on high-DPI screens.
*   **5-Second Promo Video Export**: Capture and export a smooth 5-second video of your animated backdrop (including active text overlays, neon glows, and the bottom border line) directly from your browser. Powered by the native `MediaRecorder` API, it outputs a lightweight, 60fps `.webm` video file.
*   **Automatic Configuration Saving (`localStorage`)**: Your customization choices (name, title, position, alignments, colors, animations, speed) are automatically serialized to the browser's local storage and restored on reload.
*   **URL-Driven Rendering**: The renderer is fully controlled via query string variables, making it exceptionally easy to use as a Browser Source in OBS.
*   **Google Tag Manager & GA4 Integration**: Pre-integrated with Google Tag Manager and GA4 analytics tracking via the workspace's telemetry configuration.

---

## 🚀 Local Development Setup

### Option A: Node.js & Vite (Recommended)

1.  Navigate to the project directory:
    ```bash
    cd backdrop-studio
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the local development server:
    ```bash
    npm run dev
    ```
4.  Open your browser to [http://localhost:5173](http://localhost:5173) to access the configurator dashboard. The clean overlay renderer is hosted at [http://localhost:5173/renderer.html](http://localhost:5173/renderer.html).

### Option B: Docker

1.  Spin up the local development container:
    ```bash
    docker compose -f docker/docker-compose.yml up -d
    ```
2.  Access the application at [http://localhost:3030](http://localhost:3030).

---

## ⚙️ URL Query Parameters

The clean overlay renderer (`renderer.html`) dynamically configures itself based on query parameters appended to the URL:

| Parameter | Possible Values | Description |
| :--- | :--- | :--- |
| **`theme`** | `dark` (default) \| `light` | Switches between deep dark mode and crisp light mode. |
| **`mode`** | `business` (default) \| `artist` | Pre-selects default fonts (Outfit/Lora) and brand styles. |
| **`lang`** | `fr` (default) \| `en` | Translates default titles to French or English. |
| **`name`** | `on` \| `off` \| *Custom Text* | Hides or overrides the display name. |
| **`title`** | `on` \| `off` \| *Custom Text* | Hides or overrides the professional title. |
| **`position`**| `bottom` (default) \| `top` \| `middle` \| `center` | Vertical positioning of the text block. |
| **`align`** | `right` (default) \| `left` \| `center` | Horizontal alignment of the text. |
| **`size`** | `small` \| `medium` (default) \| `big` \| *Value in rem* | Typographical scale of the text block. |
| **`accent`** | Hex code (e.g., `%2338bdf8`) | Forces a custom color for the title text and bottom border. |
| **`glow`** | Hex code (e.g., `%230f172a`) | Forces a custom color for the background ambient glows. |
| **`texteffect`**| `none` \| `shadow-soft` \| `shadow-strong` \| `glow-neon` \| `glow-matched` | Text drop shadow and glow styles. |
| **`animation`**| `none` \| `pulse` \| `wave` \| `shimmer` \| `monochrome` \| `eclipse` | Background glow animation style. |
| **`speed`** | `slow` \| `medium` (default) \| `fast` | Velocity of the background animations. |
| **`borderanim`**| `on` (default) \| `off` | Toggles the linear gradient movement on the bottom border. |
| **`bg`** | `transparent` | Makes the background transparent (useful for overlays in OBS). |

---

## 🎥 Video Calls & Live Stream Integration

### 1. OBS Studio Browser Source Integration
To overlay the backdrop behind your camera:
1.  In OBS, add a new **Browser (Browser)** source.
2.  Set the **URL** to your configured renderer URL (e.g., `https://backdrop.eole.me/renderer.html?mode=artist&animation=pulse`).
3.  Set the **Width** to `1920` and **Height** to `1080` (or match your canvas resolution).
4.  Check **"Refresh browser when scene becomes active"**.
5.  Position the browser source **at the bottom** of your source stack (behind your camera).
6.  *(Optional)* Add `&bg=transparent` to the URL to overlay just the name/title card on top of other content.

### 2. Direct Zoom / Teams / Meet Integration
1.  Configure your backdrop layout in the configurator.
2.  Select your preferred ratio format (16:9, Square, or Banner).
3.  Click **Export Image** to download a high-definition PNG file.
4.  In your video conferencing software settings, upload this image as a **Virtual Background**.

---

## 📦 Containerization & Deployment

### Continuous Deployment (CI/CD via GitHub Actions)
On every push to the `main` branch, the `.github/workflows/docker-publish.yml` workflow automatically builds the production image, runs static compilation with Vite, and pushes the built container image to GitHub Container Registry (GHCR) as:
`ghcr.io/gnueole/backdrop-studio:latest` and `ghcr.io/gnueole/backdrop-studio:<version>` (inferred from `package.json`).

### Server Deployment (VPS)
Deploy or update the application on your target VPS using the root Makefile target:
```bash
make deploy
```
This target:
1.  Ensures deployment directories exist on the host server.
2.  Downloads production secrets from Doppler (`prd_eole-me-backdrop-studio`).
3.  Transfers the production `docker-compose.prod.yml` configuration (featuring Traefik labels routing `backdrop.eole.me` and Vector log collection tags).
4.  Instructs the server to pull the latest image from GHCR and recreate the containers.
