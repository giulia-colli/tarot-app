const express = require('express');
const router = express.Router();
const Reading = require('../models/Reading');
const { protect } = require('../middleware/authMiddleware');

// 🔐 Salva una nuova lettura
router.post('/', protect, async (req, res) => {
  const { cards } = req.body;

  try {
    const filteredCards = cards.map(card => ({
      nome: card.nome,
      descrizione: card.descrizione,
      immagine: card.immagine,
    }));

    const reading = await Reading.create({
      userId: req.user.id,
      cards: filteredCards,
    });

    res.status(201).json(reading);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel salvataggio lettura' });
  }
});

// 🔐 Recupera le letture di un utente
router.get('/storico', protect, async (req, res) => {
  try {
    const readings = await Reading.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dello storico' });
  }
});

// 🔥 Elimina una lettura
router.delete('/:id', protect, async (req, res) => {
  try {
    const reading = await Reading.findById(req.params.id);

    if (!reading) {
      return res.status(404).json({ message: 'Lettura non trovata' });
    }

    // Sicurezza: può eliminare solo le proprie letture
    if (reading.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Non autorizzato' });
    }

    await reading.deleteOne();
    res.json({ message: 'Lettura eliminata con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante l\'eliminazione della lettura' });
  }
});

module.exports = router;
