require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const ensureAdminExists = require('./services/adminBootstrap');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be set in .env and be at least 32 characters');
    }

    await connectDB();
    await ensureAdminExists();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Admin login uses ADMIN_EMAIL / ADMIN_PASSWORD from .env`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or change PORT in .env`);
        process.exit(1);
      }
      throw err;
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
