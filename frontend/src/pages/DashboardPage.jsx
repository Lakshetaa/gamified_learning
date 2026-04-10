import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/UI/Sidebar';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';

const LEVEL_NAMES = ['', 'Seedling', 'Sprout', 'Sapling', 'Tree', 'Forest Guardian', 'Nature Master'];
const LEVEL_COLORS = ['', '#4ade80', '#22c55e', '#16a34a', '#7c3aed', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Re-fetch on every navigation so progress is always fresh
  useEffect(() => {
    api.get('/lessons').then(res => {
      setLessons(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [location.key]);

  const completed = lessons.filter(l => l.progress?.completed).length;
  const totalStars = lessons.reduce((s, l) => s + (l.progress?.starsEarned || 0), 0);
  const nextLesson = lessons.find(l => !l.progress?.completed);

  const levelProgress = Math.min(((user?.totalPoints || 0) / (100 * (user?.level || 1))) * 100, 100);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {/* Welcome Header */}
        <div style={{
          background: 'linear-gradient(135deg, #14532d 0%, #15803d 60%, #4ade80 100%)',
          borderRadius: '24px', padding: '36px 40px', marginBottom: '28px',
          position: 'relative', overflow: 'hidden', color: 'white'
        }}>
          <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)',
            fontSize: '100px', opacity: 0.15 }}>🌿</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="level-badge" style={{ marginBottom: '12px', display: 'inline-flex' }}>
              ⚡ Level {user?.level} — {LEVEL_NAMES[user?.level] || 'Explorer'}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '6px' }}>
              Hello, {user?.name}! 👋
            </h1>
            <p style={{ opacity: 0.85, fontWeight: 600, fontSize: '16px', marginBottom: '20px' }}>
              Ready for today's science adventure? Let's explore plants and living things!
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              {nextLesson ? (
                <Link to={`/lessons/${nextLesson._id}`} className="btn" style={{
                  background: 'white', color: 'var(--green-primary)'
                }}>
                  ▶️ Continue: {nextLesson.title}
                </Link>
              ) : (
                <Link to="/lessons" className="btn" style={{ background: 'white', color: 'var(--green-primary)' }}>
                  📚 Review Lessons
                </Link>
              )}
              {user?.streak > 0 && (
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50px',
                  padding: '10px 18px', fontWeight: 800, fontSize: '14px' }}>
                  🔥 {user.streak} day streak!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { icon: '⭐', value: user?.totalStars || 0, label: 'Stars Earned', color: '#fbbf24' },
            { icon: '📚', value: `${completed}/${lessons.length}`, label: 'Lessons Done', color: '#4ade80' },
            { icon: '🎯', value: user?.totalPoints || 0, label: 'Total Points', color: '#7c3aed' },
            { icon: '🔥', value: user?.streak || 0, label: 'Day Streak', color: '#f97316' },
          ].map(stat => (
            <div key={stat.label} className="stat-card fade-in">
              <span className="stat-card-icon">{stat.icon}</span>
              <div className="stat-card-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="stat-card-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Level Progress */}
        <div className="card" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--dark-text)' }}>
                Level Progress
              </div>
              <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: 600 }}>
                {user?.totalPoints} / {100 * (user?.level || 1)} points to Level {(user?.level || 1) + 1}
              </div>
            </div>
            <div className="level-badge">⚡ Level {user?.level}</div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${levelProgress}%` }}></div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Chapter Progress */}
          <div className="card">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--dark-text)', marginBottom: '20px' }}>
              📖 Chapter 1 Progress
            </h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading lessons...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {lessons.map((lesson, i) => (
                  <Link key={lesson._id} to={`/lessons/${lesson._id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 16px', borderRadius: '14px',
                      background: lesson.progress?.completed ? 'var(--green-pale)' : '#f9fafb',
                      border: `2px solid ${lesson.progress?.completed ? 'rgba(74,222,128,0.4)' : '#e5e7eb'}`,
                      transition: 'all 0.2s', cursor: 'pointer'
                    }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: lesson.progress?.completed ? 'var(--green-primary)' : '#e5e7eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', flexShrink: 0
                      }}>
                        {lesson.progress?.completed ? '✅' : lesson.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: 'var(--dark-text)', fontSize: '14px' }}>{lesson.title}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>
                          {lesson.progress?.completed
                            ? `⭐ ${lesson.progress.starsEarned} stars earned`
                            : 'Not started yet'}
                        </div>
                      </div>
                      <div style={{ fontSize: '20px' }}>{lesson.progress?.completed ? '🏆' : '→'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '2px solid #fbbf24' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#78350f', marginBottom: '10px' }}>
                🌟 Chapter 1: Plants & Living Things
              </h3>
              <p style={{ color: '#92400e', fontWeight: 600, fontSize: '14px', lineHeight: 1.6 }}>
                Discover the amazing world of plants! Learn what makes things alive, explore plant parts, 
                how seeds grow, and how plants help us every day.
              </p>
              <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['🌍 Living Things', '🌿 Plant Parts', '🌱 Seeds', '🍎 Plants & Us'].map(tag => (
                  <span key={tag} style={{
                    background: 'rgba(255,255,255,0.6)', padding: '4px 12px', borderRadius: '50px',
                    fontSize: '12px', fontWeight: 800, color: '#78350f'
                  }}>{tag}</span>
                ))}
              </div>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', border: '2px solid #a78bfa' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#4c1d95', marginBottom: '10px' }}>
                🏅 Badges Available
              </h3>
              <p style={{ color: '#5b21b6', fontWeight: 600, fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }}>
                Complete lessons and quizzes to unlock 7 special badges!
              </p>
              <Link to="/badges" className="btn btn-sm" style={{ background: '#7c3aed', color: 'white' }}>
                View All Badges →
              </Link>
            </div>

            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎯</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--dark-text)', marginBottom: '4px' }}>
                {completed === lessons.length && lessons.length > 0 ? 'All Done! 🏆' : 'Keep Going!'}
              </div>
              <div style={{ color: 'var(--mid-text)', fontWeight: 600, fontSize: '14px' }}>
                {completed}/{lessons.length} lessons completed
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
