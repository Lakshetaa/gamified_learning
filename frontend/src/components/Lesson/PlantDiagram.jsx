import React, { useState } from 'react';

const PARTS = {
  flower: {
    label: 'Flower 🌸',
    color: '#ec4899',
    bg: '#fdf2f8',
    desc: 'The flower attracts bees and butterflies! It helps the plant make seeds so new plants can grow. Many flowers become fruits we eat!',
    emoji: '🌸',
    facts: ['Attracts bees 🐝', 'Makes seeds 🌰', 'Becomes fruit 🍎'],
  },
  leaf: {
    label: 'Leaf 🍃',
    color: '#16a34a',
    bg: '#dcfce7',
    desc: 'Leaves are the food factory of the plant! They use sunlight + water + air to make food. This is called PHOTOSYNTHESIS. Leaves give us the oxygen we breathe!',
    emoji: '🍃',
    facts: ['Makes food ☀️', 'Absorbs sunlight 🌞', 'Releases oxygen 🌬️'],
  },
  stem: {
    label: 'Stem 🪵',
    color: '#92400e',
    bg: '#fef3c7',
    desc: 'The stem is like a highway! It carries water and food between roots and leaves. It also holds the plant upright so it can reach the sunlight.',
    emoji: '🪵',
    facts: ['Carries water 🚰', 'Supports plant 🏗️', 'Holds leaves 🌿'],
  },
  root: {
    label: 'Root 🌱',
    color: '#d97706',
    bg: '#ffedd5',
    desc: 'Roots grow underground like an anchor! They hold the plant firmly in soil and absorb water and minerals. Some roots like carrots store food we can eat!',
    emoji: '🌱',
    facts: ['Absorbs water 💧', 'Holds plant ⚓', 'Stores food 🥕'],
  },
};

