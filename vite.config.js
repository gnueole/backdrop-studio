import { defineConfig } from 'vite';
import { resolve } from 'path';
import { execSync } from 'child_process';
import pkg from './package.json' with { type: 'json' };

// Get short git commit hash dynamically
let commitHash = 'dev';
try {
  commitHash = execSync('git rev-parse --short HEAD 2>/dev/null').toString().trim();
} catch (e) {
  // Fallback to dev if git command is not available or outside repo
}

const appVersion = `v${pkg.version}-${commitHash}`;

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        renderer: resolve(__dirname, 'renderer.html'),
      },
    },
  },
});
