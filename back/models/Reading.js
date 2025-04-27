const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cards: [
    {
      nome: String,
      immagine: String,
      descrizione: String
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reading', readingSchema);
