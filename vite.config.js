import { defineConfig } from 'vite';

// GitHub Pages serves at https://<user>.github.io/<repo>/, so base must be '/<repo>/'
const base = process.env.GITHUB_PAGES === 'true' ? '/MoltenMotion/' : '/';

export default defineConfig({
  base,
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
