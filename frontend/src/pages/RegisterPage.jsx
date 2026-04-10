import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AVATARS = [
  { id: 'star', emoji: '⭐', name: 'Star' },
  { id: 'rocket', emoji: '🚀', name: 'Rocket' },
  { id: 'plant', emoji: '🌱', name: 'Plant' },
  { id: 'animal', emoji: '🦋', name: 'Butterfly' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', password: '', avatar: 'star' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="float" style={{ fontSize: '80px', marginBottom: '24px' }}>🎓</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', color: 'white', marginBottom: '16px' }}>
            Join LearnQuest!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '17px', fontWeight: 600, maxWidth: '300px', lineHeight: 1.7 }}>
            Explore exciting science lessons, earn stars, and collect awesome badges! 🌟
          </p>
          <div style={{ marginTop: '40px', display: 'grid', gap: '12px', maxWidth: '280px' }}>
            {[
              { icon: '📚', text: '4 fun science lessons' },
              { icon: '🧠', text: 'Interactive quizzes' },
              { icon: '🏅', text: '7 unique badges to collect' },
              { icon: '📈', text: 'Track your progress' },
            ].map(item => (
              <div key={item.text} style={{
                background: 'rgba(255,255,255,0.12)', borderRadius: '12px',
                padding: '12px 16px', color: 'white', fontWeight: 700, fontSize: '14px',
                display: 'flex', gap: '10px', alignItems: 'center'
              }}>
                <span>{item.icon}</span> {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-card slide-up" style={{ maxWidth: '460px' }}>
          <h2 className="auth-title">Create Account 🌟</h2>
          <p className="auth-subtitle">Start your learning adventure today!</p>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px',
              padding: '12px 16px', color: '#b91c1c', fontWeight: 700, fontSize: '14px', marginBottom: '20px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input className="form-input" type="text" placeholder="e.g. Priya, Arjun, Kavya"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" type="text" placeholder="Choose a unique username"
                value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="At least 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Choose Your Avatar</label>
              <div className="avatar-grid">
                {AVATARS.map(av => (
                  <div key={av.id} className={`avatar-option ${form.avatar === av.id ? 'selected' : ''}`}
                    onClick={() => setForm({ ...form, avatar: av.id })}>
                    <span className="avatar-emoji">{av.emoji}</span>
                    <span className="avatar-name">{av.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full"
              style={{ justifyContent: 'center', marginTop: '8px' }} disabled={loading}>
              {loading ? '✨ Creating account...' : '🌱 Start Learning!'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#6b7280', fontWeight: 600 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--green-primary)', fontWeight: 800, textDecoration: 'none' }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
