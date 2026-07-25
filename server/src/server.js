const app = require('./app');
const connectDB = require('./config/db');
const seedProducts = require('./seed');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedProducts();
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const gracefulShutdown = (signal) => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
  process.once('SIGINT', () => gracefulShutdown('SIGINT'));
  process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));
}).catch(err => {
  console.error("Failed to connect to DB, server not started.", err);
  process.exit(1);
});

// Dev reload comment
