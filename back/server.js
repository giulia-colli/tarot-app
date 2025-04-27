const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const readingRoutes = require('./routes/readingRoutes');
const cardRoutes = require('./routes/cardRoutes'); // ✅ Aggiunto

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotte
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/cards', cardRoutes); // ✅ Rotta carte per l'admin

// Controllo MONGO_URL
if (!process.env.MONGO_URL) {
  console.error('MONGO_URL non è definito nel file .env');
  process.exit(1);
}

// Connessione a MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server avviato su http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('❌ Errore MongoDB:', err));

