require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const ensureAdminExists = require('./services/adminBootstrap');

// Initialize database connection for serverless environment
// Mongoose will queue queries until the connection is established
connectDB().then(() => {
  return ensureAdminExists();
}).catch(console.error);

module.exports = app;
