import React, { useState } from 'react';

const ITEMS = [
  { id: 'mango', label: 'Mango Tree', emoji: '🥭', isLiving: true },
  { id: 'bicycle', label: 'Bicycle', emoji: '🚲', isLiving: false },
  { id: 'sparrow', label: 'Sparrow', emoji: '🐦', isLiving: true },
  { id: 'chair', label: 'Chair', emoji: '🪑', isLiving: false },
  { id: 'frog', label: 'Frog', emoji: '🐸', isLiving: true },
  { id: 'rock', label: 'Rock', emoji: '🪨', isLiving: false },
  { id: 'flower', label: 'Sunflower', emoji: '🌻', isLiving: true },
  { id: 'bottle', label: 'Water Bottle', emoji: '🧴', isLiving: false },
];

export default function SortGame({ onComplete }) {
  const [placed, setPlaced] = useState({}); // itemId -> 'living' | 'nonliving'
  const [dragOver, setDragOver] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const unplaced = ITEMS.filter(i => !placed[i.id]);

  const handleDragStart = (e, id) => e.dataTransfer.setData('itemId', id);

  const handleDrop = (e, bin) => {
    const id = e.dataTransfer.getData('itemId');
    setPlaced(p => ({ ...p, [id]: bin }));
    setDragOver(null);
    e.preventDefault();
  };

  const handleTap = (id) => {
    if (submitted) return;
    // On mobile / click: cycle through bins or place in first available
    setPlaced(p => {
      if (!p[id]) return { ...p, [id]: 'living' };
      if (p[id] === 'living') return { ...p, [id]: 'nonliving' };
      const next = { ...p }; delete next[id]; return next;
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    ITEMS.forEach(item => {
      if ((placed[item.id] === 'living') === item.isLiving) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    if (onComplete) onComplete(Math.round((correct / ITEMS.length) * 100));
  };

  const handleReset = () => { setPlaced({}); setSubmitted(false); setScore(0); };

  const livingItems = ITEMS.filter(i => placed[i.id] === 'living');
  const nonlivingItems = ITEMS.filter(i => placed[i.id] === 'nonliving');

  const getItemStyle = (item) => {
    if (!submitted) return {};
    const correct = (placed[item.id] === 'living') === item.isLiving;
    return { border: `3px solid ${correct ? '#16a34a' : '#ef4444'}`, background: correct ? '#dcfce7' : '#fee2e2' };
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{
        background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
        borderRadius: '20px', padding: '28px',
        border: '2px solid #a78bfa'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎮</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#4c1d95', marginBottom: '4px' }}>
            Sort It Out!
          </h3>
          <p style={{ color: '#5b21b6', fontWeight: 600, fontSize: '14px' }}>
            Drag each item (or tap it) into the correct bin. Is it LIVING or NON-LIVING?
          </p>
        </div>

        {/* Item Bank */}
        {unplaced.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Items to Sort ({unplaced.length} left)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {unplaced.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={e => handleDragStart(e, item.id)}
                  onClick={() => handleTap(item.id)}
                  style={{
                    background: 'white', borderRadius: '14px', padding: '12px 16px',
                    border: '2.5px solid #c4b5fd', cursor: 'grab',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontWeight: 800, fontSize: '14px', color: '#4c1d95',
                    transition: 'all 0.15s', userSelect: 'none',
                    boxShadow: '0 2px 8px rgba(124,58,237,0.15)'
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{item.emoji}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bins */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {[
            { key: 'living', label: 'LIVING ✅', color: '#16a34a', bg: '#dcfce7', border: '#4ade80', items: livingItems },
            { key: 'nonliving', label: 'NON-LIVING ❌', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', items: nonlivingItems },
          ].map(bin => (
            <div
              key={bin.key}
              onDragOver={e => { e.preventDefault(); setDragOver(bin.key); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(e, bin.key)}
              style={{
                background: dragOver === bin.key ? bin.bg : 'white',
                borderRadius: '16px', padding: '16px',
                border: `2.5px dashed ${dragOver === bin.key ? bin.color : bin.border}`,
                minHeight: '120px', transition: 'all 0.2s',
                transform: dragOver === bin.key ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{ fontWeight: 900, color: bin.color, fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>
                {bin.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {bin.items.map(item => (
                  <div
                    key={item.id}
                    draggable={!submitted}
                    onDragStart={e => handleDragStart(e, item.id)}
                    onClick={() => !submitted && handleTap(item.id)}
                    style={{
                      background: bin.bg, borderRadius: '10px', padding: '8px 12px',
                      border: `2px solid ${bin.border}`, cursor: submitted ? 'default' : 'grab',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      fontWeight: 800, fontSize: '13px', color: bin.color,
                      position: 'relative', ...getItemStyle(item)
                    }}
                  >
                    <span>{item.emoji}</span>
                    {item.label}
                    {submitted && (
                      <span style={{ marginLeft: '4px' }}>
                        {(placed[item.id] === 'living') === item.isLiving ? '✅' : '❌'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit / Results */}
        {!submitted ? (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleSubmit}
              disabled={Object.keys(placed).length < ITEMS.length}
              style={{
                background: Object.keys(placed).length === ITEMS.length
                  ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                  : '#e5e7eb',
                color: Object.keys(placed).length === ITEMS.length ? 'white' : '#9ca3af',
                border: 'none', borderRadius: '50px', padding: '14px 36px',
                fontFamily: 'var(--font-body)', fontWeight: 900, fontSize: '16px',
                cursor: Object.keys(placed).length === ITEMS.length ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s', boxShadow: Object.keys(placed).length === ITEMS.length ? '0 4px 15px rgba(124,58,237,0.4)' : 'none'
              }}
            >
              {Object.keys(placed).length < ITEMS.length
                ? `Sort ${ITEMS.length - Object.keys(placed).length} more items...`
                : '✅ Check My Answers!'}
            </button>
          </div>
        ) : (
          <div style={{
            background: score >= 6 ? '#dcfce7' : '#fef3c7',
            borderRadius: '16px', padding: '20px', textAlign: 'center',
            border: `2px solid ${score >= 6 ? '#4ade80' : '#fbbf24'}`
          }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>
              {score === 8 ? '🏆' : score >= 6 ? '🌟' : '💪'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--dark-text)', marginBottom: '4px' }}>
              {score}/8 Correct!
            </div>
            <div style={{ fontWeight: 600, color: '#6b7280', fontSize: '14px', marginBottom: '14px' }}>
              {score === 8 ? 'Perfect! You know exactly what is living and non-living!' :
               score >= 6 ? 'Great job! Review the ones you missed.' :
               'Keep going! Read the lesson again and try once more.'}
            </div>
            <button onClick={handleReset} style={{
              background: 'white', border: '2px solid #7c3aed', borderRadius: '50px',
              padding: '10px 24px', fontFamily: 'var(--font-body)', fontWeight: 800,
              color: '#7c3aed', cursor: 'pointer', fontSize: '14px'
            }}>🔄 Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
