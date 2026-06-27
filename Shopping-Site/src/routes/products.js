const { Router } = require('express');
const products = require('../models/products');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { search = '', category = '', sort = 'featured' } = req.query;
    const data = await products.findAll({ search, category, sort });
    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await products.findById(Number(req.params.id));
    if (!product) return res.status(404).json({ data: null, error: 'Product not found' });
    res.json({ data: product, error: null });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
