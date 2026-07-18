require('dotenv').config();
const app = require('../src/app');
const connectDB = require('../src/config/db');
const ensureAdminExists = require('../src/services/adminBootstrap');

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  await connectDB();
  await ensureAdminExists();
  isConnected = true;
};

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error('DB connection error:', err.message);
  }
  return app(req, res);
};
