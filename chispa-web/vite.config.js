import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Genera UN solo index.html autocontenido: JS + CSS + modelo 3D (base64) embebidos.
// base './' permite servir bajo /CHISPA_TCI/ (GitHub Pages) y en file://.
export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  assetsInclude: ['**/*.glb'],
  build: {
    assetsInlineLimit: 8 * 1024 * 1024,
    chunkSizeWarningLimit: 8 * 1024 * 1024,
    reportCompressedSize: false
  }
});

