const { Router } = require('express');
const cart = require('../models/cart');

const router = Router();

function getSession(req, res) {
  const sid = req.headers['x-session-id'];
  if (!sid) {
    res.status(400).json({ data: null, error: 'X-Session-ID header is required' });
    return null;
  }
  return sid;
}

router.get('/', async (req, res, next) => {
  try {
    const sid = getSession(req, res);
    if (!sid) return;
    const data = await cart.getCart(sid);
    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const sid = getSession(req, res);
    if (!sid) return;
    const { product_id, quantity = 1 } = req.body;
    if (!product_id) return res.status(422).json({ data: null, error: 'product_id is required' });
    const data = await cart.addItem(sid, Number(product_id), Number(quantity));
    res.status(201).json({ data, error: null });
  } catch (err) {
    next(err);
  }
});

router.put('/:itemId', async (req, res, next) => {
  try {
    const sid = getSession(req, res);
    if (!sid) return;
    const { quantity } = req.body;
    if (quantity === undefined) return res.status(422).json({ data: null, error: 'quantity is required' });
    const data = await cart.updateQty(sid, Number(req.params.itemId), Number(quantity));
    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
});

router.delete('/:itemId', async (req, res, next) => {
  try {
    const sid = getSession(req, res);
    if (!sid) return;
    const data = await cart.removeItem(sid, Number(req.params.itemId));
    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const sid = getSession(req, res);
    if (!sid) return;
    await cart.clearCart(sid);
    res.json({ data: [], error: null });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
