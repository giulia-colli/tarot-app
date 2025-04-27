const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ REGISTER
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email già registrata' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin || false,
        avatar: user.avatar || '',
      },
    });
  } catch (err) {
    console.error('ERRORE REGISTRAZIONE:', err);
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
};

// ✅ LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utente non trovato' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password errata' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin || false,
        avatar: user.avatar || '',
      },
    });
  } catch (err) {
    console.error('ERRORE LOGIN:', err);
    res.status(500).json({ message: 'Errore durante il login' });
  }
};

// ✅ GOOGLE LOGIN
const googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        password: 'google-auth',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin || false,
        avatar: user.avatar || '',
      },
    });
  } catch (err) {
    console.error('ERRORE GOOGLE LOGIN:', err);
    res.status(401).json({ message: 'Autenticazione Google fallita' });
  }
};

module.exports = { register, login, googleLogin };

