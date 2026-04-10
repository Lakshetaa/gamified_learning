import React, { useState } from 'react';

const PLANTS = [
  { id: 'rice', name: 'Rice', emoji: '🌾', use: 'food' },
  { id: 'cotton', name: 'Cotton', emoji: '🌸', use: 'clothing' },
  { id: 'neem', name: 'Neem', emoji: '🌿', use: 'medicine' },
  { id: 'bamboo', name: 'Bamboo', emoji: '🎋', use: 'shelter' },
  { id: 'mango', name: 'Mango', emoji: '🥭', use: 'food' },
  { id: 'tulsi', name: 'Tulsi', emoji: '🍀', use: 'medicine' },
  { id: 'teak', name: 'Teak Wood', emoji: '🪵', use: 'shelter' },
  { id: 'jute', name: 'Jute', emoji: '🧵', use: 'clothing' },
];

const USES = [
  { id: 'food', label: 'Food 🍽️', color: '#16a34a', bg: '#dcfce7', border: '#4ade80' },
  { id: 'clothing', label: 'Clothing 👕', color: '#2563eb', bg: '#dbeafe', border: '#93c5fd' },
  { id: 'medicine', label: 'Medicine 💊', color: '#7c3aed', bg: '#ede9fe', border: '#a78bfa' },
  { id: 'shelter', label: 'Shelter 🏠', color: '#d97706', bg: '#fef3c7', border: '#fbbf24' },
];

export default function PlantUseGame({ onComplete }) {
  const [matches, setMatches] = useState({});
  const [selected, setSelected] = useState(null); // selected plant id
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handlePlantClick = (id) => {
    if (submitted || matches[id]) return;
    setSelected(id);
  };

  const handleUseClick = (useId) => {
    if (!selected || submitted) return;
    setMatches(p => ({ ...p, [selected]: useId }));
    setSelected(null);
  };

  const handleSubmit = () => {
    let correct = 0;
    PLANTS.forEach(p => { if (matches[p.id] === p.use) correct++; });
    setScore(correct);
    setSubmitted(true);
    if (onComplete) onComplete(Math.round((correct / PLANTS.length) * 100));
  };

  const unmatched = PLANTS.filter(p => !matches[p.id]);
  const matched = PLANTS.filter(p => matches[p.id]);

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
        borderRadius: '20px', padding: '28px',
        border: '2px solid #fbbf24'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>🎯</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#78350f', marginBottom: '4px' }}>
            Match Plants to Their Uses!
          </h3>
          <p style={{ color: '#92400e', fontWeight: 600, fontSize: '14px' }}>
            Click a plant, then click the correct use category. Match all 8!
          </p>
        </div>

        {/* Plants grid */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 900, color: '#92400e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            🌱 Plants — Click one to select it
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {PLANTS.map(plant => {
              const isMatched = !!matches[plant.id];
              const isSelected = selected === plant.id;
              const use = USES.find(u => u.id === plant.use);
              let borderColor = '#fbbf24';
              let bg = 'white';
              if (isSelected) { borderColor = '#f97316'; bg = '#fff7ed'; }
              if (isMatched && submitted) {
                const correct = matches[plant.id] === plant.use;
                borderColor = correct ? '#16a34a' : '#ef4444';
                bg = correct ? '#dcfce7' : '#fee2e2';
              }
              if (isMatched && !submitted) {
                borderColor = USES.find(u => u.id === matches[plant.id])?.color || '#fbbf24';
                bg = USES.find(u => u.id === matches[plant.id])?.bg || 'white';
              }

              return (
                <div
                  key={plant.id}
                  onClick={() => !submitted && !isMatched ? handlePlantClick(plant.id) : null}
                  style={{
                    background: bg, borderRadius: '12px', padding: '12px 8px',
                    border: `2.5px solid ${borderColor}`,
                    textAlign: 'center', cursor: isMatched || submitted ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: isSelected ? '0 4px 12px rgba(249,115,22,0.35)' : 'none',
                    opacity: isMatched && !submitted ? 0.75 : 1
                  }}
                >
                  <div style={{ fontSize: '26px', marginBottom: '4px' }}>{plant.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: '12px', color: '#374151' }}>{plant.name}</div>
                  {isMatched && (
                    <div style={{ fontSize: '10px', fontWeight: 700, color: borderColor, marginTop: '2px' }}>
                      {submitted ? (matches[plant.id] === plant.use ? '✅' : `❌ → ${use?.label}`) : '✓ matched'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Use categories */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 900, color: '#92400e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            {selected ? `👆 Now click where "${PLANTS.find(p=>p.id===selected)?.name}" belongs` : '📦 Use Categories'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {USES.map(use => (
              <div
                key={use.id}
                onClick={() => handleUseClick(use.id)}
                style={{
                  background: use.bg, borderRadius: '12px', padding: '14px 16px',
                  border: `2.5px solid ${selected ? use.color : use.border}`,
                  cursor: selected ? 'pointer' : 'default',
                  transition: 'all 0.15s',
                  transform: selected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: selected ? `0 4px 14px ${use.color}30` : 'none'
                }}
              >
                <div style={{ fontWeight: 900, color: use.color, fontSize: '15px' }}>{use.label}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginTop: '4px' }}>
                  {PLANTS.filter(p => matches[p.id] === use.id).map(p => p.emoji).join(' ') || 'Nothing matched yet'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        {!submitted ? (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleSubmit}
              disabled={matched.length < PLANTS.length}
              style={{
                background: matched.length === PLANTS.length
                  ? 'linear-gradient(135deg, #d97706, #b45309)'
                  : '#e5e7eb',
                color: matched.length === PLANTS.length ? 'white' : '#9ca3af',
                border: 'none', borderRadius: '50px', padding: '14px 36px',
                fontFamily: 'var(--font-body)', fontWeight: 900, fontSize: '16px',
                cursor: matched.length === PLANTS.length ? 'pointer' : 'not-allowed',
                boxShadow: matched.length === PLANTS.length ? '0 4px 15px rgba(217,119,6,0.4)' : 'none'
              }}
            >
              {matched.length < PLANTS.length ? `Match ${PLANTS.length - matched.length} more...` : '🎯 Check Answers!'}
            </button>
          </div>
        ) : (
          <div style={{
            background: score >= 6 ? '#dcfce7' : '#fef3c7',
            borderRadius: '14px', padding: '18px', textAlign: 'center',
            border: `2px solid ${score >= 6 ? '#4ade80' : '#fbbf24'}`
          }}>
            <div style={{ fontSize: '36px', marginBottom: '6px' }}>
              {score === 8 ? '🏆' : score >= 6 ? '⭐' : '💪'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#14532d' }}>
              {score}/8 Correct!
            </div>
            <div style={{ color: '#166534', fontWeight: 600, fontSize: '13px', marginTop: '4px' }}>
              {score === 8 ? 'Perfect! You know all the ways plants help us!' :
               'Review the lesson to learn more about how plants are used.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
