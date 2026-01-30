import { defineConfig } from 'vite';

// Relative base: one build works for both *.github.io/MoltenMotion/ and custom domain (moltenmotion.in at root)
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});
