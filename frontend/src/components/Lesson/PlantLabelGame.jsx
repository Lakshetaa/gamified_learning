import React, { useState } from 'react';

const PARTS = [
  {
    id: 'root', label: 'Root', emoji: '🌱', color: '#92400e',
    desc: 'Holds the plant in soil & absorbs water',
    pos: { bottom: '4%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'stem', label: 'Stem', emoji: '🪵', color: '#166534',
    desc: 'Carries water up & supports the plant',
    pos: { bottom: '32%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'leaf', label: 'Leaf', emoji: '🍃', color: '#15803d',
    desc: 'Makes food using sunlight (photosynthesis)',
    pos: { top: '38%', left: '18%' }
  },
  {
    id: 'flower', label: 'Flower', emoji: '🌸', color: '#be185d',
    desc: 'Attracts insects & helps make seeds',
    pos: { top: '5%', left: '50%', transform: 'translateX(-50%)' }
  },
];

export default function PlantLabelGame({ onComplete }) {
  const [clicked, setClicked] = useState({});
  const [active, setActive] = useState(null);
  const [done, setDone] = useState(false);

  const handleClick = (id) => {
    if (done) return;
    setClicked(p => ({ ...p, [id]: true }));
    setActive(id);
  };

  const allDone = PARTS.every(p => clicked[p.id]);

  const handleFinish = () => {
    setDone(true);
    if (onComplete) onComplete(100);
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{
        background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
        borderRadius: '20px', padding: '28px',
        border: '2px solid #4ade80'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>🌿</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#14532d', marginBottom: '4px' }}>
            Tap the Plant Parts!
          </h3>
          <p style={{ color: '#166534', fontWeight: 600, fontSize: '14px' }}>
            Click each glowing dot to discover what that part does.
          </p>
        </div>

        {/* Plant SVG with clickable hotspots */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px', margin: '0 auto', aspectRatio: '3/4' }}>
          {/* Plant drawing via SVG */}
          <svg viewBox="0 0 200 280" style={{ width: '100%', height: '100%' }}>
            {/* Ground */}
            <ellipse cx="100" cy="252" rx="70" ry="14" fill="#92400e" opacity="0.2" />
            {/* Roots */}
            <line x1="100" y1="248" x2="70" y2="268" stroke="#a16207" strokeWidth="4" strokeLinecap="round"/>
            <line x1="100" y1="248" x2="100" y2="270" stroke="#a16207" strokeWidth="4" strokeLinecap="round"/>
            <line x1="100" y1="248" x2="130" y2="268" stroke="#a16207" strokeWidth="4" strokeLinecap="round"/>
            <line x1="80" y1="258" x2="60" y2="274" stroke="#a16207" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
            <line x1="120" y1="258" x2="140" y2="274" stroke="#a16207" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
            {/* Stem */}
            <line x1="100" y1="248" x2="100" y2="90" stroke="#15803d" strokeWidth="7" strokeLinecap="round"/>
            {/* Branch left */}
            <line x1="100" y1="160" x2="55" y2="125" stroke="#15803d" strokeWidth="5" strokeLinecap="round"/>
            {/* Branch right */}
            <line x1="100" y1="130" x2="145" y2="100" stroke="#15803d" strokeWidth="5" strokeLinecap="round"/>
            {/* Leaf left */}
            <ellipse cx="40" cy="112" rx="28" ry="18" fill="#22c55e" transform="rotate(-30 40 112)"/>
            <line x1="55" y1="125" x2="22" y2="102" stroke="#15803d" strokeWidth="1.5" opacity="0.5"/>
            {/* Leaf right */}
            <ellipse cx="158" cy="88" rx="28" ry="18" fill="#16a34a" transform="rotate(30 158 88)"/>
            <line x1="145" y1="100" x2="172" y2="77" stroke="#15803d" strokeWidth="1.5" opacity="0.5"/>
            {/* Extra leaf on stem */}
            <ellipse cx="68" cy="178" rx="22" ry="14" fill="#4ade80" transform="rotate(-15 68 178)"/>
            {/* Flower */}
            <circle cx="100" cy="72" r="10" fill="#fbbf24"/>
            {['#f472b6','#fb923c','#a78bfa','#60a5fa','#34d399'].map((c, i) => {
              const angle = (i * 72) * Math.PI / 180;
              return <ellipse key={i} cx={100 + 18 * Math.sin(angle)} cy={72 - 18 * Math.cos(angle)}
                rx="9" ry="14" fill={c} opacity="0.85"
                transform={`rotate(${i * 72} ${100 + 18 * Math.sin(angle)} ${72 - 18 * Math.cos(angle)})`}/>;
            })}
            <circle cx="100" cy="72" r="9" fill="#fbbf24"/>
            <circle cx="100" cy="72" r="5" fill="#f97316"/>
          </svg>

          {/* Clickable hotspots */}
          {PARTS.map(part => (
            <div
              key={part.id}
              onClick={() => handleClick(part.id)}
              style={{
                position: 'absolute',
                ...part.pos,
                width: '36px', height: '36px',
                borderRadius: '50%',
                background: clicked[part.id] ? part.color : 'white',
                border: `3px solid ${part.color}`,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px',
                boxShadow: `0 0 0 ${clicked[part.id] ? '0px' : '6px'} ${part.color}40`,
                animation: clicked[part.id] ? 'none' : 'pulse 1.5s ease-in-out infinite',
                transition: 'all 0.25s',
                zIndex: 2
              }}
            >
              {clicked[part.id] ? '✓' : '?'}
            </div>
          ))}
        </div>

        {/* Info panel */}
        <div style={{ marginTop: '16px', minHeight: '80px' }}>
          {active ? (
            <div style={{
              background: 'white', borderRadius: '14px', padding: '16px 20px',
              border: `2px solid ${PARTS.find(p => p.id === active)?.color}`,
              display: 'flex', gap: '14px', alignItems: 'center',
              animation: 'slideIn 0.3s ease'
            }}>
              <span style={{ fontSize: '32px' }}>{PARTS.find(p => p.id === active)?.emoji}</span>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '18px',
                  color: PARTS.find(p => p.id === active)?.color, marginBottom: '4px'
                }}>
                  {PARTS.find(p => p.id === active)?.label}
                </div>
                <div style={{ fontWeight: 600, color: '#374151', fontSize: '14px' }}>
                  {PARTS.find(p => p.id === active)?.desc}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#9ca3af', fontWeight: 600, fontSize: '14px', paddingTop: '20px' }}>
              👆 Click the glowing dots on the plant!
            </div>
          )}
        </div>

        {/* Parts checklist */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px', justifyContent: 'center' }}>
          {PARTS.map(p => (
            <div key={p.id} style={{
              padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: 800,
              background: clicked[p.id] ? p.color : '#f3f4f6',
              color: clicked[p.id] ? 'white' : '#9ca3af',
              transition: 'all 0.3s'
            }}>
              {clicked[p.id] ? '✓ ' : ''}{p.label}
            </div>
          ))}
        </div>

        {allDone && !done && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <div style={{ color: '#166534', fontWeight: 700, marginBottom: '10px' }}>
              🎉 You discovered all 4 plant parts!
            </div>
            <button onClick={handleFinish} style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              color: 'white', border: 'none', borderRadius: '50px', padding: '12px 28px',
              fontFamily: 'var(--font-body)', fontWeight: 900, fontSize: '15px', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(22,163,74,0.4)'
            }}>
              ✅ Great job! Continue →
            </button>
          </div>
        )}
        {done && (
          <div style={{ textAlign: 'center', marginTop: '12px', color: '#16a34a', fontWeight: 800 }}>
            🌟 Activity complete! You're a Plant Expert!
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{box-shadow:0 0 0 4px rgba(0,0,0,0.15)} 50%{box-shadow:0 0 0 10px rgba(0,0,0,0.05)} }`}</style>
    </div>
  );
}
