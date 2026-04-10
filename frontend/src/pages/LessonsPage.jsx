import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/UI/Sidebar';
import { api } from '../context/AuthContext';

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Re-fetch every time this page is navigated to, so completion shows immediately
  useEffect(() => {
    setLoading(true);
    api.get('/lessons').then(res => {
      setLessons(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [location.key]);

  const isUnlocked = (index) => index === 0 || lessons[index - 1]?.progress?.completed;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{
              background: 'var(--green-pale)', borderRadius: '14px',
              padding: '8px 16px', fontSize: '13px', fontWeight: 800, color: 'var(--green-primary)'
            }}>
              🔬 Science • Grade 3
            </div>
          </div>
          <h1 className="page-title">📚 Chapter 1: Plants & Living Things</h1>
          <p className="page-subtitle">Complete each lesson to unlock the next one. Earn stars and badges!</p>
        </div>

        {/* Chapter Progress Bar */}
        <div className="card" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: 800, color: 'var(--dark-text)' }}>Chapter Progress</span>
            <span style={{ fontWeight: 800, color: 'var(--green-primary)' }}>
              {lessons.filter(l => l.progress?.completed).length}/{lessons.length} Lessons
            </span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{
              width: `${lessons.length ? (lessons.filter(l => l.progress?.completed).length / lessons.length) * 100 : 0}%`
            }}></div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <div className="loader" style={{ margin: '0 auto 16px' }}></div>
            Loading lessons...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {lessons.map((lesson, index) => {
              const unlocked = isUnlocked(index);
              const completed = lesson.progress?.completed;

              return (
                <div key={lesson._id}
                  className={`lesson-card ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}`}
                  style={{ borderColor: completed ? lesson.color : 'transparent' }}
                >
                  <Link to={unlocked ? `/lessons/${lesson._id}` : '#'} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'stretch' }}>
                      <div className="lesson-card-header" style={{ background: lesson.color }}>
                        <div className="lesson-number">Lesson {lesson.lessonNumber}</div>
                        <div style={{ fontSize: '52px', marginBottom: '10px' }}>{lesson.emoji}</div>
                        <div className="lesson-title">{lesson.title}</div>
                        <div className="lesson-subtitle">{lesson.subtitle}</div>
                      </div>
                      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '280px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span className={`difficulty-badge difficulty-${lesson.difficulty}`}>{lesson.difficulty}</span>
                            {!unlocked && <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 700 }}>🔒 Locked</span>}
                          </div>
                          <div className="stars-row" style={{ marginBottom: '12px' }}>
                            {[1,2,3].map(i => (
                              <span key={i} className={`star ${i <= (lesson.progress?.starsEarned || 0) ? '' : 'empty'}`}>⭐</span>
                            ))}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 600, marginBottom: '4px' }}>
                            🎯 {lesson.starsReward} stars • {lesson.pointsReward} points
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 600 }}>
                            ❓ {lesson.quiz?.length || 0} quiz questions
                          </div>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                          {completed ? (
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <span className="btn btn-secondary btn-sm">✅ Completed</span>
                              <Link to={`/lessons/${lesson._id}/quiz`}
                                className="btn btn-sm"
                                style={{ background: '#fef3c7', color: '#92400e' }}
                                onClick={e => e.stopPropagation()}>
                                🔄 Retry Quiz
                              </Link>
                            </div>
                          ) : unlocked ? (
                            <span className="btn btn-primary btn-sm">▶️ Start Lesson</span>
                          ) : (
                            <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 700 }}>
                              Complete previous lesson to unlock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
