import React, { useState } from 'react';

const PARTS = {
  flower: {
    label: 'Flower 🌸',
    color: '#ec4899',
    bg: '#fce7f3',
    title: 'The Colorful Messenger!',
    description: 'Flowers attract bees and butterflies with their bright colors and sweet nectar. After pollination, they become fruits and seeds!',
    facts: ['Bees carry pollen from flower to flower', 'Many flowers turn into fruits', 'Flowers can be red, yellow, blue, pink!'],
    emoji: '🌸',
    x: '50%', y: '8%'
  },
  leaf: {
    label: 'Leaf 🍃',
    color: '#16a34a',
    bg: '#dcfce7',
    title: 'The Food Factory!',
    description: 'Leaves use sunlight, water, and air (CO₂) to make food for the plant. This is called PHOTOSYNTHESIS. They also give us fresh oxygen!',
    facts: ['Green color comes from chlorophyll', 'Has tiny holes called stomata', 'One tree leaf makes oxygen for 4 people!'],
    emoji: '🍃',
    x: '18%', y: '30%'
  },
  stem: {
    label: 'Stem 🪵',
    color: '#92400e',
    bg: '#fef3c7',
    title: "The Plant's Highway!",
    description: "The stem carries water from the roots all the way up to the leaves and flowers. It also holds the plant upright — like a backbone!",
    facts: ['Acts like tiny water pipes inside', 'Supports all branches and leaves', 'Some stems store food (like sugarcane!)'],
    emoji: '🪵',
    x: '50%', y: '56%'
  },
  root: {
    label: 'Root 🌱',
    color: '#78350f',
    bg: '#ffedd5',
    title: 'The Underground Hero!',
    description: 'Roots grow underground and drink up water and minerals from the soil — like a straw! They also anchor the plant so it stays standing.',
    facts: ['Carrots and radishes are roots we eat!', 'Roots can go very deep underground', 'Hair-like tips absorb water'],
    emoji: '🌱',
    x: '50%', y: '88%'
  }
};

