const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

// Use the exact filename present in the repo (Windows is case-insensitive, but be explicit)
const authModel = require('../models/authmodel');

async function run() {
  const mode = process.env.mode || 'development';
  const localUri = process.env.DB_LOCAL_URL;
  const prodUri = process.env.db_production_url;
  const uri = mode === 'production' ? prodUri : localUri;

  if (!uri) {
    console.error('MongoDB URI is missing. Set DB_LOCAL_URL or db_production_url in .env');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB (${mode})...`);
  await mongoose.connect(uri);
  console.log('Connected.');

  const name = process.env.ADMIN_NAME || 'Admin';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const category = process.env.ADMIN_CATEGORY || 'general';

  try {
    const existingByEmail = await authModel.findOne({ email });
    const existingAdmin = await authModel.findOne({ role: 'admin' });

    if (existingByEmail || existingAdmin) {
      console.log('Admin user already exists. Skipping creation.');
      console.log('Existing admin:', (existingByEmail || existingAdmin)?.email);
      await mongoose.disconnect();
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await authModel.create({
      name: name.trim(),
      email: email.trim(),
      password: hashed,
      category: category.trim(),
      role: 'admin',
      image: ''
    });

    console.log('Admin user created successfully:');
    console.log({ id: admin._id.toString(), email: admin.email, role: admin.role });
  } catch (err) {
    console.error('Failed to seed admin:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();