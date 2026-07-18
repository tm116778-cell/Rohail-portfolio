require('dotenv').config();

const connectDB = require('../config/db');
const ensureAdminExists = require('../services/adminBootstrap');

(async () => {
  try {
    await connectDB();
    await ensureAdminExists();
    console.log('Seed complete. Admin is ready.');
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
