const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const authModel = require('../models/authmodel');

async function run() {
  const mode = process.env.mode || process.env.MODE || 'development';
  const localUri = process.env.DB_LOCAL_URL || process.env.db_local_url;
  const prodUri = process.env.DB_PRODUCTION_URL || process.env.db_production_url;
  const uri = mode === 'production' ? prodUri : localUri;

  if (!uri) {
    console.error('MongoDB URI is missing. Set DB_LOCAL_URL or DB_PRODUCTION_URL in .env');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB (${mode})...`);
  await mongoose.connect(uri);
  console.log('Connected.');

  const name = (process.env.ADMIN_NAME || 'Admin').trim();
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').trim();
  const password = (process.env.ADMIN_PASSWORD || 'ChangeMe123!').trim();
  const category = (process.env.ADMIN_CATEGORY || 'general').trim();

  try {
    // Try to find admin by role, otherwise by email
    let admin = await authModel.findOne({ role: 'admin' });
    if (!admin) {
      admin = await authModel.findOne({ email });
    }

    if (admin) {
      console.log('Admin found. Updating credentials to match .env ...');
      admin.name = name;
      admin.email = email;
      admin.category = category;
      admin.role = 'admin';
      admin.password = await bcrypt.hash(password, 10);
      await admin.save();
      console.log('Admin updated:', { id: admin._id.toString(), email: admin.email });
    } else {
      console.log('No admin found. Creating a new admin from .env ...');
      const hashed = await bcrypt.hash(password, 10);
      const created = await authModel.create({
        name,
        email,
        password: hashed,
        category,
        role: 'admin',
        image: ''
      });
      console.log('Admin created:', { id: created._id.toString(), email: created.email });
    }
  } catch (err) {
    console.error('Failed to sync admin:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();