import { api } from './api.js';
import { showToast } from './toast.js';

const CAT_GRADIENTS = {
  womens:      'linear-gradient(135deg,#f9a8d4,#db2777)',
  mens:        'linear-gradient(135deg,#93c5fd,#2563eb)',
  shoes:       'linear-gradient(135deg,#fcd34d,#d97706)',
  accessories: 'linear-gradient(135deg,#c4b5fd,#7c3aed)',
};
const CAT_EMOJI = { womens:'👗', mens:'👔', shoes:'👟', accessories:'👜' };

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' }).format(n);
}
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// T-19: low-stock / out-of-stock logic
function renderCard(p) {
  const grad        = CAT_GRADIENTS[p.category] || 'linear-gradient(135deg,#e2e8f0,#94a3b8)';
  const emoji       = CAT_EMOJI[p.category] || '🛍️';
  const displayPrice = p.is_sale && p.sale_price ? p.sale_price : p.price;
  const isSale      = Boolean(p.is_sale && p.sale_price);
  const isLowStock  = p.stock > 0 && p.stock < 20;
  const isOOS       = p.stock === 0;

  return `
    <article
      class="product-card${isOOS ? ' is-oos' : ''}"
      data-id="${p.id}"
      tabindex="0"
      role="button"
      aria-label="View details for ${esc(p.name)}"
    >
      <div class="product-img-wrap">
        <div class="product-img-placeholder" style="--placeholder-grad:${grad}">
          ${emoji}
        </div>
        <div class="product-badges">
          ${p.is_new  ? '<span class="badge badge-new">New</span>'  : ''}
          ${isSale    ? '<span class="badge badge-sale">Sale</span>' : ''}
          ${isLowStock ? `<span class="badge badge-low-stock">Only ${p.stock} left</span>` : ''}
          ${isOOS      ? '<span class="badge badge-oos">Out of Stock</span>' : ''}
        </div>
      </div>
      <div class="product-info">
        <p class="product-brand">${esc(p.brand)}</p>
        <h3 class="product-name">${esc(p.name)}</h3>
        <p class="product-color">${esc(p.color)}</p>
        <div class="product-footer">
          <div class="product-pricing">
            <span class="product-price${isSale ? ' is-sale' : ''}">${fmt(displayPrice)}</span>
            ${isSale ? `<span class="product-original-price">${fmt(p.price)}</span>` : ''}
          </div>
          <button
            class="add-to-cart-btn"
            data-product-id="${p.id}"
            ${isOOS ? 'disabled' : ''}
            aria-label="${isOOS ? 'Out of stock' : `Add ${esc(p.name)} to cart`}"
          >${isOOS ? 'Out of Stock' : 'Add to Cart'}</button>
        </div>
      </div>
    </article>`;
}

// T-20: Product detail modal controller
class ProductModal {
  constructor(onAddToCart) {
    this.onAddToCart = onAddToCart;
    this._qty = 1;
    this._product = null;

    this._backdrop = document.getElementById('product-modal');
    this._imgEl    = document.getElementById('modal-img-ph');
    this._brandEl  = document.getElementById('modal-brand');
    this._nameEl   = document.getElementById('modal-name');
    this._colorEl  = document.getElementById('modal-color');
    this._descEl   = document.getElementById('modal-desc');
    this._sizeEl   = document.getElementById('modal-size');
    this._stockEl  = document.getElementById('modal-stock');
    this._priceEl  = document.getElementById('modal-price');
    this._origEl   = document.getElementById('modal-orig-price');
    this._qtyVal   = document.getElementById('modal-qty-val');
    this._qtyDec   = document.getElementById('modal-qty-dec');
    this._qtyInc   = document.getElementById('modal-qty-inc');
    this._addBtn   = document.getElementById('modal-add-btn');
    this._closeBtn = document.getElementById('close-product-modal');

    this._closeBtn.addEventListener('click', () => this.close());
    this._backdrop.addEventListener('click', (e) => { if (e.target === this._backdrop) this.close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !this._backdrop.hidden) this.close(); });

