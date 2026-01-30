/**
 * Products data layer — loads from static JSON.
 * Domain logic; no UI dependency. Extensible for 3D/Three.js later.
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {number} price
 * @property {string} categoryId
 * @property {string} image
 * @property {string} description
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} color
 * @property {string} image
 */

// Respect Vite base (e.g. /MoltenMotion/ on GitHub Pages) so /data/... loads correctly
const DATA_BASE = (import.meta.env.BASE_URL || '/') + 'data';

/**
 * @returns {Promise<Product[]>}
 */
export async function fetchProducts() {
  const res = await fetch(`${DATA_BASE}/products.json`);
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
}

/**
 * @returns {Promise<Category[]>}
 */
export async function fetchCategories() {
  const res = await fetch(`${DATA_BASE}/categories.json`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

/**
 * @param {string} categoryId
 * @param {Product[]} products
 * @returns {Product[]}
 */
export function productsByCategory(categoryId, products) {
  if (!categoryId) return products;
  return products.filter((p) => p.categoryId === categoryId);
}

/**
 * @param {string} id
 * @param {Product[]} products
 * @returns {Product|undefined}
 */
export function getProductById(id, products) {
  return products.find((p) => p.id === id);
}

/**
 * @returns {Promise<{ avatar: string, quote: string, name: string }[]>}
 */
export async function fetchTestimonials() {
  const res = await fetch(`${DATA_BASE}/testimonials.json`);
  if (!res.ok) throw new Error('Failed to load testimonials');
  return res.json();
}
