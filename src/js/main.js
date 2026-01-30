/**
 * Main entry: init animations, cart UI, product grid, carousel, checkout.
 * Presentation only; domain logic lives in cart.js and products.js.
 */

import { runAnimations, initScrollAnimations } from './animations.js';
import { getCart, addToCart, removeFromCart, getCartCount, getCartTotal, clearCart, subscribeToCart } from './cart.js';
import { fetchProducts, fetchCategories, productsByCategory } from './products.js';

// ---------- Cart UI ----------
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartBody = document.getElementById('cart-body');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const cartClose = document.getElementById('cart-close');
const cartCheckout = document.getElementById('cart-checkout');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutModalClose = document.getElementById('checkout-modal-close');
const snackbar = document.getElementById('snackbar');
let snackbarTimeout = null;

function showSnackbar(message) {
  if (!snackbar) return;
  const textEl = snackbar.querySelector('.snackbar__text');
  if (textEl) textEl.textContent = message;
  snackbar.classList.add('is-visible');
  snackbar.setAttribute('aria-hidden', 'false');
  if (snackbarTimeout) clearTimeout(snackbarTimeout);
  snackbarTimeout = setTimeout(() => {
    snackbar.classList.remove('is-visible');
    snackbar.setAttribute('aria-hidden', 'true');
    snackbarTimeout = null;
  }, 3000);
}

function openCart() {
  cartDrawer?.classList.add('is-open');
  cartOverlay?.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
  checkoutModal?.setAttribute('aria-hidden', 'true');
}

function closeCart() {
  cartDrawer?.classList.remove('is-open');
  cartOverlay?.classList.remove('is-visible');
  document.body.style.overflow = '';
}

function renderCart() {
  const items = getCart();
  if (!cartBody) return;

  if (items.length === 0) {
    cartBody.innerHTML = '<p class="body" style="color: var(--text-muted);">Your cart is empty.</p>';
    if (cartTotalEl) cartTotalEl.textContent = '$0';
    return;
  }

  cartBody.innerHTML = items
    .map(
      (item) => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item__image" src="${escapeHtml(item.image)}" alt="" width="72" height="72" />
      <div class="cart-item__info">
        <p class="cart-item__name">${escapeHtml(item.name)}</p>
        <p class="cart-item__price">$${item.price} × ${item.quantity}</p>
        <button type="button" class="cart-item__remove" data-remove="${item.id}">Remove</button>
      </div>
    </div>
  `
    )
    .join('');

  if (cartTotalEl) cartTotalEl.textContent = `$${getCartTotal()}`;

  cartBody.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.getAttribute('data-remove'));
    });
  });
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

document.querySelector('.cart-trigger')?.addEventListener('click', openCart);
cartClose?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);

subscribeToCart((count, items) => {
  if (cartCountEl) cartCountEl.textContent = count;
  renderCart();
});

// ---------- Checkout (mock) ----------
cartCheckout?.addEventListener('click', () => {
  if (getCartCount() === 0) return;
  checkoutModal?.classList.add('is-open');
  checkoutModal?.setAttribute('aria-hidden', 'false');
  clearCart();
  closeCart();
});

checkoutModalClose?.addEventListener('click', () => {
  checkoutModal?.classList.remove('is-open');
  checkoutModal?.setAttribute('aria-hidden', 'true');
});

checkoutModal?.addEventListener('click', (e) => {
  if (e.target === checkoutModal) {
    checkoutModal.classList.remove('is-open');
    checkoutModal.setAttribute('aria-hidden', 'true');
  }
});

// ---------- Category grid + tabs ----------
const categoryGrid = document.getElementById('category-grid');
const tabTriggers = document.querySelectorAll('.tab-trigger[data-tab]');
let allProducts = [];
let categories = [];

function formatPrice(price) {
  return '$' + price;
}

function renderProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('data-animate', '');
  card.innerHTML = `
    <a href="#" class="product-card__link" data-product-id="${product.id}">
      <div class="product-card__image">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" width="300" height="300" loading="lazy" />
      </div>
      <div class="product-card__info">
        <p class="product-card__name">${escapeHtml(product.name)}</p>
        <p class="product-card__price">${formatPrice(product.price)}</p>
      </div>
    </a>
    <button type="button" class="btn btn--primary" data-add-cart="${product.id}">Add to cart</button>
  `;

  const link = card.querySelector('[data-product-id]');
  link?.addEventListener('click', (e) => {
    e.preventDefault();
    // Optional: scroll to product detail or open quick view
  });

  const addBtn = card.querySelector('[data-add-cart]');
  addBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const p = allProducts.find((x) => x.id === product.id);
    if (p) {
      addToCart(p);
      showSnackbar(`${p.name} added to cart`);
    }
  });

  return card;
}

function renderCategoryGrid(categoryId) {
  if (!categoryGrid) return;
  const filtered = productsByCategory(categoryId, allProducts);
  categoryGrid.innerHTML = '';
  filtered.forEach((product, i) => {
    const el = renderProductCard(product);
    el.setAttribute('data-delay', String((i % 6) + 1));
    categoryGrid.appendChild(el);
  });
  initScrollAnimations();
}

tabTriggers.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabTriggers.forEach((t) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    renderCategoryGrid(tab.getAttribute('data-tab') === 'all' ? '' : tab.getAttribute('data-tab'));
  });
});

// ---------- Carousel (testimonials) ----------
async function initCarousel() {
  try {
    const res = await fetch('/data/testimonials.json');
    const list = await res.json();
    const track = document.getElementById('carousel-track');
    if (!track) return;

    const itemHtml = (item) => `
      <div class="community-card">
        <img class="community-card__avatar" src="${escapeHtml(item.avatar)}" alt="" width="48" height="48" />
        <p class="community-card__quote">"${escapeHtml(item.quote)}"</p>
        <p class="community-card__name">— ${escapeHtml(item.name)}</p>
      </div>
    `;

    const fragment = list.map(itemHtml).join('');
    track.innerHTML = fragment + fragment;
  } catch (_) {
    const track = document.getElementById('carousel-track');
    if (track) track.innerHTML = '<p class="body">Loading…</p>';
  }
}

// ---------- Init ----------
async function init() {
  runAnimations();

  try {
    [allProducts, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
    renderCategoryGrid('');
  } catch (e) {
    if (categoryGrid) categoryGrid.innerHTML = '<p class="body">Could not load products.</p>';
  }

  initCarousel();
}

init();
