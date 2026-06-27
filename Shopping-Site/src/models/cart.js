const { query, execute } = require('../db/database');

async function getCart(sessionId) {
  return query(
    `SELECT ci.id, ci.session_id, ci.product_id, ci.quantity,
            p.name, p.brand, p.price, p.sale_price, p.is_sale, p.color, p.category
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.session_id = ?
     ORDER BY ci.created_at ASC`,
    sessionId
  );
}

async function getItem(sessionId, productId) {
  const rows = await query(
    'SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?',
    sessionId, productId
  );
  return rows[0] || null;
}

async function addItem(sessionId, productId, quantity = 1) {
  const existing = await getItem(sessionId, productId);
  if (existing) {
    await execute(
      'UPDATE cart_items SET quantity = quantity + ? WHERE session_id = ? AND product_id = ?',
      quantity, sessionId, productId
    );
  } else {
    await execute(
      `INSERT INTO cart_items (id, session_id, product_id, quantity)
       VALUES (nextval('cart_seq'), ?, ?, ?)`,
      sessionId, productId, quantity
    );
  }
  return getCart(sessionId);
}

async function updateQty(sessionId, cartItemId, quantity) {
  if (quantity <= 0) {
    await execute(
      'DELETE FROM cart_items WHERE id = ? AND session_id = ?',
      cartItemId, sessionId
    );
  } else {
    await execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND session_id = ?',
      quantity, cartItemId, sessionId
    );
  }
  return getCart(sessionId);
}

async function removeItem(sessionId, cartItemId) {
  await execute(
    'DELETE FROM cart_items WHERE id = ? AND session_id = ?',
    cartItemId, sessionId
  );
  return getCart(sessionId);
}

async function clearCart(sessionId) {
  await execute('DELETE FROM cart_items WHERE session_id = ?', sessionId);
}

module.exports = { getCart, addItem, updateQty, removeItem, clearCart };
