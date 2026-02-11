const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';

// ─── Helper: generate JWT ────────────────────────────────
const generateToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });

// ─── POST /api/auth/signup ───────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name: name || 'User',
      email: email.toLowerCase().trim(),
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error('[signup]', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// ─── POST /api/auth/login ────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ─── GET /api/auth/me (protected — verify token) ────────
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
