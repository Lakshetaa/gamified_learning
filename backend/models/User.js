const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  grade: { type: Number, default: 3 },
  avatar: { type: String, default: 'star' }, // star, rocket, plant, animal
  totalStars: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastLoginDate: { type: Date, default: Date.now },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update level based on points
userSchema.methods.updateLevel = function() {
  const thresholds = [0, 100, 250, 500, 1000, 2000];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (this.totalPoints >= thresholds[i]) {
      this.level = i + 1;
      break;
    }
  }
};

module.exports = mongoose.model('User', userSchema);
