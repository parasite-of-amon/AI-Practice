const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'test' ? 'silent' : 'dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use(errorHandler);

module.exports = app;
