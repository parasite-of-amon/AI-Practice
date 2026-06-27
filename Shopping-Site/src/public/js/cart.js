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

export class CartView {
  constructor() {
    this.sidebar   = document.getElementById('cart-sidebar');
    this.overlay   = document.getElementById('cart-overlay');
    this.badge     = document.getElementById('cart-badge');
    this.countLbl  = document.getElementById('cart-count-label');
    this.itemsList = document.getElementById('cart-items-list');
    this.emptyEl   = document.getElementById('cart-empty');
    this.footer    = document.getElementById('cart-footer');
    this.totalEl   = document.getElementById('cart-total');
    this.clearBtn  = document.getElementById('clear-cart-btn');  // T-15/T-16
    this.items     = [];
    this._busy     = false; // T-14: race-condition guard

    document.getElementById('cart-btn').addEventListener('click',       () => this.open());
    document.getElementById('close-cart-btn').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());
    document.getElementById('start-shopping-btn').addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });

    // T-15: clear cart
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this._clearCart());
    }

    this.load();
  }

  async load() {
    try {
      this.items = await api.get('/cart');
      this._render();
    } catch (_) { /* silent on initial load — server may not be ready */ }
  }

  async addItem(productId, qty = 1) {
    this.items = await api.post('/cart', { product_id: productId, quantity: qty });
    this._render();
  }

  // T-14: guard + error handling
  async _changeQty(cartItemId, newQty) {
    if (this._busy) return;
    this._busy = true;
    try {
      this.items = await api.put(`/cart/${cartItemId}`, { quantity: newQty });
      this._render();
    } catch (err) {
      showToast(`⚠ ${err.message}`);
    } finally {
      this._busy = false;
    }
  }

  async _removeItem(cartItemId) {
    if (this._busy) return;
    this._busy = true;
    try {
      this.items = await api.delete(`/cart/${cartItemId}`);
      this._render();
    } catch (err) {
      showToast(`⚠ ${err.message}`);
    } finally {
      this._busy = false;
    }
  }

  // T-15: clear entire cart
  async _clearCart() {
    if (this._busy || !this.items.length) return;
    if (!confirm('Remove all items from your cart?')) return;
    this._busy = true;
    try {
      await api.delete('/cart');
      this.items = [];
      this._render();
      showToast('Cart cleared');
    } catch (err) {
      showToast(`⚠ ${err.message}`);
    } finally {
      this._busy = false;
    }
  }

  _render() {
    const count = this.items.reduce((s, i) => s + i.quantity, 0);
    const total = this.items.reduce((sum, i) => {
      const price = i.is_sale && i.sale_price ? i.sale_price : i.price;
      return sum + price * i.quantity;
    }, 0);

    // Badge
    this.badge.textContent = count > 99 ? '99+' : count;
    this.badge.hidden      = count === 0;
    this.countLbl.textContent = `(${count} item${count !== 1 ? 's' : ''})`;

    const hasItems = this.items.length > 0;
    this.emptyEl.hidden   = hasItems;
    this.itemsList.hidden = !hasItems;
    this.footer.hidden    = !hasItems;
    this.totalEl.textContent = fmt(total);

    // T-16: show/hide clear button
    if (this.clearBtn) this.clearBtn.hidden = !hasItems;

    if (!hasItems) { this.itemsList.innerHTML = ''; return; }

    // T-17: per-item line total
    this.itemsList.innerHTML = this.items.map(item => {
      const grad  = CAT_GRADIENTS[item.category] || 'linear-gradient(135deg,#e2e8f0,#94a3b8)';
      const emoji = CAT_EMOJI[item.category] || '🛍️';
      const price = item.is_sale && item.sale_price ? item.sale_price : item.price;
      const lineTotal = price * item.quantity;
      return `
        <li class="cart-item" data-item-id="${item.id}">
          <div class="cart-item-img" style="background:${grad}">${emoji}</div>
          <div class="cart-item-details">
            <p class="cart-item-brand">${esc(item.brand)}</p>
            <p class="cart-item-name" title="${esc(item.name)}">${esc(item.name)}</p>
            <div class="cart-item-pricing">
              <span class="cart-item-unit">${fmt(price)} ea.</span>
              <span class="cart-item-line-total">${fmt(lineTotal)}</span>
            </div>
            <div class="cart-item-qty">
              <button class="qty-btn qty-dec" data-id="${item.id}" data-qty="${item.quantity - 1}" aria-label="Decrease quantity">−</button>
              <span class="qty-value" aria-label="Quantity">${item.quantity}</span>
              <button class="qty-btn qty-inc" data-id="${item.id}" data-qty="${item.quantity + 1}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${esc(item.name)} from cart">✕</button>
        </li>`;
    }).join('');

    this.itemsList.querySelectorAll('.qty-dec, .qty-inc').forEach(btn => {
      btn.addEventListener('click', () => this._changeQty(Number(btn.dataset.id), Number(btn.dataset.qty)));
    });
    this.itemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => this._removeItem(Number(btn.dataset.id)));
    });
  }

  open() {
    this.sidebar.classList.add('open');
    this.overlay.classList.add('open');
    this.sidebar.setAttribute('aria-hidden', 'false');
    this.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.sidebar.classList.remove('open');
    this.overlay.classList.remove('open');
    this.sidebar.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
