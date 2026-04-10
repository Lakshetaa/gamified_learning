const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/progress - Get user's overall progress
router.get('/', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id }).populate('lesson', 'title lessonNumber emoji starsReward pointsReward');
    const user = await User.findById(req.user.id).select('-password');
    const completed = progress.filter(p => p.completed).length;
    const totalStars = progress.reduce((sum, p) => sum + (p.starsEarned || 0), 0);
    res.json({ user, progress, stats: { completed, totalLessons: progress.length, totalStars } });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching progress', error: err.message });
  }
});

module.exports = router;
