import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/UI/Sidebar';
import { api } from '../context/AuthContext';

export default function BadgesPage() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Re-fetch every time this page is visited so newly earned badges show up
  useEffect(() => {
    setLoading(true);
    // First sync (retroactively awards any badges earned before this fix),
    // then fetch the updated badge list
    api.post('/badges/sync')
      .catch(() => {}) // non-blocking — ignore errors
      .finally(() => {
        api.get('/badges').then(res => {
          setBadges(res.data);
          setLoading(false);
        }).catch(() => setLoading(false));
      });
  }, [location.key]);

  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">🏅 My Badge Collection</h1>
          <p className="page-subtitle">Complete lessons and quizzes to earn these awesome badges!</p>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: 1, textAlign: 'center', minWidth: '150px', background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '2px solid #fbbf24' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏅</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#78350f' }}>{earned.length}</div>
            <div style={{ fontWeight: 700, color: '#92400e', fontSize: '13px' }}>Badges Earned</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔒</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--dark-text)' }}>{locked.length}</div>
            <div style={{ fontWeight: 700, color: '#6b7280', fontSize: '13px' }}>Still to Unlock</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', minWidth: '150px', background: 'var(--green-pale)', border: '2px solid var(--green-light)' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>📊</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--green-primary)' }}>
              {badges.length ? Math.round((earned.length / badges.length) * 100) : 0}%
            </div>
            <div style={{ fontWeight: 700, color: 'var(--mid-text)', fontSize: '13px' }}>Collection Complete</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}><div className="loader" style={{ margin: '0 auto' }}></div></div>
        ) : (
          <>
            {earned.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--dark-text)', marginBottom: '16px' }}>
                  ✨ Earned Badges
                </h2>
                <div className="card-grid">
                  {earned.map(badge => (
                    <div key={badge._id} className="badge-card" style={{ border: `3px solid ${badge.color}30` }}>
                      <span className="badge-earned-label">✅ Earned</span>
                      <span className="badge-emoji">{badge.emoji}</span>
                      <div className="badge-title">{badge.title}</div>
                      <div className="badge-desc">{badge.description}</div>
                      {badge.pointsBonus > 0 && (
                        <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: 800, color: badge.color }}>
                          +{badge.pointsBonus} bonus points
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {locked.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--dark-text)', marginBottom: '16px' }}>
                  🔒 Badges to Unlock
                </h2>
                <div className="card-grid">
                  {locked.map(badge => (
                    <div key={badge._id} className="badge-card locked">
                      <span className="badge-emoji">{badge.emoji}</span>
                      <div className="badge-title">{badge.title}</div>
                      <div className="badge-desc">{badge.description}</div>
                      <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: 800, color: '#9ca3af' }}>
                        🔒 {badge.condition}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {badges.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>🏅</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '8px' }}>No badges yet!</div>
                <div style={{ fontWeight: 600 }}>Complete lessons to start earning badges.</div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
