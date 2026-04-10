import React, { useState } from 'react';

const ITEMS = [
  { id: 1, label: 'Mango Tree', emoji: '🌳', correct: 'living' },
  { id: 2, label: 'Rock', emoji: '🪨', correct: 'nonliving' },
  { id: 3, label: 'Sparrow', emoji: '🐦', correct: 'living' },
  { id: 4, label: 'Chair', emoji: '🪑', correct: 'nonliving' },
  { id: 5, label: 'Earthworm', emoji: '🪱', correct: 'living' },
  { id: 6, label: 'Bicycle', emoji: '🚲', correct: 'nonliving' },
  { id: 7, label: 'Mushroom', emoji: '🍄', correct: 'living' },
  { id: 8, label: 'River Water', emoji: '💧', correct: 'nonliving' },
];

export default function SortingGame() {
  const [placed, setPlaced] = useState({ living: [], nonliving: [] });
  const [remaining, setRemaining] = useState(ITEMS);
  const [feedback, setFeedback] = useState({});
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [dragItem, setDragItem] = useState(null);

  const handleDrop = (zone) => {
    if (!dragItem) return;
    const isCorrect = dragItem.correct === zone;

    setFeedback(prev => ({ ...prev, [dragItem.id]: isCorrect ? 'correct' : 'wrong' }));
    setPlaced(prev => ({ ...prev, [zone]: [...prev[zone], { ...dragItem, isCorrect }] }));
    setRemaining(prev => prev.filter(i => i.id !== dragItem.id));

    if (isCorrect) setScore(s => s + 1);

    const newRemaining = remaining.filter(i => i.id !== dragItem.id);
    if (newRemaining.length === 0) {
      setTimeout(() => setCompleted(true), 600);
    }
    setDragItem(null);
  };

  const reset = () => {
    setPlaced({ living: [], nonliving: [] });
    setRemaining(ITEMS);
    setFeedback({});
    setCompleted(false);
    setScore(0);
    setDragItem(null);
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 800, color: '#6b7280', marginBottom: '8px' }}>
          Drag each item into the correct box!
        </div>
        {/* Draggable items */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', minHeight: '60px' }}>
          {remaining.map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragItem(item)}
              onDragEnd={() => setDragItem(null)}
              style={{
                background: 'white',
                border: `2.5px solid ${dragItem?.id === item.id ? '#7c3aed' : '#e5e7eb'}`,
                borderRadius: '50px',
                padding: '8px 18px',
                cursor: 'grab',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontWeight: 800, fontSize: '14px',
                boxShadow: dragItem?.id === item.id ? '0 8px 20px rgba(124,58,237,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                transform: dragItem?.id === item.id ? 'scale(1.08) rotate(-2deg)' : 'scale(1)',
                transition: 'all 0.2s',
                userSelect: 'none',
              }}
            >
              <span style={{ fontSize: '22px' }}>{item.emoji}</span>
              {item.label}
            </div>
          ))}
          {remaining.length === 0 && !completed && (
            <div style={{ color: '#6b7280', fontWeight: 700, fontSize: '14px', padding: '12px' }}>
              ✨ All items placed! Checking results...
            </div>
          )}
        </div>
      </div>

      {/* Drop zones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {[
          { key: 'living', label: 'Living Things ✅', bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', border: '#4ade80', emoji: '🌱' },
          { key: 'nonliving', label: 'Non-Living Things ❌', bg: 'linear-gradient(135deg, #fee2e2, #fecaca)', border: '#f87171', emoji: '🪨' },
        ].map(zone => (
          <div
            key={zone.key}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(zone.key)}
            style={{
              background: zone.bg,
              border: `2.5px dashed ${zone.border}`,
              borderRadius: '16px',
              padding: '16px',
              minHeight: '130px',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--dark-text)', marginBottom: '12px', textAlign: 'center' }}>
              {zone.emoji} {zone.label}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {placed[zone.key].map(item => (
                <div key={item.id} style={{
                  background: item.isCorrect ? '#16a34a' : '#ef4444',
                  color: 'white', borderRadius: '50px',
                  padding: '6px 14px', fontSize: '13px', fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  animation: 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                  <span>{item.emoji}</span> {item.label}
                  <span>{item.isCorrect ? '✓' : '✗'}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Completion */}
      {completed && (
        <div style={{
          background: score >= 6 ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #fef3c7, #fde68a)',
          borderRadius: '16px', padding: '24px', textAlign: 'center',
          border: `2px solid ${score >= 6 ? '#4ade80' : '#fbbf24'}`,
          animation: 'slideIn 0.4s ease'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>{score === 8 ? '🏆' : score >= 6 ? '🌟' : '💪'}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--dark-text)', marginBottom: '6px' }}>
            {score === 8 ? 'Perfect!' : score >= 6 ? 'Great Job!' : 'Good Try!'}
          </div>
          <div style={{ fontWeight: 700, color: '#374151', marginBottom: '16px' }}>
            You got <strong>{score}/8</strong> correct!
          </div>
          <button onClick={reset} style={{
            background: 'var(--green-primary)', color: 'white',
            border: 'none', borderRadius: '50px', padding: '10px 24px',
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', cursor: 'pointer'
          }}>
            🔄 Play Again
          </button>
        </div>
      )}
    </div>
  );
}
