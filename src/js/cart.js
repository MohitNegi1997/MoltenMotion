/**
 * Cart domain logic — framework-agnostic, reusable.
 * No UI or framework dependency. Persists to localStorage.
 */

const STORAGE_KEY = 'molten-motion-cart';

/**
 * @typedef {Object} CartItem
 * @property {string} id - Product id
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {number} quantity
 */

/**
 * @returns {CartItem[]}
 */
export function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * @param {CartItem[]} items
 */
function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  dispatchCartChange();
}

/**
 * @param {{ id: string, name: string, price: number, image: string }} product
 * @param {number} [qty=1]
 */
export function addToCart(product, qty = 1) {
  const items = getCart();
  const existing = items.find((i) => i.id === product.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    });
  }
  saveCart(items);
}

/**
 * @param {string} productId
 */
export function removeFromCart(productId) {
  const items = getCart().filter((i) => i.id !== productId);
  saveCart(items);
}

/**
 * @param {string} productId
 * @param {number} quantity
 */
export function setQuantity(productId, quantity) {
  if (quantity < 1) {
    removeFromCart(productId);
    return;
  }
  const items = getCart();
  const item = items.find((i) => i.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(items);
  }
}

/**
 * @returns {number}
 */
export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

/**
 * @returns {number}
 */
export function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}

/**
 * Clear cart (e.g. after mock checkout).
 */
export function clearCart() {
  saveCart([]);
}

/**
 * Subscribe to cart changes (e.g. update UI).
 * @param {(count: number, items: CartItem[]) => void} callback
 * @returns {() => void} Unsubscribe
 */
export function subscribeToCart(callback) {
  const handler = () => callback(getCartCount(), getCart());
  window.addEventListener('cartchange', handler);
  handler();
  return () => window.removeEventListener('cartchange', handler);
}

function dispatchCartChange() {
  window.dispatchEvent(new CustomEvent('cartchange'));
}
