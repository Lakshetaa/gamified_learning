const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'gamified_secret_key', { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, username, password, avatar } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ message: 'Name, username and password are required' });
    }
    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Username already taken!' });

    const user = new User({ name, username, password, avatar: avatar || 'star' });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, username: user.username, avatar: user.avatar,
        totalStars: user.totalStars, totalPoints: user.totalPoints, level: user.level, streak: user.streak }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username.toLowerCase() }).populate('badges');
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // Update streak
    const today = new Date().toDateString();
    const lastLogin = new Date(user.lastLoginDate).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastLogin === yesterday) {
      user.streak += 1;
    } else if (lastLogin !== today) {
      user.streak = 1;
    }
    user.lastLoginDate = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, username: user.username, avatar: user.avatar,
        totalStars: user.totalStars, totalPoints: user.totalPoints, level: user.level,
        streak: user.streak, badges: user.badges }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('badges').select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

module.exports = router;
