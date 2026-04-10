import React, { useState } from 'react';

const STAGES = [
  {
    id: 0, label: 'Dry Seed', emoji: '🌰',
    color: '#92400e', bg: '#fef3c7',
    desc: 'A tiny seed sits in the soil, waiting quietly. Inside is a baby plant and stored food.',
    visual: 'seed',
  },
  {
    id: 1, label: 'Absorbs Water', emoji: '💧',
    color: '#2563eb', bg: '#dbeafe',
    desc: 'The seed drinks water from the soil. It swells up and gets bigger. The seed coat softens.',
    visual: 'wet_seed',
  },
  {
    id: 2, label: 'Root Appears', emoji: '⬇️',
    color: '#a16207', bg: '#fef3c7',
    desc: 'The seed coat cracks open! A tiny root pushes DOWN into the soil to drink more water.',
    visual: 'root',
  },
  {
    id: 3, label: 'Shoot Grows', emoji: '⬆️',
    color: '#15803d', bg: '#dcfce7',
    desc: 'A green shoot pushes UP toward the sunlight. It bends and grows taller each day.',
    visual: 'shoot',
  },
  {
    id: 4, label: 'First Leaves', emoji: '🌿',
    color: '#16a34a', bg: '#dcfce7',
    desc: 'The seedling opens its first tiny leaves! Now it can make food from sunlight. A new plant is born!',
    visual: 'seedling',
  },
];

function PlantVisual({ stage }) {
  return (
    <svg viewBox="0 0 200 220" style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}>
      {/* Soil */}
      <rect x="20" y="140" width="160" height="60" rx="8" fill="#92400e" opacity="0.25"/>
      <rect x="20" y="145" width="160" height="55" rx="6" fill="#a16207" opacity="0.2"/>

      {/* STAGE 0: dry seed */}
      {stage >= 0 && (
        <ellipse cx="100" cy="155" rx={stage === 0 ? 18 : 14} ry={stage === 0 ? 14 : 10}
          fill="#d97706" stroke="#a16207" strokeWidth="2"/>
      )}

      {/* STAGE 1: water drops */}
      {stage === 1 && (
        <>
          {[[75,130],[110,125],[90,120]].map(([x,y],i) => (
            <ellipse key={i} cx={x} cy={y} rx="5" ry="7" fill="#60a5fa" opacity="0.7"
              style={{ animation: `fall${i} 1s ease-in-out infinite`, animationDelay: `${i*0.3}s` }}/>
          ))}
        </>
      )}

      {/* STAGE 2: root */}
      {stage >= 2 && (
        <>
          <line x1="100" y1="160" x2="100" y2="192" stroke="#a16207" strokeWidth="4" strokeLinecap="round"/>
          <line x1="100" y1="180" x2="80" y2="195" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
          <line x1="100" y1="185" x2="118" y2="198" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
        </>
      )}

      {/* STAGE 3: shoot */}
      {stage >= 3 && (
        <path d="M100,145 Q97,120 100,95" stroke="#15803d" strokeWidth="5" fill="none" strokeLinecap="round"/>
      )}

      {/* STAGE 4: seedling with leaves */}
      {stage >= 4 && (
        <>
          <ellipse cx="82" cy="95" rx="22" ry="14" fill="#4ade80" transform="rotate(-25 82 95)"/>
          <ellipse cx="118" cy="92" rx="22" ry="14" fill="#22c55e" transform="rotate(25 118 92)"/>
          <circle cx="100" cy="78" r="8" fill="#fbbf24" opacity="0.8"/>
        </>
      )}

      {/* Stage labels */}
      <text x="100" y="215" textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="700">
        Stage {stage + 1} of {STAGES.length}
      </text>
    </svg>
  );
}

export default function SeedGrowGame({ onComplete }) {
  const [stage, setStage] = useState(0);
  const [seen, setSeen] = useState([0]);
  const [done, setDone] = useState(false);

  const goTo = (s) => {
    setStage(s);
    setSeen(p => [...new Set([...p, s])]);
    if (s === STAGES.length - 1 && !done) {
      setDone(true);
      if (onComplete) onComplete(100);
    }
  };

  const current = STAGES[stage];

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        borderRadius: '20px', padding: '28px',
        border: '2px solid #4ade80'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>🌱</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#14532d', marginBottom: '4px' }}>
            Watch a Seed Grow!
          </h3>
          <p style={{ color: '#166534', fontWeight: 600, fontSize: '14px' }}>
            Press the arrows to walk through each stage of germination.
          </p>
        </div>

        {/* Stage steps indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {STAGES.map((s, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: i === stage ? current.color : seen.includes(i) ? '#bbf7d0' : '#e5e7eb',
              color: i === stage ? 'white' : seen.includes(i) ? '#16a34a' : '#9ca3af',
              fontWeight: 900, fontSize: '13px', transition: 'all 0.2s',
              transform: i === stage ? 'scale(1.2)' : 'scale(1)',
              boxShadow: i === stage ? `0 2px 8px ${current.color}60` : 'none'
            }}>
              {seen.includes(i) && i !== stage ? '✓' : i + 1}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
          <div>
            <PlantVisual stage={stage} />
          </div>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: current.color, color: 'white',
              borderRadius: '50px', padding: '6px 16px', fontSize: '13px', fontWeight: 900,
              marginBottom: '12px'
            }}>
              {current.emoji} Stage {stage + 1}: {current.label}
            </div>
            <p style={{ fontWeight: 600, color: '#374151', fontSize: '15px', lineHeight: 1.7 }}>
              {current.desc}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
          <button
            onClick={() => goTo(Math.max(0, stage - 1))}
            disabled={stage === 0}
            style={{
              background: stage === 0 ? '#f3f4f6' : 'white',
              color: stage === 0 ? '#d1d5db' : '#166534',
              border: `2px solid ${stage === 0 ? '#e5e7eb' : '#4ade80'}`,
              borderRadius: '50px', padding: '10px 22px',
              fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px',
              cursor: stage === 0 ? 'not-allowed' : 'pointer'
            }}
          >← Previous</button>

          <div style={{ fontSize: '13px', fontWeight: 700, color: '#9ca3af' }}>
            {seen.length}/{STAGES.length} stages seen
          </div>

          {stage < STAGES.length - 1 ? (
            <button
              onClick={() => goTo(stage + 1)}
              style={{
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                color: 'white', border: 'none', borderRadius: '50px', padding: '10px 22px',
                fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(22,163,74,0.35)'
              }}
            >Next Stage →</button>
          ) : (
            <div style={{ color: '#16a34a', fontWeight: 800, fontSize: '14px' }}>🌟 All stages seen!</div>
          )}
        </div>

        {done && (
          <div style={{
            background: 'white', borderRadius: '14px', padding: '16px', marginTop: '16px',
            border: '2px solid #4ade80', textAlign: 'center'
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#14532d', marginBottom: '4px' }}>
              🌱 You watched a seed grow into a plant!
            </div>
            <div style={{ color: '#166534', fontWeight: 600, fontSize: '14px' }}>
              Remember: Seeds need 💧 Water + ☀️ Warmth + 💨 Air to germinate!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
