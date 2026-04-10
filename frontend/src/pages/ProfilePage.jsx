import React, { useState, useEffect } from 'react';
import Sidebar from '../components/UI/Sidebar';
import { useAuth, api } from '../context/AuthContext';

const AVATARS = { star: '⭐', rocket: '🚀', plant: '🌱', animal: '🦋' };
const LEVEL_NAMES = ['', 'Seedling', 'Sprout', 'Sapling', 'Tree', 'Forest Guardian', 'Nature Master'];

export default function ProfilePage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    api.get('/progress').then(res => setProgress(res.data)).catch(() => {});
  }, []);

  const completedLessons = progress?.progress?.filter(p => p.completed) || [];
  const avgScore = completedLessons.length
    ? Math.round(completedLessons.reduce((s, p) => s + (p.quizScore || 0), 0) / completedLessons.length)
    : 0;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">👤 My Profile</h1>
          <p className="page-subtitle">Your learning journey and achievements</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Profile Card */}
          <div className="card" style={{ textAlign: 'center', padding: '40px 28px' }}>
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%', margin: '0 auto 16px',
              background: 'linear-gradient(135deg, var(--green-pale), #bbf7d0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '48px', border: '3px solid var(--green-light)'
            }}>
              {AVATARS[user?.avatar] || '⭐'}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--dark-text)', marginBottom: '4px' }}>
              {user?.name}
            </h2>
            <div style={{ color: '#6b7280', fontWeight: 600, marginBottom: '16px' }}>@{user?.username}</div>
            <div className="level-badge" style={{ justifyContent: 'center', marginBottom: '20px' }}>
              ⚡ Level {user?.level} — {LEVEL_NAMES[user?.level] || 'Explorer'}
            </div>
            {user?.streak > 0 && (
              <div style={{ background: '#fff7ed', border: '2px solid #fed7aa', borderRadius: '12px', padding: '12px', marginBottom: '20px' }}>
                <div style={{ fontSize: '28px' }}>🔥</div>
                <div style={{ fontWeight: 800, color: '#9a3412', fontSize: '15px' }}>{user.streak} Day Streak!</div>
                <div style={{ fontSize: '12px', color: '#c2410c', fontWeight: 600 }}>Keep it going!</div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { icon: '⭐', val: user?.totalStars || 0, label: 'Stars' },
                { icon: '🎯', val: user?.totalPoints || 0, label: 'Points' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--green-pale)', borderRadius: '12px', padding: '14px 8px' }}>
                  <div style={{ fontSize: '24px' }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--dark-text)' }}>{s.val}</div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--dark-text)', marginBottom: '20px' }}>
                📊 Learning Stats
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                {[
                  { icon: '✅', val: completedLessons.length, label: 'Lessons Done', color: '#4ade80' },
                  { icon: '🧠', val: `${avgScore}%`, label: 'Avg Quiz Score', color: '#7c3aed' },
                  { icon: '⏱️', val: completedLessons.reduce((s, p) => s + (p.timeSpent || 0), 0) + 's', label: 'Time Learning', color: '#f59e0b' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#f9fafb', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '30px', marginBottom: '8px' }}>{s.icon}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lesson History */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--dark-text)', marginBottom: '20px' }}>
                📖 Lesson History
              </h3>
              {completedLessons.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280', fontWeight: 600 }}>
                  No lessons completed yet. Start learning! 🌱
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {completedLessons.map(p => (
                    <div key={p._id} style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 16px', background: 'var(--green-pale)',
                      borderRadius: '14px', border: '2px solid rgba(74,222,128,0.3)'
                    }}>
                      <span style={{ fontSize: '28px' }}>{p.lesson?.emoji || '📚'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: 'var(--dark-text)' }}>{p.lesson?.title}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginTop: '2px' }}>
                          Quiz: {p.quizScore || 0}% • {p.starsEarned || 0} stars • {p.pointsEarned || 0} points
                        </div>
                      </div>
                      <div className="stars-row">
                        {[1,2,3].map(i => (
                          <span key={i} style={{ fontSize: '16px' }}>{i <= (p.starsEarned || 0) ? '⭐' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
