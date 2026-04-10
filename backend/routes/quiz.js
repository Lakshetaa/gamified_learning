const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const User = require('../models/User');
const Badge = require('../models/Badge');
const auth = require('../middleware/auth');

// POST /api/quiz/:lessonId/submit - Submit quiz answers
router.post('/:lessonId/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    let correct = 0;
    const results = lesson.quiz.map((q, i) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) correct++;
      return { question: q.question, selected: answers[i], correctIndex: q.correctIndex, isCorrect, explanation: q.explanation, emoji: q.emoji };
    });

    const score = Math.round((correct / lesson.quiz.length) * 100);
    const starsEarned = score >= 80 ? 3 : score >= 60 ? 2 : score >= 40 ? 1 : 0;
    const pointsEarned = Math.round((score / 100) * lesson.pointsReward * 0.5);

    // Update progress
    let progress = await Progress.findOne({ user: req.user.id, lesson: lesson._id });
    if (!progress) progress = new Progress({ user: req.user.id, lesson: lesson._id });
    progress.quizAttempts += 1;

    const user = await User.findById(req.user.id).populate('badges');
    const newBadges = [];

    if (score > progress.quizScore) {
      progress.quizScore = score;
      user.totalPoints += pointsEarned;
      if (starsEarned > (progress.starsEarned || 0)) {
        user.totalStars += (starsEarned - (progress.starsEarned || 0));
        progress.starsEarned = starsEarned;
      }
    }

    // ── Award quiz_star badge if scored 100% (any quiz, first time) ──────
    if (score === 100) {
      const alreadyHas = user.badges.some(b => b.name === 'quiz_star');
      if (!alreadyHas) {
        const badge = await Badge.findOne({ name: 'quiz_star' });
        if (badge) {
          user.badges.push(badge._id);
          user.totalPoints += (badge.pointsBonus || 0);
          newBadges.push({ name: badge.name, title: badge.title, emoji: badge.emoji });
        }
      }
    }

    user.updateLevel();
    await user.save();
    await progress.save();

    res.json({ score, correct, total: lesson.quiz.length, starsEarned, pointsEarned, results, newBadges });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting quiz', error: err.message });
  }
});

module.exports = router;
