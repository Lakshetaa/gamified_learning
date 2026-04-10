const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  completed: { type: Boolean, default: false },
  starsEarned: { type: Number, default: 0 },
  pointsEarned: { type: Number, default: 0 },
  quizScore: { type: Number, default: 0 }, // percentage
  quizAttempts: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // seconds
  completedAt: { type: Date },
  startedAt: { type: Date, default: Date.now }
});

progressSchema.index({ user: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
