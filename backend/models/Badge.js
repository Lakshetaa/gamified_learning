const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  emoji: { type: String, required: true },
  color: { type: String, default: '#fbbf24' },
  type: { type: String, enum: ['lesson', 'quiz', 'streak', 'stars', 'special'], default: 'lesson' },
  condition: { type: String }, // description of how to earn
  pointsBonus: { type: Number, default: 0 }
});

module.exports = mongoose.model('Badge', badgeSchema);
