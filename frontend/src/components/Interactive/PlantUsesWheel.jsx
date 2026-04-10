import React, { useState } from 'react';

const USES = [
  {
    id: 'food', label: 'Food 🍎', color: '#dc2626', bg: '#fee2e2',
    emoji: '🥗',
    title: 'Plants Feed Us!',
    desc: 'Most of the food we eat comes from plants — fruits, vegetables, grains, nuts and spices!',
    examples: [
      { name: 'Rice & Wheat', emoji: '🌾', note: 'Grains give us energy' },
      { name: 'Fruits', emoji: '🍎', note: 'Mango, banana, orange' },
      { name: 'Vegetables', emoji: '🥦', note: 'Carrot, spinach, tomato' },
      { name: 'Spices', emoji: '🌶️', note: 'Pepper, turmeric, ginger' },
    ]
  },
  {
    id: 'air', label: 'Fresh Air 🌬️', color: '#0284c7', bg: '#e0f2fe',
    emoji: '🌳',
    title: 'Plants Give Us Oxygen!',
    desc: 'Through photosynthesis, plants absorb CO₂ and release fresh oxygen for us to breathe!',
    examples: [
      { name: 'We breathe out CO₂', emoji: '😤', note: 'Plants absorb this' },
      { name: 'Plants absorb CO₂', emoji: '🌿', note: 'Used to make food' },
      { name: 'Plants release O₂', emoji: '💨', note: 'We need this to live' },
      { name: '1 tree = 4 people', emoji: '🌲', note: 'One tree provides oxygen for 4 people!' },
    ]
  },
  {
    id: 'shelter', label: 'Shelter 🏠', color: '#92400e', bg: '#fef3c7',
    emoji: '🪵',
    title: 'Plants Build Our Homes!',
    desc: 'Wood from trees is used to build houses, make furniture, and create paper for books!',
    examples: [
      { name: 'Wood', emoji: '🪵', note: 'Doors, furniture, roof' },
      { name: 'Cotton', emoji: '👕', note: 'Our clothes come from cotton plants!' },
      { name: 'Bamboo', emoji: '🎋', note: 'Used for baskets and huts' },
      { name: 'Paper', emoji: '📄', note: 'Books are made from tree pulp' },
    ]
  },
  {
    id: 'medicine', label: 'Medicine 💊', color: '#059669', bg: '#d1fae5',
    emoji: '🌿',
    title: 'Plants Heal Us!',
    desc: 'Many medicines come from plants! Herbal remedies have been used in India for thousands of years.',
    examples: [
      { name: 'Neem', emoji: '🌱', note: 'Kills germs, heals skin' },
      { name: 'Tulsi', emoji: '🍵', note: 'Relieves cold and cough' },
      { name: 'Turmeric', emoji: '🟡', note: 'Anti-inflammatory, healing' },
      { name: 'Aloe Vera', emoji: '🌵', note: 'Soothes burns and skin' },
    ]
  },
];

export default function PlantUsesWheel() {
  const [active, setActive] = useState(null);
  const [discovered, setDiscovered] = useState(new Set());

  const handleClick = (id) => {
    setActive(id === active ? null : id);
    setDiscovered(prev => new Set([...prev, id]));
  };

  const use = active ? USES.find(u => u.id === active) : null;

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{
        background: 'linear-gradient(135deg, #15803d, #166534)',
        borderRadius: '20px', padding: '20px 24px', marginBottom: '20px', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>🌍 Plants Help Us</div>
          <div style={{ opacity: 0.85, fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
            Click each category to explore how plants support our lives!
          </div>
        </div>
        <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: '20px' }}>
          {discovered.size}/4 <span style={{ fontSize: '13px', opacity: 0.8 }}>explored</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {USES.map(u => (
          <button key={u.id} onClick={() => handleClick(u.id)} style={{
            background: active === u.id ? u.color : discovered.has(u.id) ? u.bg : 'white',
            border: `3px solid ${active === u.id ? u.color : discovered.has(u.id) ? u.color + '60' : '#e5e7eb'}`,
            borderRadius: '18px', padding: '20px',
            cursor: 'pointer', textAlign: 'left', transition: 'all 0.25s',
            transform: active === u.id ? 'scale(1.02)' : 'scale(1)',
            boxShadow: active === u.id ? `0 8px 24px ${u.color}40` : '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{u.emoji}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px',
              color: active === u.id ? 'white' : u.color }}>
              {u.label}
            </div>
            {discovered.has(u.id) && (
              <div style={{ fontSize: '11px', fontWeight: 800, marginTop: '4px',
                color: active === u.id ? 'rgba(255,255,255,0.8)' : u.color, opacity: 0.8 }}>
                ✓ Explored
              </div>
            )}
          </button>
        ))}
      </div>

      {use && (
        <div style={{
          background: use.bg, borderRadius: '20px', padding: '24px',
          border: `3px solid ${use.color}40`, animation: 'slideIn 0.3s ease'
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: use.color, marginBottom: '8px' }}>
            {use.emoji} {use.title}
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#374151', lineHeight: 1.7, marginBottom: '20px' }}>
            {use.desc}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {use.examples.map((ex, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: '14px', padding: '14px 16px',
                border: `2px solid ${use.color}25`,
                display: 'flex', gap: '12px', alignItems: 'center',
                animation: `slideIn 0.3s ease ${i * 0.08}s both`
              }}>
                <span style={{ fontSize: '28px' }}>{ex.emoji}</span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '14px', color: '#1f2937' }}>{ex.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>{ex.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {discovered.size === 4 && (
        <div style={{
          marginTop: '16px', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
          borderRadius: '16px', padding: '18px', textAlign: 'center',
          border: '3px solid #4ade80'
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#14532d' }}>
            🌟 You discovered ALL the ways plants help us!
          </div>
        </div>
      )}
    </div>
  );
}
