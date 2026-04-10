import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/UI/Sidebar';
import { api } from '../context/AuthContext';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/lessons/${id}`).then(res => {
      setLesson(res.data);
      setAnswers(new Array(res.data.quiz.length).fill(null));
      setLoading(false);
    }).catch(() => navigate('/lessons'));
  }, [id]);

  if (loading || !lesson) return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader"></div>
      </main>
    </div>
  );

  const quiz = lesson.quiz || [];
  const q = quiz[currentQ];
  const progress = ((currentQ + 1) / quiz.length) * 100;

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentQ < quiz.length - 1) {
      setCurrentQ(p => p + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setSubmitting(true);
      try {
        const res = await api.post(`/quiz/${id}/submit`, { answers });
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#d97706';
    return '#dc2626';
  };

  const getScoreEmoji = (score) => {
    if (score === 100) return '🏆';
    if (score >= 80) return '🌟';
    if (score >= 60) return '😊';
    return '💪';
  };

  const getScoreMessage = (score) => {
    if (score === 100) return "Perfect Score! You're a Science Champion!";
    if (score >= 80) return 'Excellent! You really know your plants!';
    if (score >= 60) return 'Good job! Keep practicing!';
    return "Don't give up! Review the lesson and try again!";
  };

  // ── Results screen ─────────────────────────────────────────────────────────
  if (results) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="quiz-container">
            <div className="results-card">

              {/* Score circle */}
              <div
                className="results-score-circle"
                style={{
                  background: `conic-gradient(${getScoreColor(results.score)} ${results.score * 3.6}deg, #e5e7eb 0deg)`,
                  boxShadow: `0 0 0 8px white, 0 0 0 10px ${getScoreColor(results.score)}30`
                }}
              >
                <div style={{
                  position: 'absolute', inset: '10px', borderRadius: '50%',
                  background: 'white', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: getScoreColor(results.score) }}>
                    {results.score}%
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>score</div>
                </div>
              </div>

              {/* Title */}
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>{getScoreEmoji(results.score)}</div>
              <h2 className="results-title">{getScoreMessage(results.score)}</h2>
              <p className="results-subtitle">{results.correct} out of {results.total} correct answers</p>

              {/* Stars */}
              <div className="results-stars">
                {[1, 2, 3].map(i => (
                  <span key={i} className="results-star">
                    {i <= results.starsEarned ? '⭐' : '☆'}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div style={{ background: '#f9fafb', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#fbbf24' }}>
                      {results.starsEarned}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>Stars</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#7c3aed' }}>
                      +{results.pointsEarned}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>Points</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#16a34a' }}>
                      {results.correct}/{results.total}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>Correct</div>
                  </div>
                </div>
              </div>

              {/* Badge unlocked notification */}
              {results.newBadges?.length > 0 && (
                <div style={{
                  background: '#fef3c7', borderRadius: '16px', padding: '16px 20px',
                  marginBottom: '20px', border: '2px solid #fbbf24', textAlign: 'center'
                }}>
                  <div style={{ fontWeight: 900, fontSize: '13px', color: '#92400e', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🏅 Badge{results.newBadges.length > 1 ? 's' : ''} Unlocked!
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {results.newBadges.map(b => (
                      <div key={b.name} style={{ textAlign: 'center', background: 'white', borderRadius: '12px', padding: '10px 16px', border: '2px solid #fbbf24' }}>
                        <div style={{ fontSize: '32px' }}>{b.emoji}</div>
                        <div style={{ fontWeight: 800, fontSize: '12px', color: '#92400e', marginTop: '4px' }}>{b.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Answer Review */}
              <div style={{ textAlign: 'left', marginBottom: '28px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--dark-text)', marginBottom: '14px' }}>
                  📋 Answer Review
                </h3>
                {results.results.map((r, i) => (
                  <div key={i} style={{
                    background: r.isCorrect ? 'var(--green-pale)' : '#fee2e2',
                    borderRadius: '12px', padding: '14px 16px', marginBottom: '10px',
                    border: `2px solid ${r.isCorrect ? '#4ade80' : '#fca5a5'}`
                  }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '20px' }}>{r.isCorrect ? '✅' : '❌'}</span>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--dark-text)', flex: 1 }}>
                        {r.question}
                      </div>
                    </div>
                    {!r.isCorrect && (
                      <div style={{ fontSize: '13px', color: '#15803d', fontWeight: 700, marginLeft: '30px' }}>
                        ✨ {r.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={() => {
                  setResults(null);
                  setCurrentQ(0);
                  setAnswers(new Array(quiz.length).fill(null));
                  setSelected(null);
                  setRevealed(false);
                }}>
                  🔄 Try Again
                </button>
                <Link to="/lessons" className="btn btn-primary">📚 More Lessons →</Link>
                <Link to="/badges" className="btn" style={{ background: '#fef3c7', color: '#92400e' }}>🏅 My Badges</Link>
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Quiz question screen ───────────────────────────────────────────────────
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="quiz-container">

          {/* Quiz Header */}
          <div className="quiz-header-card">
            <Link to={`/lessons/${id}`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'block', marginBottom: '12px' }}>
              ← Back to Lesson
            </Link>
            <div className="quiz-title">🧠 {lesson.title} — Quiz</div>
            <div className="quiz-meta">Test your knowledge and earn stars!</div>
            <div className="quiz-progress-row">
              <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="quiz-counter">❓ {currentQ + 1}/{quiz.length}</div>
            </div>
          </div>

          {/* Question Card */}
          <div className="question-card">
            <span className="question-emoji">{q.emoji || '❓'}</span>
            <div className="question-text">
              Q{currentQ + 1}. {q.question}
            </div>

            <div className="options-grid">
              {q.options.map((opt, i) => {
                let cls = 'option-btn';
                if (revealed) {
                  if (i === q.correctIndex) cls += ' correct';
                  else if (i === selected && i !== q.correctIndex) cls += ' wrong';
                } else if (i === selected) cls += ' selected';

                return (
                  <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={revealed}>
                    <div
                      className={`option-letter ${revealed && i === q.correctIndex ? 'correct' : ''}`}
                      style={{
                        background:
                          revealed && i === q.correctIndex ? 'var(--green-primary)' :
                          revealed && i === selected && i !== q.correctIndex ? '#ef4444' :
                          i === selected ? '#7c3aed' : '#e5e7eb',
                        color:
                          (revealed && i === q.correctIndex) || (revealed && i === selected) || i === selected
                            ? 'white' : '#6b7280'
                      }}
                    >
                      {OPTION_LETTERS[i]}
                    </div>
                    {opt}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className="explanation-box">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '20px' }}>{selected === q.correctIndex ? '🎉' : '💡'}</span>
                  <p className="explanation-text">
                    <strong>{selected === q.correctIndex ? 'Correct! ' : 'The right answer is: '}</strong>
                    {q.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Next / Submit button */}
          {revealed && (
            <div style={{ textAlign: 'right' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleNext}
                disabled={submitting}
              >
                {submitting ? '⏳ Calculating...' :
                  currentQ < quiz.length - 1 ? 'Next Question →' : '🏆 See Results!'}
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
