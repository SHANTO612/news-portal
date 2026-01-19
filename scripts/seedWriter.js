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
    console.error('MongoDB URI is missing.');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB (${mode})...`);
  await mongoose.connect(uri);
  console.log('Connected.');

  const email = 'nibir@gmail.com';
  const password = 'shanto612';

  try {
    const writer = await authModel.findOne({ email }).select('+password');
    if (writer) {
      console.log('Writer already exists:', email);
      // Ensure password matches
      const match = await bcrypt.compare(password, writer.password);
      if (!match) {
          console.log('Updating writer password...');
          writer.password = await bcrypt.hash(password, 10);
          await writer.save();
          console.log('Writer password updated.');
      }
    } else {
      console.log('Creating writer:', email);
      await authModel.create({
        name: 'Nibir',
        email: email,
        password: await bcrypt.hash(password, 10),
        category: 'Sports',
        role: 'writer',
        image: ''
      });
      console.log('Writer created.');
    }
  } catch (err) {
    console.error('Error seeding writer:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
