const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gamified_secret_key');
    req.user = decoded;

    // ── Update streak on first activity each day ──────────────────────────
    // Only runs on non-auth routes to avoid interfering with login streak logic
    if (!req.path.startsWith('/auth')) {
      try {
        const user = await User.findById(decoded.id);
        if (user) {
          const today     = new Date().toDateString();
          const lastLogin = new Date(user.lastLoginDate).toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();

          if (lastLogin !== today) {
            // First activity of today — update streak
            if (lastLogin === yesterday) {
              user.streak += 1;   // consecutive day
            } else {
              user.streak = 1;    // gap — reset streak to 1
            }
            user.lastLoginDate = new Date();
            await user.save();
          }
        }
      } catch (streakErr) {
        // Never block the request if streak update fails
        console.error('Streak update error:', streakErr.message);
      }
    }
    // ─────────────────────────────────────────────────────────────────────

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