export default function PlantDiagram() {
  const [selected, setSelected] = useState(null);
  const [discovered, setDiscovered] = useState(new Set());

  const handleSelect = (part) => {
    setSelected(part);
    setDiscovered(prev => new Set([...prev, part]));
  };

  const part = selected ? PARTS[selected] : null;
  const allDiscovered = discovered.size === 4;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
      {/* Plant SVG diagram */}
      <div style={{ position: 'relative', userSelect: 'none' }}>
        <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 800, color: '#6b7280', marginBottom: '12px' }}>
          👆 Click on each part to learn about it!
        </div>

        {/* Visual Plant */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: '110%', background: 'linear-gradient(180deg, #dbeafe 0%, #bbf7d0 40%, #92400e22 70%, #d9770622 100%)', borderRadius: '20px', overflow: 'hidden' }}>
          
          {/* Sun */}
          <div style={{ position: 'absolute', top: '12px', right: '20px', fontSize: '36px', animation: 'float 3s ease-in-out infinite' }}>☀️</div>
          
          {/* Flower - clickable */}
          <div onClick={() => handleSelect('flower')} style={{
            position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
            cursor: 'pointer', textAlign: 'center',
            filter: selected === 'flower' ? 'drop-shadow(0 0 12px #ec4899)' : discovered.has('flower') ? 'drop-shadow(0 0 6px #ec489960)' : 'none',
            transition: 'all 0.3s',
            animation: selected === 'flower' ? 'none' : 'float 2s ease-in-out infinite',
          }}>
            <div style={{ fontSize: '52px' }}>🌸</div>
            <div style={{
              background: selected === 'flower' ? '#ec4899' : 'rgba(255,255,255,0.9)',
              color: selected === 'flower' ? 'white' : '#ec4899',
              borderRadius: '50px', padding: '3px 12px', fontSize: '11px', fontWeight: 900,
              border: '2px solid #ec4899', marginTop: '-4px',
              transition: 'all 0.2s',
            }}>Flower</div>
          </div>

          {/* Leaf - clickable */}
          <div onClick={() => handleSelect('leaf')} style={{
            position: 'absolute', top: '30%', left: '18%',
            cursor: 'pointer', textAlign: 'center',
            filter: selected === 'leaf' ? 'drop-shadow(0 0 12px #16a34a)' : discovered.has('leaf') ? 'drop-shadow(0 0 6px #16a34a60)' : 'none',
            transition: 'all 0.3s',
          }}>
            <div style={{ fontSize: '40px', transform: 'rotate(-20deg)' }}>🍃</div>
            <div style={{
              background: selected === 'leaf' ? '#16a34a' : 'rgba(255,255,255,0.9)',
              color: selected === 'leaf' ? 'white' : '#16a34a',
              borderRadius: '50px', padding: '3px 10px', fontSize: '11px', fontWeight: 900,
              border: '2px solid #16a34a', transition: 'all 0.2s',
            }}>Leaf</div>
          </div>

          {/* Stem - clickable */}
          <div onClick={() => handleSelect('stem')} style={{
            position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
            cursor: 'pointer', textAlign: 'center', width: '80px',
          }}>
            <div style={{
              width: '16px', height: '120px', margin: '0 auto',
              background: selected === 'stem'
                ? 'linear-gradient(180deg, #65a30d, #92400e)'
                : 'linear-gradient(180deg, #4ade80, #a16207)',
              borderRadius: '8px',
              boxShadow: selected === 'stem' ? '0 0 16px #92400e80' : 'none',
              transition: 'all 0.3s',
            }}></div>
            <div style={{
              background: selected === 'stem' ? '#92400e' : 'rgba(255,255,255,0.9)',
              color: selected === 'stem' ? 'white' : '#92400e',
              borderRadius: '50px', padding: '3px 10px', fontSize: '11px', fontWeight: 900,
              border: '2px solid #92400e', marginTop: '4px', transition: 'all 0.2s',
            }}>Stem</div>
          </div>

          {/* Ground line */}
          <div style={{ position: 'absolute', bottom: '28%', left: 0, right: 0, height: '3px', background: '#92400e50' }}></div>

          {/* Roots - clickable */}
          <div onClick={() => handleSelect('root')} style={{
            position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)',
            cursor: 'pointer', textAlign: 'center', width: '120px',
          }}>
            {/* Root lines */}
            <svg width="120" height="70" style={{ display: 'block', margin: '0 auto' }}>
              <line x1="60" y1="0" x2="20" y2="40" stroke={selected === 'root' ? '#d97706' : '#a16207'} strokeWidth="5" strokeLinecap="round"/>
              <line x1="60" y1="0" x2="60" y2="50" stroke={selected === 'root' ? '#d97706' : '#a16207'} strokeWidth="5" strokeLinecap="round"/>
              <line x1="60" y1="0" x2="100" y2="40" stroke={selected === 'root' ? '#d97706' : '#a16207'} strokeWidth="5" strokeLinecap="round"/>
              <line x1="20" y1="40" x2="5" y2="60" stroke={selected === 'root' ? '#d97706' : '#a16207'} strokeWidth="3" strokeLinecap="round"/>
              <line x1="100" y1="40" x2="115" y2="60" stroke={selected === 'root' ? '#d97706' : '#a16207'} strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <div style={{
              background: selected === 'root' ? '#d97706' : 'rgba(255,255,255,0.9)',
              color: selected === 'root' ? 'white' : '#d97706',
              borderRadius: '50px', padding: '3px 10px', fontSize: '11px', fontWeight: 900,
              border: '2px solid #d97706', transition: 'all 0.2s',
            }}>Root</div>
          </div>

          {/* Discovery progress */}
          <div style={{ position: 'absolute', top: '12px', left: '12px',
            background: 'rgba(255,255,255,0.9)', borderRadius: '50px', padding: '4px 12px',
            fontSize: '12px', fontWeight: 900, color: 'var(--dark-text)' }}>
            🔍 {discovered.size}/4
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div>
        {part ? (
          <div style={{
            background: part.bg,
            borderRadius: '20px', padding: '28px',
            border: `2.5px solid ${part.color}50`,
            animation: 'slideIn 0.3s ease',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{part.emoji}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--dark-text)', marginBottom: '10px' }}>
              {part.label}
            </h3>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#374151', lineHeight: 1.7, marginBottom: '16px' }}>
              {part.desc}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {part.facts.map((f, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: '10px', padding: '8px 14px',
                  fontSize: '13px', fontWeight: 800, color: 'var(--dark-text)',
                  border: `1.5px solid ${part.color}30`,
                  animation: `slideIn 0.3s ease ${i * 0.1}s both`,
                }}>{f}</div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            background: '#f9fafb', borderRadius: '20px', padding: '40px 28px',
            textAlign: 'center', border: '2px dashed #e5e7eb',
          }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>👆</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--dark-text)', marginBottom: '8px' }}>
              Click a part!
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>
              Click on any part of the plant to learn what it does.
            </div>
          </div>
        )}

        {allDiscovered && (
          <div style={{
            marginTop: '16px', background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            borderRadius: '16px', padding: '16px 20px', textAlign: 'center',
            border: '2px solid #fbbf24', animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>🏆</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#78350f' }}>
              Plant Expert! You found all 4 parts!
            </div>
          </div>
        )}

        {/* Part selector buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
          {Object.entries(PARTS).map(([key, p]) => (
            <button key={key} onClick={() => handleSelect(key)} style={{
              background: discovered.has(key) ? p.bg : 'white',
              border: `2px solid ${selected === key ? p.color : discovered.has(key) ? p.color + '60' : '#e5e7eb'}`,
              borderRadius: '12px', padding: '10px 14px',
              fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '13px',
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span>{p.emoji}</span>
              <span style={{ color: discovered.has(key) ? p.color : '#9ca3af' }}>{p.label.split(' ')[0]}</span>
              {discovered.has(key) && <span style={{ marginLeft: 'auto', fontSize: '12px' }}>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
