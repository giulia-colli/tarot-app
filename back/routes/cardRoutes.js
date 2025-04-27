const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware'); // ✅ Importato

// 📥 GET tutte le carte – accesso pubblico
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find().sort({ numero: 1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero delle carte' });
  }
});

// ➕ POST aggiungi una carta – solo admin
router.post('/', protect, isAdmin, async (req, res) => {
  const { numero, nome, descrizione, immagine } = req.body;

  if (!numero || !nome || !descrizione || !immagine) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  try {
    const nuovaCarta = await Card.create({ numero, nome, descrizione, immagine });
    res.status(201).json(nuovaCarta);
  } catch (err) {
    res.status(500).json({ message: 'Errore durante la creazione' });
  }
});

// ✏️ PUT modifica una carta – solo admin
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const cartaAggiornata = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cartaAggiornata) return res.status(404).json({ message: 'Carta non trovata' });
    res.json(cartaAggiornata);
  } catch (err) {
    res.status(500).json({ message: 'Errore durante la modifica' });
  }
});

// 🗑 DELETE elimina una carta – solo admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const cartaEliminata = await Card.findByIdAndDelete(req.params.id);
    if (!cartaEliminata) return res.status(404).json({ message: 'Carta non trovata' });
    res.json({ message: 'Carta eliminata con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante l\'eliminazione' });
  }
});

module.exports = router;

