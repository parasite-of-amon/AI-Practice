import { ProductsView } from './products.js';
import { CartView }     from './cart.js';
import { showToast }    from './toast.js';

let currentCategory = 'all';
let currentSearch   = '';
let currentSort     = 'featured';
let searchTimer     = null;

const cart = new CartView();

const productsView = new ProductsView({
  onAddToCart: async (product, btn, qty = 1) => {
    btn.classList.add('adding');
    btn.textContent = '…';
    try {
      await cart.addItem(product.id, qty);
      cart.open();
      showToast(`✔ "${product.name}" added to cart`);
    } catch (err) {
      showToast(`⚠ ${err.message}`);
    } finally {
      btn.classList.remove('adding');
      btn.textContent = btn.disabled ? 'Out of Stock' : 'Add to Cart';
    }
  },
});

function loadProducts() {
  const params = {};
  if (currentSearch)              params.search   = currentSearch;
  if (currentCategory !== 'all') params.category = currentCategory;
  if (currentSort)                params.sort     = currentSort;
  productsView.load(params);
}

// Category tabs
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.cat;
    loadProducts();
  });
});

// Search
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    currentSearch = searchInput.value.trim();
    loadProducts();
  }, 320);
});
document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  clearTimeout(searchTimer);
  currentSearch = searchInput.value.trim();
  loadProducts();
});
document.getElementById('clear-search-btn').addEventListener('click', () => {
  searchInput.value = '';
  currentSearch = '';
  loadProducts();
});

// Sort
document.getElementById('sort-select').addEventListener('change', (e) => {
  currentSort = e.target.value;
  loadProducts();
});

// Hero CTA
document.getElementById('hero-shop-btn').addEventListener('click', () => {
  document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
});

loadProducts();
