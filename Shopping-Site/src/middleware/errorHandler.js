function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'Internal server error'
    : err.message;

  res.status(status).json({ data: null, error: message });
}

module.exports = errorHandler;
