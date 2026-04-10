const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  subject: { type: String, default: 'Science' },
  grade: { type: Number, default: 3 },
  chapter: { type: Number, default: 1 },
  chapterTitle: { type: String, default: 'Plants & Living Things' },
  lessonNumber: { type: Number, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  emoji: { type: String, default: '🌱' },
  color: { type: String, default: '#4ade80' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  starsReward: { type: Number, default: 3 },
  pointsReward: { type: Number, default: 50 },
  content: [{
    type: { type: String, enum: ['intro', 'concept', 'fact', 'activity', 'summary'], required: true },
    title: String,
    text: String,
    emoji: String,
    image: String,
    funFact: String,
    gameType: { type: String, enum: ['sort', 'label', 'sequence', 'match', null], default: null },
    items: [{ label: String, description: String, emoji: String }]
  }],
  quiz: [{
    question: String,
    options: [String],
    correctIndex: Number,
    explanation: String,
    emoji: String
  }],
  badgeUnlock: [{ type: String }], // array of badge names unlocked on completion
  order: { type: Number, required: true }
});

module.exports = mongoose.model('Lesson', lessonSchema);
