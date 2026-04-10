import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="float" style={{ fontSize: '80px', marginBottom: '24px' }}>🌱</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: 'white', marginBottom: '12px' }}>
            LearnQuest
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', fontWeight: 600, maxWidth: '320px', lineHeight: 1.6 }}>
            A fun learning adventure for curious young minds! 🚀
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
            {['🌿 Learn', '⭐ Earn Stars', '🏅 Get Badges'].map(item => (
              <div key={item} style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '12px', padding: '10px 16px',
                color: 'white', fontSize: '13px', fontWeight: 800
              }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-card slide-up">
          <h2 className="auth-title">Welcome back! 👋</h2>
          <p className="auth-subtitle">Sign in to continue your learning journey</p>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px',
              padding: '12px 16px', color: '#b91c1c', fontWeight: 700, fontSize: '14px', marginBottom: '20px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? '✨ Signing in...' : '🚀 Let\'s Go!'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#6b7280', fontWeight: 600 }}>
            New explorer?{' '}
            <Link to="/register" style={{ color: 'var(--green-primary)', fontWeight: 800, textDecoration: 'none' }}>
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
