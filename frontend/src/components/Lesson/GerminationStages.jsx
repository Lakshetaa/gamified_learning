import React, { useState, useEffect } from 'react';

const STAGES = [
  {
    id: 0, label: 'Dry Seed', emoji: '🌰',
    desc: 'A tiny seed sits in the soil, waiting. Inside it has a baby plant and stored food, protected by a hard seed coat.',
    color: '#d97706', bg: '#fef3c7',
    visual: 'seed',
  },
  {
    id: 1, label: 'Absorbs Water', emoji: '💧',
    desc: 'Rain falls! 💧 The seed soaks up water and swells up. The seed coat softens and begins to crack open.',
    color: '#2563eb', bg: '#dbeafe',
    visual: 'swelling',
  },
  {
    id: 2, label: 'Root Appears', emoji: '🌱',
    desc: 'The first root pushes DOWN into the soil. Roots always grow downward to find water and hold the plant.',
    color: '#92400e', bg: '#ffedd5',
    visual: 'rooting',
  },
  {
    id: 3, label: 'Shoot Emerges', emoji: '🌿',
    desc: 'A tiny green shoot pushes UP through the soil toward the sunlight. It bends upward like magic!',
    color: '#16a34a', bg: '#dcfce7',
    visual: 'sprouting',
  },
  {
    id: 4, label: 'First Leaves!', emoji: '🍃',
    desc: 'The seedling opens its first leaves! Now it can make its own food using sunlight. The plant can grow on its own!',
    color: '#15803d', bg: '#bbf7d0',
    visual: 'seedling',
  },
];

function PlantVisual({ stage, animated }) {
  const groundY = 120;
  const skyH = 120;
  const soilH = 80;

  return (
    <svg width="200" height="220" viewBox="0 0 200 220" style={{ display: 'block', margin: '0 auto' }}>
      {/* Sky */}
      <rect x="0" y="0" width="200" height={skyH} fill="#dbeafe" rx="16"/>
      {/* Sun */}
      {stage >= 3 && <text x="160" y="40" fontSize="28" style={{ animation: 'float 2s ease-in-out infinite' }}>☀️</text>}
      {/* Clouds */}
      {stage >= 1 && <text x="10" y="35" fontSize="22" opacity="0.7">☁️</text>}
      {/* Rain drops */}
      {stage === 1 && [80,100,120,90,110].map((x,i) => (
        <line key={i} x1={x} y1={40+i*8} x2={x-4} y2={60+i*8} stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
      ))}

      {/* Ground / soil */}
      <rect x="0" y={skyH} width="200" height={soilH} fill="#d97706" opacity="0.3" rx="0"/>
      <rect x="0" y={skyH} width="200" height="8" fill="#92400e" opacity="0.4"/>

      {/* Seed */}
      {stage === 0 && (
        <ellipse cx="100" cy={skyH+30} rx="16" ry="12" fill="#d97706" stroke="#92400e" strokeWidth="2"/>
      )}

      {/* Swelling seed */}
      {stage === 1 && (
        <>
          <ellipse cx="100" cy={skyH+30} rx="20" ry="16" fill="#d97706" stroke="#92400e" strokeWidth="2"/>
          <line x1="100" y1={skyH+18} x2="100" y2={skyH+10} stroke="#92400e" strokeWidth="2" strokeDasharray="3"/>
        </>
      )}

      {/* Rooting */}
      {stage === 2 && (
        <>
          <ellipse cx="100" cy={skyH+28} rx="18" ry="14" fill="#d97706" stroke="#92400e" strokeWidth="1.5" opacity="0.8"/>
          {/* Root going down */}
          <path d="M100,142 Q95,160 100,175 Q105,185 100,195" stroke="#92400e" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M100,175 Q88,180 82,190" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M100,175 Q112,180 118,188" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
        </>
      )}

      {/* Sprouting */}
      {stage === 3 && (
        <>
          {/* Roots */}
          <path d="M100,148 Q95,165 100,178 Q105,188 100,198" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M100,178 Q88,183 82,192" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
          {/* Shoot coming up */}
          <path d="M100,148 Q102,120 100,95" stroke="#4ade80" strokeWidth="5" fill="none" strokeLinecap="round"/>
          {/* Bent tip */}
          <path d="M100,95 Q103,80 115,75" stroke="#4ade80" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <text x="112" y="72" fontSize="18">🌿</text>
        </>
      )}

      {/* Full seedling */}
      {stage === 4 && (
        <>
          {/* Roots */}
          <path d="M100,148 Q95,165 100,178" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M100,170 Q86,175 80,185" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
          <path d="M100,170 Q114,175 120,183" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
          {/* Stem */}
          <line x1="100" y1="148" x2="100" y2="75" stroke="#4ade80" strokeWidth="5" strokeLinecap="round"/>
          {/* Left leaf */}
          <ellipse cx="80" cy="100" rx="20" ry="10" fill="#22c55e" opacity="0.9" transform="rotate(-30,80,100)"/>
          {/* Right leaf */}
          <ellipse cx="120" cy="95" rx="20" ry="10" fill="#22c55e" opacity="0.9" transform="rotate(30,120,95)"/>
          {/* Top */}
          <text x="85" y="75" fontSize="24">🍃</text>
        </>
      )}

      {/* Stage label */}
      <rect x="0" y="205" width="200" height="15" fill="none"/>
    </svg>
  );
}

