const { Router } = require('express');
const tasks = require('../models/tasks');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const data = await tasks.findAll({ status, priority });
    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const task = await tasks.findById(Number(req.params.id));
    if (!task) return res.status(404).json({ data: null, error: 'Task not found' });
    res.json({ data: task, error: null });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, body, status, priority } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(422).json({ data: null, error: 'title is required' });
    }
    const task = await tasks.create({ title: title.trim(), body, status, priority });
    res.status(201).json({ data: task, error: null });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const existing = await tasks.findById(Number(req.params.id));
    if (!existing) return res.status(404).json({ data: null, error: 'Task not found' });
    const { title, body, status, priority } = req.body;
    const updated = await tasks.update(Number(req.params.id), { title, body, status, priority });
    res.json({ data: updated, error: null });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await tasks.findById(Number(req.params.id));
    if (!existing) return res.status(404).json({ data: null, error: 'Task not found' });
    await tasks.remove(Number(req.params.id));
    res.json({ data: { id: Number(req.params.id) }, error: null });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
