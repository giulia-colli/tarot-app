require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('❌ ADMIN_EMAIL o ADMIN_PASSWORD mancano nel file .env');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('👑 Admin già esistente');
      mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username: 'Admin',
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    console.log('✅ Admin creato con successo');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Errore MongoDB:', err);
  });