export default function GerminationStages() {
  const [stage, setStage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    let timer;
    if (autoPlay) {
      timer = setInterval(() => {
        setStage(prev => {
          if (prev >= STAGES.length - 1) { setAutoPlay(false); return prev; }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [autoPlay]);

  const current = STAGES[stage];

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Stage progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
        {STAGES.map((s, i) => (
          <button key={i} onClick={() => { setAutoPlay(false); setStage(i); }} style={{
            width: i === stage ? '36px' : '28px',
            height: i === stage ? '36px' : '28px',
            borderRadius: '50%',
            background: i <= stage ? current.color : '#e5e7eb',
            border: `3px solid ${i === stage ? current.color : 'transparent'}`,
            cursor: 'pointer', transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: i === stage ? '16px' : '14px',
            boxShadow: i === stage ? `0 0 0 4px ${current.color}30` : 'none',
          }}>
            {i < stage ? '✓' : s.emoji}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
        {/* Animation */}
        <div style={{
          background: current.bg,
          borderRadius: '20px', padding: '24px',
          border: `2.5px solid ${current.color}40`,
          transition: 'all 0.5s ease',
          textAlign: 'center',
        }}>
          <PlantVisual stage={stage} />
          <div style={{
            marginTop: '8px', fontFamily: 'var(--font-display)',
            fontSize: '18px', color: current.color,
          }}>
            Stage {stage + 1}: {current.label}
          </div>
        </div>

        {/* Description */}
        <div>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            border: `2px solid ${current.color}40`,
            animation: 'slideIn 0.3s ease',
            key: stage,
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>{current.emoji}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--dark-text)', marginBottom: '10px' }}>
              {current.label}
            </h3>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#374151', lineHeight: 1.7 }}>
              {current.desc}
            </p>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button onClick={() => { setAutoPlay(false); setStage(s => Math.max(0, s-1)); }}
              disabled={stage === 0}
              style={{
                flex: 1, padding: '10px', background: '#f3f4f6', border: 'none',
                borderRadius: '12px', fontFamily: 'var(--font-body)', fontWeight: 800,
                fontSize: '14px', cursor: stage === 0 ? 'not-allowed' : 'pointer', opacity: stage === 0 ? 0.4 : 1,
              }}>← Prev</button>

            <button onClick={() => { setStage(0); setAutoPlay(true); }}
              style={{
                flex: 1, padding: '10px',
                background: `linear-gradient(135deg, ${current.color}, ${current.color}cc)`,
                color: 'white', border: 'none', borderRadius: '12px',
                fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', cursor: 'pointer',
              }}>
              {autoPlay ? '⏸ Playing...' : '▶ Auto Play'}
            </button>

            <button onClick={() => { setAutoPlay(false); setStage(s => Math.min(STAGES.length-1, s+1)); }}
              disabled={stage === STAGES.length - 1}
              style={{
                flex: 1, padding: '10px', background: '#f3f4f6', border: 'none',
                borderRadius: '12px', fontFamily: 'var(--font-body)', fontWeight: 800,
                fontSize: '14px', cursor: stage === STAGES.length-1 ? 'not-allowed' : 'pointer',
                opacity: stage === STAGES.length-1 ? 0.4 : 1,
              }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