    this._qtyDec.addEventListener('click', () => this._setQty(this._qty - 1));
    this._qtyInc.addEventListener('click', () => this._setQty(this._qty + 1));
    this._addBtn.addEventListener('click', () => {
      if (!this._product) return;
      this.onAddToCart(this._product, this._addBtn, this._qty);
      this.close();
    });
  }

  _setQty(n) {
    this._qty = Math.max(1, Math.min(10, n));
    this._qtyVal.textContent = this._qty;
    this._qtyDec.disabled = this._qty <= 1;
    this._qtyInc.disabled = this._qty >= 10;
  }

  open(product) {
    const grad  = CAT_GRADIENTS[product.category] || 'linear-gradient(135deg,#e2e8f0,#94a3b8)';
    const emoji = CAT_EMOJI[product.category] || '🛍️';
    const displayPrice = product.is_sale && product.sale_price ? product.sale_price : product.price;
    const isSale = Boolean(product.is_sale && product.sale_price);
    const isOOS  = product.stock === 0;

    this._imgEl.style.background = grad;
    this._imgEl.textContent      = emoji;
    this._brandEl.textContent    = product.brand;
    this._nameEl.textContent     = product.name;
    this._colorEl.textContent    = `Color: ${product.color}`;
    this._descEl.textContent     = product.description;
    this._sizeEl.textContent     = `Sizes: ${product.size_range}`;
    this._priceEl.textContent    = fmt(displayPrice);
    this._priceEl.className      = 'modal-price' + (isSale ? ' is-sale' : '');

    if (isSale) {
      this._origEl.textContent = fmt(product.price);
      this._origEl.hidden = false;
    } else {
      this._origEl.hidden = true;
    }

    if (isOOS) {
      this._stockEl.textContent  = '✕ Out of stock';
      this._stockEl.className    = 'modal-stock oos';
      this._addBtn.disabled      = true;
      this._addBtn.textContent   = 'Out of Stock';
    } else if (product.stock < 20) {
      this._stockEl.textContent  = `⚠ Only ${product.stock} left`;
      this._stockEl.className    = 'modal-stock low';
      this._addBtn.disabled      = false;
      this._addBtn.textContent   = 'Add to Cart';
    } else {
      this._stockEl.textContent  = '✔ In stock';
      this._stockEl.className    = 'modal-stock ok';
      this._addBtn.disabled      = false;
      this._addBtn.textContent   = 'Add to Cart';
    }

    this._product = product;
    this._setQty(1);
    this._backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    this._closeBtn.focus();
  }

  close() {
    this._backdrop.hidden = true;
    document.body.style.overflow = '';
    this._product = null;
  }
}

export class ProductsView {
  constructor({ onAddToCart }) {
    this.onAddToCart = onAddToCart;
    this.grid        = document.getElementById('product-grid');
    this.loading     = document.getElementById('loading-state');
    this.empty       = document.getElementById('empty-state');
    this.count       = document.getElementById('result-count');
    this.allProducts = [];

    // T-13: save original empty-state text so _showError can restore it
    this._emptyP        = this.empty.querySelector('p');
    this._emptyPOriginal = this._emptyP.textContent;

    this._modal = new ProductModal(onAddToCart);
  }

  async load(params = {}) {
    this._showLoading();
    try {
      const qs = new URLSearchParams(params).toString();
      this.allProducts = await api.get(`/products${qs ? '?' + qs : ''}`);
      this._render(this.allProducts);
    } catch (err) {
      this._showError(err.message);
    }
  }

  _render(products) {
    this.loading.hidden = true;
    this.grid.hidden    = false;
    this._emptyP.textContent = this._emptyPOriginal; // T-13: always restore

    if (!products.length) {
      this.empty.hidden = false;
      this.grid.innerHTML = '';
      this.count.textContent = 'No products found';
      return;
    }

    this.empty.hidden = true;
    this.count.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;
    this.grid.innerHTML = products.map(renderCard).join('');

    // T-20: card body click → modal
    this.grid.querySelectorAll('.product-card').forEach(card => {
      const openModal = () => {
        const id = Number(card.dataset.id);
        const product = this.allProducts.find(p => p.id === id);
        if (product) this._modal.open(product);
      };
      card.addEventListener('click', openModal);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
      });
    });

    // Add-to-cart button: add 1 directly, stop card-click from firing
    this.grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (btn.disabled) return;
        const id = Number(btn.dataset.productId);
        const product = this.allProducts.find(p => p.id === id);
        if (product) this.onAddToCart(product, btn, 1);
      });
    });
  }

  _showLoading() {
    this.loading.hidden = false;
    this.grid.hidden    = true;
    this.empty.hidden   = true;
    this.count.textContent = 'Loading…';
  }

  // T-13: only mutate the saved reference — never query the DOM again
  _showError(msg) {
    this.loading.hidden = true;
    this.grid.hidden    = true;
    this.empty.hidden   = false;
    this.count.textContent  = 'Error loading products';
    this._emptyP.textContent = msg;
    showToast(`⚠ ${msg}`);
  }
}
