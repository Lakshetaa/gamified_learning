import React, { useState } from 'react';

const ITEMS = [
  { id: 1, label: 'Mango Tree', emoji: '🥭', isLiving: true, fact: 'Grows, breathes & makes fruits!' },
  { id: 2, label: 'Bicycle', emoji: '🚲', isLiving: false, fact: 'Made of metal, cannot breathe.' },
  { id: 3, label: 'Sparrow', emoji: '🐦', isLiving: true, fact: 'Flies, eats, and lays eggs!' },
  { id: 4, label: 'Chair', emoji: '🪑', isLiving: false, fact: 'Made by a carpenter, cannot grow.' },
  { id: 5, label: 'Earthworm', emoji: '🪱', isLiving: true, fact: 'Moves through soil and breathes!' },
  { id: 6, label: 'Rock', emoji: '🪨', isLiving: false, fact: 'Cannot grow, move, or reproduce.' },
  { id: 7, label: 'Butterfly', emoji: '🦋', isLiving: true, fact: 'Grows from a caterpillar & reproduces!' },
  { id: 8, label: 'Water Bottle', emoji: '🍶', isLiving: false, fact: 'Made by humans, not alive.' },
];

export default function SortGame({ onComplete }) {
  const [sorted, setSorted] = useState({ living: [], nonLiving: [] });
  const [remaining, setRemaining] = useState(ITEMS);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const handleSort = (item, toLiving) => {
    const correct = item.isLiving === toLiving;
    setFeedback({ id: item.id, correct, fact: item.fact });
    setTimeout(() => setFeedback(null), 1800);

    if (correct) setScore(s => s + 1);

    setSorted(prev => ({
      ...prev,
      living: toLiving ? [...prev.living, { ...item, correct }] : prev.living,
      nonLiving: !toLiving ? [...prev.nonLiving, { ...item, correct }] : prev.nonLiving,
    }));
    const next = remaining.filter(r => r.id !== item.id);
    setRemaining(next);
    if (next.length === 0) {
      setTimeout(() => {
        setDone(true);
        if (onComplete) onComplete(score + (correct ? 1 : 0));
      }, 800);
    }
  };

  const reset = () => {
    setSorted({ living: [], nonLiving: [] });
    setRemaining(ITEMS);
    setScore(0);
    setDone(false);
    setFeedback(null);
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        borderRadius: '20px', padding: '24px', marginBottom: '20px', color: 'white'
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '6px' }}>
          🎮 Sort It Out!
        </div>
        <div style={{ opacity: 0.85, fontWeight: 600, fontSize: '14px' }}>
          Click a card, then choose Living or Non-Living. Score: {score}/{ITEMS.length}
        </div>
      </div>

      {/* Drop zones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {[
          { key: 'living', label: '🌿 Living Things', color: '#16a34a', bg: '#dcfce7', border: '#4ade80', items: sorted.living },
          { key: 'nonLiving', label: '🪨 Non-Living Things', color: '#64748b', bg: '#f1f5f9', border: '#94a3b8', items: sorted.nonLiving },
        ].map(zone => (
          <div key={zone.key} style={{
            background: zone.bg, borderRadius: '16px', padding: '16px',
            border: `2.5px dashed ${zone.border}`, minHeight: '120px'
          }}>
            <div style={{ fontWeight: 900, color: zone.color, fontSize: '14px', marginBottom: '12px' }}>{zone.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {zone.items.map(item => (
                <div key={item.id} style={{
                  background: item.correct ? 'white' : '#fee2e2',
                  border: `2px solid ${item.correct ? zone.border : '#fca5a5'}`,
                  borderRadius: '10px', padding: '6px 12px',
                  fontSize: '13px', fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  animation: 'popIn 0.3s ease'
                }}>
                  {item.emoji} {item.label}
                  <span>{item.correct ? '✅' : '❌'}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div style={{
          position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          background: feedback.correct ? '#16a34a' : '#dc2626',
          color: 'white', borderRadius: '50px', padding: '14px 28px',
          fontWeight: 800, fontSize: '15px', zIndex: 999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease'
        }}>
          {feedback.correct ? '✅ Correct! ' : '❌ Not quite! '}{feedback.fact}
        </div>
      )}

      {/* Cards to sort */}
      {!done ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {remaining.map(item => (
            <div key={item.id} className="sort-card" style={{
              background: 'white', borderRadius: '16px', padding: '16px',
              textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '2.5px solid #e5e7eb',
            }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>{item.emoji}</div>
              <div style={{ fontWeight: 900, fontSize: '13px', color: '#1f2937', marginBottom: '12px' }}>{item.label}</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => handleSort(item, true)} style={{
                  flex: 1, padding: '7px 4px', background: '#dcfce7', border: '2px solid #4ade80',
                  borderRadius: '8px', fontSize: '11px', fontWeight: 900, color: '#16a34a', cursor: 'pointer',
                  transition: 'all 0.15s'
                }}>🌿 Living</button>
                <button onClick={() => handleSort(item, false)} style={{
                  flex: 1, padding: '7px 4px', background: '#f1f5f9', border: '2px solid #94a3b8',
                  borderRadius: '8px', fontSize: '11px', fontWeight: 900, color: '#475569', cursor: 'pointer',
                  transition: 'all 0.15s'
                }}>🪨 Non-Living</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
          borderRadius: '20px', padding: '32px', textAlign: 'center',
          border: '3px solid #4ade80', animation: 'popIn 0.4s ease'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '12px' }}>
            {score === ITEMS.length ? '🏆' : score >= 6 ? '🌟' : '💪'}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#14532d', marginBottom: '6px' }}>
            {score === ITEMS.length ? 'Perfect Score!' : `You got ${score}/${ITEMS.length}!`}
          </div>
          <div style={{ color: '#166534', fontWeight: 700, marginBottom: '20px' }}>
            {score === ITEMS.length ? 'You can tell living from non-living like a true scientist!' : 'Good effort! Review and try again to get them all.'}
          </div>
          <button onClick={reset} style={{
            background: '#16a34a', color: 'white', border: 'none', borderRadius: '50px',
            padding: '12px 28px', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '15px',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(22,163,74,0.35)'
          }}>🔄 Play Again</button>
        </div>
      )}
    </div>
  );
}
