import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AVATARS = {
  star: '⭐', rocket: '🚀', plant: '🌱', animal: '🦋'
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: '🏠', label: 'Home' },
    { to: '/lessons', icon: '📚', label: 'Lessons' },
    { to: '/badges', icon: '🏅', label: 'My Badges' },
    { to: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🌱</span>
        <div>
          <div className="logo-text">LearnQuest</div>
          <div className="logo-sub">Grade 3 Science</div>
        </div>
      </div>

      <div className="nav-section-label">Menu</div>
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}

      <button
        onClick={handleLogout}
        className="nav-link"
        style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px',
          color: 'rgba(255,255,255,0.5)', width: '100%', textAlign: 'left' }}
      >
        <span className="nav-icon">🚪</span>
        Logout
      </button>

      {user && (
        <div className="sidebar-user">
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
            {AVATARS[user.avatar] || '⭐'}
          </div>
          <div className="user-name">{user.name}</div>
          <div className="user-level">Level {user.level} Explorer</div>
          <div className="user-stars">⭐ {user.totalStars} stars • {user.totalPoints} pts</div>
          {user.streak > 0 && (
            <div style={{ color: '#fb923c', fontSize: '12px', fontWeight: 700, marginTop: '4px' }}>
              🔥 {user.streak} day streak!
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
