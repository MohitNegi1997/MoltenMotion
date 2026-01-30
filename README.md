# Molten Motion — Ecommerce (Demo)

A static, animation-heavy ecommerce demo built to work with **GitHub Pages** and follow a clean, playful design system. No backend; cart and checkout are client-side only (mock).

## Stack

- **Build**: [Vite](https://vitejs.dev/) (vanilla), static export
- **Markup**: HTML5, semantic sections
- **Styles**: CSS (design tokens, layout, components, animations)
- **Behavior**: Vanilla JS (cart, products, scroll animations)
- **Data**: Static JSON in `public/data/` (products, categories, testimonials)

## Project structure

```
├── index.html              # Single page, all sections
├── package.json
├── vite.config.js
├── public/
│   └── data/
│       ├── products.json
│       ├── categories.json
│       └── testimonials.json
├── src/
│   ├── css/
│   │   ├── base.css        # Tokens, reset, typography
│   │   ├── layout.css      # Containers, grids
│   │   ├── components.css  # Buttons, cards, header, footer, cart
│   │   ├── animations.css  # Entrance, stagger, carousel, modal
│   │   └── sections.css    # Hero, feature banner, etc.
│   └── js/
│       ├── main.js         # Entry: cart UI, grid, carousel, checkout
│       ├── animations.js   # Scroll entrance, parallax (reusable)
│       ├── cart.js         # Cart domain logic (framework-agnostic)
│       └── products.js     # Load products/categories from JSON
└── README.md
```

## Commands

```bash
# Install
npm install

# Dev server (with hot reload)
npm run dev

# Production build (output in dist/)
npm run build

# Preview production build locally
npm preview
```

## GitHub Pages deployment

### Option A: Deploy from `main` (root or `/docs`)

1. Build: `npm run build`
2. If using **root**:
   - In repo **Settings → Pages**, set **Source** to **GitHub Actions** (recommended) or push the contents of `dist/` to a branch and select that branch + `/ (root)`.
3. If using **docs folder**:
   - Copy the contents of `dist/` into a `docs/` folder in the repo, commit, push.
   - In **Settings → Pages**, set **Source** to **Deploy from a branch**, branch e.g. `main`, folder **/docs**.

### Option B: Deploy with GitHub Actions (recommended)

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

2. In repo **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main`; the workflow builds and deploys `dist/` to GitHub Pages.

### Base path (GitHub Pages + custom domain)

The build uses **`base: './'`** (relative) so one build works for both:

- **https://mohitnegi1997.github.io/MoltenMotion/** (project site subpath)
- **https://moltenmotion.in/** (custom domain at root)

Assets and data paths resolve relative to the current URL, so CSS, JS, and JSON load correctly on either URL. No extra setup; push to `main` to deploy.

## Features

- **Sections**: Header, hero, feature banner, trusted-by, messaging, shop-by-category (with tabs), testimonials carousel, story, footer
- **Cart**: Add/remove items, persist in `localStorage`, slide-out drawer, subtotal
- **Checkout**: “Checkout (demo)” opens a thank-you modal and clears the cart (no real payment)
- **Motion**: Scroll-based entrance (ease-out, stagger), subtle parallax, hover lift/scale/shadow, infinite carousel (pause on hover)
- **Data**: Products and categories from `public/data/*.json`; architecture supports future 3D/Three.js or other extensions

## License

MIT.
