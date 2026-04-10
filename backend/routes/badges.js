const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// GET /api/badges - Get all badges with earned status
router.get('/', auth, async (req, res) => {
  try {
    const badges = await Badge.find();
    const user = await User.findById(req.user.id).populate('badges');
    const earned = user.badges.map(b => b._id.toString());
    const badgesWithStatus = badges.map(b => ({ ...b.toObject(), earned: earned.includes(b._id.toString()) }));
    res.json(badgesWithStatus);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching badges', error: err.message });
  }
});

// POST /api/badges/sync - Retroactively award all badges the user has earned
// Call this once to fix badges for users who completed lessons before badge logic was added
router.post('/sync', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('badges');
    const earnedNames = user.badges.map(b => b.name);
    const newBadges = [];

    const awardBadge = async (badgeName) => {
      if (!badgeName || earnedNames.includes(badgeName)) return;
      const badge = await Badge.findOne({ name: badgeName });
      if (badge) {
        user.badges.push(badge._id);
        user.totalPoints += (badge.pointsBonus || 0);
        newBadges.push({ name: badge.name, title: badge.title, emoji: badge.emoji });
        earnedNames.push(badgeName);
      }
    };

    // Find all completed lessons for this user
    const allLessons = await Lesson.find({ grade: 3, chapter: 1 });
    const completedProgress = await Progress.find({
      user: req.user.id,
      lesson: { $in: allLessons.map(l => l._id) },
      completed: true
    });

    // Award badges for each completed lesson
    for (const prog of completedProgress) {
      const lesson = allLessons.find(l => l._id.toString() === prog.lesson.toString());
      if (!lesson) continue;
      const badges = Array.isArray(lesson.badgeUnlock)
        ? lesson.badgeUnlock
        : (lesson.badgeUnlock ? [lesson.badgeUnlock] : []);
      for (const b of badges) await awardBadge(b);
    }

    // streak_3 badge
    if (user.streak >= 3) await awardBadge('streak_3');

    // chapter_champion
    if (completedProgress.length >= allLessons.length) await awardBadge('chapter_champion');

    user.updateLevel();
    await user.save();

    res.json({ message: 'Badges synced!', newBadges, totalBadges: user.badges.length });
  } catch (err) {
    res.status(500).json({ message: 'Error syncing badges', error: err.message });
  }
});

module.exports = router;
