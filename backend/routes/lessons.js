const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// GET /api/lessons - Get all lessons for chapter 1, grade 3
router.get('/', auth, async (req, res) => {
  try {
    const { chapter = 1, grade = 3 } = req.query;
    const lessons = await Lesson.find({ chapter, grade }).sort({ order: 1 });
    
    // Get user's progress for each lesson
    const progressList = await Progress.find({ user: req.user.id, lesson: { $in: lessons.map(l => l._id) } });
    const progressMap = {};
    progressList.forEach(p => { progressMap[p.lesson.toString()] = p; });

    const lessonsWithProgress = lessons.map(lesson => ({
      ...lesson.toObject(),
      progress: progressMap[lesson._id.toString()] || null
    }));

    res.json(lessonsWithProgress);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching lessons', error: err.message });
  }
});

// GET /api/lessons/:id - Get single lesson
router.get('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const progress = await Progress.findOne({ user: req.user.id, lesson: lesson._id });
    res.json({ ...lesson.toObject(), progress: progress || null });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching lesson', error: err.message });
  }
});

// POST /api/lessons/:id/start - Start a lesson
router.post('/:id/start', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    let progress = await Progress.findOne({ user: req.user.id, lesson: lesson._id });
    if (!progress) {
      progress = new Progress({ user: req.user.id, lesson: lesson._id, startedAt: new Date() });
      await progress.save();
    }
    res.json({ message: 'Lesson started!', progress });
  } catch (err) {
    res.status(500).json({ message: 'Error starting lesson', error: err.message });
  }
});

// POST /api/lessons/:id/complete - Mark lesson as complete
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const { timeSpent } = req.body;
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const User  = require('../models/User');
    const Badge = require('../models/Badge');

    // ── Shared badge-awarding helper (used in both paths) ─────────────────
    const awardMissingBadges = async (user) => {
      const newBadges = [];
      // Build earned set from name strings
      const populated = await User.findById(user._id).populate('badges');
      const earnedNames = populated.badges.map(b => b.name);

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

      // Award badges for THIS lesson
      const badgesToAward = Array.isArray(lesson.badgeUnlock)
        ? lesson.badgeUnlock
        : (lesson.badgeUnlock ? [lesson.badgeUnlock] : []);
      for (const b of badgesToAward) await awardBadge(b);

      // Also retroactively award badges for ALL previously completed lessons
      // This catches cases where the student completed a lesson before badges were seeded
      const allLessons = await Lesson.find({ chapter: lesson.chapter, grade: lesson.grade });
      const completedProgress = await Progress.find({
        user: user._id,
        lesson: { $in: allLessons.map(l => l._id) },
        completed: true
      }).populate('lesson');

      for (const prog of completedProgress) {
        if (!prog.lesson) continue;
        const lessonBadges = Array.isArray(prog.lesson.badgeUnlock)
          ? prog.lesson.badgeUnlock
          : (prog.lesson.badgeUnlock ? [prog.lesson.badgeUnlock] : []);
        for (const b of lessonBadges) await awardBadge(b);
      }

      // chapter_champion — all lessons complete?
      if (completedProgress.length >= allLessons.length) {
        await awardBadge('chapter_champion');
      }

      return newBadges;
    };
    // ─────────────────────────────────────────────────────────────────────

    // Check if already completed
    const existing = await Progress.findOne({ user: req.user.id, lesson: lesson._id });
    if (existing && existing.completed) {
      // Still run badge check — student may have completed before badges were seeded
      const user = await User.findById(req.user.id).populate('badges');
      const newBadges = await awardMissingBadges(user);
      if (newBadges.length > 0) await user.save();
      return res.json({
        alreadyCompleted: true,
        progress: existing,
        newBadges,
        user: { totalStars: user.totalStars, totalPoints: user.totalPoints, level: user.level }
      });
    }

    // First completion — save progress and award points
    const progress = await Progress.findOneAndUpdate(
      { user: req.user.id, lesson: lesson._id },
      {
        completed: true,
        starsEarned: lesson.starsReward,
        pointsEarned: lesson.pointsReward,
        completedAt: new Date(),
        timeSpent: timeSpent || 0
      },
      { upsert: true, new: true }
    );

    const user = await User.findById(req.user.id).populate('badges');
    user.totalStars  += lesson.starsReward;
    user.totalPoints += lesson.pointsReward;
    user.updateLevel();

    const newBadges = await awardMissingBadges(user);
    await user.save();

    res.json({
      alreadyCompleted: false,
      progress,
      starsEarned: lesson.starsReward,
      pointsEarned: lesson.pointsReward,
      newBadges,
      user: { totalStars: user.totalStars, totalPoints: user.totalPoints, level: user.level }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error completing lesson', error: err.message });
  }
});

module.exports = router;
