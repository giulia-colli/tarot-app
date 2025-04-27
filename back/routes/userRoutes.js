const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/authMiddleware');

// 🔐 Rotta protetta base /me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dei dati utente' });
  }
});

// 🔐 GET /profile → per la pagina ModificaProfilo
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username email avatar');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero del profilo' });
  }
});

// 🔐 PUT /update → aggiornamento dati utente (incluso avatar)
router.put('/update', protect, async (req, res) => {
  const { username, email, password, avatar } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    user.username = username || user.username;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;

    if (password && password.trim() !== '') {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({ message: 'Profilo aggiornato con successo' });
  } catch (err) {
    console.error('Errore aggiornamento profilo:', err);
    res.status(500).json({ message: 'Errore aggiornamento profilo' });
  }
});

// 🔐 DELETE /delete → elimina l'account utente
router.delete('/delete', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    res.json({ message: 'Profilo eliminato con successo' });
  } catch (err) {
    console.error('Errore eliminazione profilo:', err);
    res.status(500).json({ message: 'Errore eliminazione profilo' });
  }
});

module.exports = router;

