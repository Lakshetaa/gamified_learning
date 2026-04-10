import React, { useState } from 'react';

export default function MatchGame({ pairs, title = 'Match the Pairs!', color = '#7c3aed', bg = '#ede9fe' }) {
  // pairs: [{left: {label, emoji}, right: {label, emoji}}]
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState({}); // {leftIndex: rightIndex}
  const [wrong, setWrong] = useState(null);
  const [done, setDone] = useState(false);

  const rightOrder = useState(() => [...pairs].sort(() => Math.random() - 0.5))[0];

  const handleLeft = (i) => {
    if (Object.keys(matched).map(Number).includes(i)) return;
    setSelectedLeft(i);
    setWrong(null);
  };

  const handleRight = (item) => {
    const rightIdx = rightOrder.indexOf(item);
    if (Object.values(matched).includes(rightIdx)) return;
    if (selectedLeft === null) return;

    // Check if this right item corresponds to selectedLeft pair
    const isCorrect = rightOrder[rightIdx].right.label === pairs[selectedLeft].right.label;

    if (isCorrect) {
      const newMatched = { ...matched, [selectedLeft]: rightIdx };
      setMatched(newMatched);
      setSelectedLeft(null);
      if (Object.keys(newMatched).length === pairs.length) {
        setTimeout(() => setDone(true), 400);
      }
    } else {
      setWrong({ left: selectedLeft, right: rightIdx });
      setTimeout(() => { setWrong(null); setSelectedLeft(null); }, 900);
    }
  };

  const matchedLeftIndices = Object.keys(matched).map(Number);
  const matchedRightIndices = Object.values(matched);

  const reset = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched({});
    setWrong(null);
    setDone(false);
  };

  if (done) {
    return (
      <div style={{
        background: bg, borderRadius: '20px', padding: '40px',
        textAlign: 'center', border: `3px solid ${color}40`, animation: 'popIn 0.4s ease'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '12px' }}>🏆</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color, marginBottom: '8px' }}>
          All Pairs Matched!
        </div>
        <div style={{ fontWeight: 700, color: '#374151', marginBottom: '20px' }}>
          Amazing memory! You matched everything correctly!
        </div>
        <button onClick={reset} style={{
          background: color, color: 'white', border: 'none', borderRadius: '50px',
          padding: '12px 28px', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '15px', cursor: 'pointer'
        }}>🔄 Play Again</button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', color: 'white'
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>🔗 {title}</div>
        <div style={{ opacity: 0.85, fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
          Click a left item, then click its matching right item. {Object.keys(matched).length}/{pairs.length} matched!
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pairs.map((pair, i) => {
            const isMatched = matchedLeftIndices.includes(i);
            const isSelected = selectedLeft === i;
            const isWrong = wrong?.left === i;
            return (
              <button key={i} onClick={() => handleLeft(i)} disabled={isMatched} style={{
                padding: '14px 16px', borderRadius: '14px', cursor: isMatched ? 'default' : 'pointer',
                background: isMatched ? '#dcfce7' : isSelected ? bg : isWrong ? '#fee2e2' : 'white',
                border: `2.5px solid ${isMatched ? '#4ade80' : isSelected ? color : isWrong ? '#fca5a5' : '#e5e7eb'}`,
                fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px',
                color: isMatched ? '#16a34a' : isSelected ? color : isWrong ? '#dc2626' : '#374151',
                textAlign: 'left', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '10px',
                transform: isSelected ? 'translateX(4px)' : 'none',
                boxShadow: isSelected ? `0 4px 12px ${color}30` : 'none'
              }}>
                <span style={{ fontSize: '24px' }}>{pair.left.emoji}</span>
                {pair.left.label}
                {isMatched && <span style={{ marginLeft: 'auto' }}>✅</span>}
              </button>
            );
          })}
        </div>

        {/* Right column — shuffled */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rightOrder.map((pair, i) => {
            const isMatched = matchedRightIndices.includes(i);
            const isWrong = wrong?.right === i;
            return (
              <button key={i} onClick={() => handleRight(pair)} disabled={isMatched || selectedLeft === null} style={{
                padding: '14px 16px', borderRadius: '14px',
                cursor: isMatched || selectedLeft === null ? 'default' : 'pointer',
                background: isMatched ? '#dcfce7' : isWrong ? '#fee2e2' : selectedLeft !== null ? bg : 'white',
                border: `2.5px solid ${isMatched ? '#4ade80' : isWrong ? '#fca5a5' : selectedLeft !== null ? color + '50' : '#e5e7eb'}`,
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px',
                color: isMatched ? '#16a34a' : isWrong ? '#dc2626' : '#374151',
                textAlign: 'left', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '10px',
                animation: isWrong ? 'wiggle 0.3s ease' : 'none'
              }}>
                <span style={{ fontSize: '24px' }}>{pair.right.emoji}</span>
                {pair.right.label}
                {isMatched && <span style={{ marginLeft: 'auto' }}>✅</span>}
              </button>
            );
          })}
        </div>
      </div>

      {selectedLeft !== null && (
        <div style={{
          marginTop: '12px', background: bg, borderRadius: '12px', padding: '10px 16px',
          border: `2px solid ${color}40`, fontSize: '13px', fontWeight: 700, color
        }}>
          Selected: {pairs[selectedLeft].left.emoji} {pairs[selectedLeft].left.label} — now click the matching item on the right!
        </div>
      )}
    </div>
  );
}
