const { initDB } = require('./db/database');
const app = require('./app');

const PORT = process.env.PORT || 3000;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n  StyleHub is running at http://localhost:${PORT}\n`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
