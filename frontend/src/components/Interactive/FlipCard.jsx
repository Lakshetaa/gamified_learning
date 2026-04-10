import React, { useState } from 'react';

export default function FlipCard({ front, back, frontEmoji, backEmoji, color = '#16a34a', bg = '#dcfce7' }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      style={{
        width: '100%', minHeight: '140px',
        perspective: '1000px', cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <div style={{
        position: 'relative', width: '100%', minHeight: '140px',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: bg, borderRadius: '16px', padding: '20px',
          border: `3px solid ${color}40`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', minHeight: '140px'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>{frontEmoji}</div>
          <div style={{ fontWeight: 800, fontSize: '14px', color: '#374151', lineHeight: 1.5 }}>{front}</div>
          <div style={{ fontSize: '11px', color: color, fontWeight: 800, marginTop: '10px' }}>
            👆 Click to flip!
          </div>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          borderRadius: '16px', padding: '20px',
          transform: 'rotateY(180deg)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', minHeight: '140px'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>{backEmoji || '💡'}</div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'white', lineHeight: 1.6 }}>{back}</div>
        </div>
      </div>
    </div>
  );
}
