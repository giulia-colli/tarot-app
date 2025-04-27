const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  numero: { type: Number, required: true },
  nome: { type: String, required: true },
  descrizione: { type: String, required: true },
  immagine: { type: String, required: true }, // URL (es. Cloudinary)
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