export default function PlantExplorer() {
  const [active, setActive] = useState(null);
  const [discovered, setDiscovered] = useState(new Set());

  const handleClick = (key) => {
    setActive(key === active ? null : key);
    setDiscovered(prev => new Set([...prev, key]));
  };

  const part = active ? PARTS[active] : null;
  const allDiscovered = discovered.size === Object.keys(PARTS).length;

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{
        background: 'linear-gradient(135deg, #16a34a, #15803d)',
        borderRadius: '20px', padding: '20px 24px', marginBottom: '20px', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>🌿 Plant Explorer</div>
          <div style={{ opacity: 0.85, fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
            Click on each plant part to discover its secret!
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>{discovered.size}/4</div>
          <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 700 }}>discovered</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Plant SVG diagram */}
        <div style={{ position: 'relative', userSelect: 'none' }}>
          <svg viewBox="0 0 300 400" style={{ width: '100%', maxWidth: '300px', display: 'block', margin: '0 auto' }}>
            {/* Sky/ground background */}
            <rect x="0" y="0" width="300" height="400" rx="16" fill="#f0fdf4"/>
            <rect x="0" y="280" width="300" height="120" rx="0" fill="#d97706" opacity="0.15"/>
            <rect x="0" y="310" width="300" height="90" rx="0" fill="#92400e" opacity="0.1"/>

            {/* Ground line */}
            <line x1="20" y1="280" x2="280" y2="280" stroke="#92400e" strokeWidth="2" strokeDasharray="6,4" opacity="0.4"/>
            <text x="230" y="275" fontSize="10" fill="#92400e" opacity="0.6" fontWeight="700">soil</text>

            {/* Roots */}
            <g onClick={() => handleClick('root')} style={{ cursor: 'pointer' }}>
              <line x1="150" y1="280" x2="120" y2="340" stroke={discovered.has('root') ? '#78350f' : '#d97706'} strokeWidth="4" strokeLinecap="round"/>
              <line x1="150" y1="280" x2="150" y2="360" stroke={discovered.has('root') ? '#78350f' : '#d97706'} strokeWidth="5" strokeLinecap="round"/>
              <line x1="150" y1="280" x2="180" y2="340" stroke={discovered.has('root') ? '#78350f' : '#d97706'} strokeWidth="4" strokeLinecap="round"/>
              <line x1="120" y1="340" x2="100" y2="370" stroke={discovered.has('root') ? '#78350f' : '#d97706'} strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="180" y1="340" x2="200" y2="370" stroke={discovered.has('root') ? '#78350f' : '#d97706'} strokeWidth="2.5" strokeLinecap="round"/>
              {/* Hotspot */}
              <circle cx="150" cy="325" r="22" fill={active === 'root' ? '#78350f' : 'transparent'}
                stroke={discovered.has('root') ? '#78350f' : '#d97706'} strokeWidth="2" opacity="0.3"/>
              <text x="150" y="330" textAnchor="middle" fontSize="18">🌱</text>
            </g>

            {/* Stem */}
            <g onClick={() => handleClick('stem')} style={{ cursor: 'pointer' }}>
              <rect x="140" y="160" width="20" height="120" rx="6"
                fill={active === 'stem' ? '#92400e' : discovered.has('stem') ? '#a16207' : '#78350f'} opacity="0.85"/>
              <circle cx="150" cy="220" r="20" fill={active === 'stem' ? '#92400e' : 'transparent'} opacity="0.2"/>
              <text x="150" y="228" textAnchor="middle" fontSize="18">🪵</text>
            </g>

            {/* Leaves */}
            <g onClick={() => handleClick('leaf')} style={{ cursor: 'pointer' }}>
              {/* Left leaf */}
              <ellipse cx="95" cy="195" rx="42" ry="22"
                fill={active === 'leaf' ? '#16a34a' : discovered.has('leaf') ? '#22c55e' : '#4ade80'}
                transform="rotate(-25, 95, 195)"/>
              <line x1="130" y1="185" x2="75" y2="205" stroke="white" strokeWidth="1.5" opacity="0.5"/>
              {/* Right leaf */}
              <ellipse cx="205" cy="185" rx="42" ry="22"
                fill={active === 'leaf' ? '#16a34a' : discovered.has('leaf') ? '#22c55e' : '#4ade80'}
                transform="rotate(25, 205, 185)"/>
              <line x1="168" y1="190" x2="225" y2="175" stroke="white" strokeWidth="1.5" opacity="0.5"/>
              <text x="105" y="198" textAnchor="middle" fontSize="18">🍃</text>
              <text x="198" y="185" textAnchor="middle" fontSize="18">🍃</text>
            </g>

            {/* Flower */}
            <g onClick={() => handleClick('flower')} style={{ cursor: 'pointer' }}>
              {['0','60','120','180','240','300'].map((angle, i) => (
                <ellipse key={i}
                  cx={150 + 22 * Math.cos((parseInt(angle) * Math.PI) / 180)}
                  cy={75 + 22 * Math.sin((parseInt(angle) * Math.PI) / 180)}
                  rx="14" ry="10"
                  fill={active === 'flower' ? '#ec4899' : discovered.has('flower') ? '#f472b6' : '#fda4af'}
                  transform={`rotate(${angle}, ${150 + 22 * Math.cos((parseInt(angle) * Math.PI) / 180)}, ${75 + 22 * Math.sin((parseInt(angle) * Math.PI) / 180)})`}
                />
              ))}
              <circle cx="150" cy="75" r="16"
                fill={active === 'flower' ? '#fbbf24' : '#fde68a'}
                stroke="#f59e0b" strokeWidth="2"/>
              <text x="150" y="81" textAnchor="middle" fontSize="16">🌸</text>
            </g>

            {/* Click hint labels */}
            {!active && (
              <>
                <text x="150" y="65" textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="700" opacity="0.7">click me!</text>
                <text x="80" y="215" textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="700" opacity="0.7">click me!</text>
                <text x="150" y="240" textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="700" opacity="0.7">click me!</text>
                <text x="150" y="360" textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="700" opacity="0.7">click me!</text>
              </>
            )}
          </svg>
        </div>

        {/* Info panel */}
        <div>
          {part ? (
            <div style={{
              background: part.bg, borderRadius: '20px', padding: '24px',
              border: `3px solid ${part.color}40`,
              animation: 'slideIn 0.25s ease'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>{part.emoji}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: part.color, marginBottom: '6px' }}>
                {part.label}
              </div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#1f2937', marginBottom: '10px' }}>
                {part.title}
              </div>
              <p style={{ fontSize: '14px', color: '#374151', fontWeight: 600, lineHeight: 1.7, marginBottom: '14px' }}>
                {part.description}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {part.facts.map((f, i) => (
                  <div key={i} style={{
                    background: 'white', borderRadius: '10px', padding: '9px 12px',
                    fontSize: '13px', fontWeight: 700, color: '#374151',
                    display: 'flex', gap: '8px', alignItems: 'center',
                    border: `1px solid ${part.color}30`,
                    animation: `slideIn 0.3s ease ${i * 0.1}s both`
                  }}>
                    <span style={{ color: part.color }}>✦</span> {f}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              background: '#f9fafb', borderRadius: '20px', padding: '32px',
              textAlign: 'center', border: '2.5px dashed #e5e7eb'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '14px' }}>👆</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#6b7280' }}>
                Click any part of the plant to learn about it!
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px' }}>
                {Object.entries(PARTS).map(([key, p]) => (
                  <div key={key} style={{
                    padding: '6px 14px', borderRadius: '50px',
                    background: discovered.has(key) ? p.bg : '#f3f4f6',
                    border: `2px solid ${discovered.has(key) ? p.color + '50' : '#e5e7eb'}`,
                    fontSize: '13px', fontWeight: 800,
                    color: discovered.has(key) ? p.color : '#9ca3af'
                  }}>
                    {discovered.has(key) ? '✓ ' : ''}{p.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {allDiscovered && (
        <div style={{
          marginTop: '20px', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
          borderRadius: '16px', padding: '20px', textAlign: 'center',
          border: '3px solid #4ade80', animation: 'popIn 0.4s ease'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '6px' }}>🎉</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#14532d' }}>
            Plant Expert Unlocked! You explored all 4 parts!
          </div>
        </div>
      )}
    </div>
  );
}
