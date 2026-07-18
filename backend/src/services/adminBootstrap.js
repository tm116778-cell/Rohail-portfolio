const Admin = require('../models/Admin');

/**
 * On server start, create the admin account from .env if none exists.
 * Credentials stay in .env and are never committed to GitHub.
 */
const ensureAdminExists = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters');
  }

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return existing;
  }

  const admin = await Admin.create({ email, password });
  console.log(`Admin account created from .env: ${email}`);
  return admin;
};

module.exports = ensureAdminExists;
