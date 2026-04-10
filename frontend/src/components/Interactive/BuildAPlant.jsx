import React, { useState } from 'react';

// Parts that need to be placed on the plant, in correct vertical positions
const PARTS = [
  { id: 'flower', label: 'Flower',  emoji: '🌸', desc: 'Makes seeds & attracts bees', color: '#ec4899', slotY: 5  },
  { id: 'leaf',   label: 'Leaf',    emoji: '🍃', desc: 'Makes food using sunlight',   color: '#16a34a', slotY: 32 },
  { id: 'stem',   label: 'Stem',    emoji: '🪵', desc: 'Carries water upward',         color: '#92400e', slotY: 57 },
  { id: 'root',   label: 'Root',    emoji: '🌱', desc: 'Absorbs water from soil',     color: '#78350f', slotY: 80 },
];

const SLOT_LABELS = {
  flower: { top: '6%',  label: 'Place the Flower here' },
  leaf:   { top: '30%', label: 'Place the Leaf here' },
  stem:   { top: '54%', label: 'Place the Stem here' },
  root:   { top: '78%', label: 'Place the Root here' },
};

export default function BuildAPlant() {
  const [placed, setPlaced]     = useState({});   // {slotId: partId}
  const [dragging, setDragging] = useState(null); // partId being dragged
  const [feedback, setFeedback] = useState(null); // {slotId, correct}
  const [done, setDone]         = useState(false);

  const remaining = PARTS.filter(p => !Object.values(placed).includes(p.id));
  const isComplete = Object.keys(placed).length === PARTS.length && done;

  const handleDragStart = (partId) => setDragging(partId);
  const handleDragEnd   = () => setDragging(null);

  const handleDrop = (slotId) => {
    if (!dragging) return;
    const correct = dragging === slotId;
    setFeedback({ slotId, correct });
    setTimeout(() => setFeedback(null), 1200);

    if (correct) {
      const next = { ...placed, [slotId]: dragging };
      setPlaced(next);
      setDragging(null);
      if (Object.keys(next).length === PARTS.length) setTimeout(() => setDone(true), 600);
    } else {
      setDragging(null);
    }
  };

  // Touch / click fallback — select then tap slot
  const [selected, setSelected] = useState(null);

  const handlePartClick = (partId) => {
    setSelected(selected === partId ? null : partId);
  };

  const handleSlotClick = (slotId) => {
    if (!selected) return;
    const correct = selected === slotId;
    setFeedback({ slotId, correct });
    setTimeout(() => setFeedback(null), 1200);
    if (correct) {
      const next = { ...placed, [slotId]: selected };
      setPlaced(next);
      setSelected(null);
      if (Object.keys(next).length === PARTS.length) setTimeout(() => setDone(true), 600);
    } else {
      setSelected(null);
    }
  };

  const reset = () => { setPlaced({}); setDragging(null); setFeedback(null); setDone(false); setSelected(null); };

  const getPlacedPart = (slotId) => PARTS.find(p => p.id === placed[slotId]);

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #166534, #15803d)',
        borderRadius: '20px', padding: '20px 24px', marginBottom: '20px',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>🌿 Build-a-Plant!</div>
          <div style={{ opacity: 0.85, fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
            Tap each plant part, then tap where it belongs on the plant. Take your time! 🌿
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>
            {Object.keys(placed).length}/{PARTS.length}
          </div>
          <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: 700 }}>PLACED</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '24px', alignItems: 'start' }}>

        {/* Plant diagram with slots */}
        <div style={{ position: 'relative', background: 'linear-gradient(180deg, #e0f2fe 0%, #dcfce7 55%, #fef3c7 100%)', borderRadius: '20px', padding: '16px', minHeight: '420px', border: '3px solid #4ade8040' }}>

          {/* Ground line */}
          <div style={{ position: 'absolute', left: '10%', right: '10%', top: '68%', height: '3px', background: '#92400e', opacity: 0.3, borderRadius: '2px' }}/>
          <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: 800, color: '#92400e', opacity: 0.5 }}>🌍 Underground</div>

          {/* Slots */}
          {PARTS.map(part => {
            const slotInfo = SLOT_LABELS[part.id];
            const placedPart = getPlacedPart(part.id);
            const fb = feedback?.slotId === part.id;

            return (
              <div
                key={part.id}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(part.id)}
                onClick={() => handleSlotClick(part.id)}
                style={{
                  position: 'absolute', top: slotInfo.top, left: '50%',
                  transform: 'translateX(-50%)',
                  width: '140px', height: '64px',
                  border: `3px dashed ${placedPart ? part.color : fb && !feedback.correct ? '#ef4444' : '#94a3b8'}`,
                  borderRadius: '16px',
                  background: placedPart ? `${part.color}15` : fb && !feedback.correct ? '#fee2e2' : 'rgba(255,255,255,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: selected ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  zIndex: 2,
                  boxShadow: selected && !placedPart ? `0 0 0 3px ${part.color}60` : 'none'
                }}
              >
                {placedPart ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '28px' }}>{placedPart.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '13px', color: placedPart.color }}>{placedPart.label}</div>
                      <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>{placedPart.desc}</div>
                    </div>
                    <span style={{ fontSize: '16px' }}>✅</span>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', opacity: 0.5 }}>
                    <div style={{ fontSize: '20px' }}>➕</div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#374151', marginTop: '2px' }}>{slotInfo.label}</div>
                  </div>
                )}
                {fb && !feedback.correct && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fee2e2', borderRadius: '13px', fontSize: '24px' }}>❌</div>
                )}
              </div>
            );
          })}

          {/* Simple plant illustration lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 300 420">
            <line x1="150" y1="50" x2="150" y2="290" stroke="#92400e" strokeWidth="6" strokeLinecap="round" opacity="0.25"/>
            <line x1="150" y1="290" x2="120" y2="360" stroke="#78350f" strokeWidth="4" strokeLinecap="round" opacity="0.2"/>
            <line x1="150" y1="290" x2="150" y2="380" stroke="#78350f" strokeWidth="5" strokeLinecap="round" opacity="0.2"/>
            <line x1="150" y1="290" x2="180" y2="360" stroke="#78350f" strokeWidth="4" strokeLinecap="round" opacity="0.2"/>
          </svg>
        </div>

        {/* Parts tray */}
        <div>
          <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px', border: '2px solid #e2e8f0' }}>
            <div style={{ fontWeight: 900, fontSize: '13px', color: '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🧩 Plant Parts Tray
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '14px' }}>
              {selected ? `Selected: ${PARTS.find(p=>p.id===selected)?.label} — now tap a slot!` : 'Drag a part OR tap it, then tap the correct slot'}
            </div>

            {remaining.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#16a34a', fontWeight: 800 }}>
                🎉 All parts placed!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {remaining.map(part => (
                  <div
                    key={part.id}
                    draggable
                    onDragStart={() => handleDragStart(part.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handlePartClick(part.id)}
                    style={{
                      background: selected === part.id ? `${part.color}20` : 'white',
                      border: `2.5px solid ${selected === part.id ? part.color : '#e5e7eb'}`,
                      borderRadius: '14px', padding: '12px 14px',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      cursor: 'grab', transition: 'all 0.2s',
                      transform: selected === part.id ? 'scale(1.03)' : 'scale(1)',
                      boxShadow: selected === part.id ? `0 4px 12px ${part.color}40` : '0 2px 6px rgba(0,0,0,0.05)',
                      userSelect: 'none'
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>{part.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '14px', color: part.color }}>{part.label}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>{part.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={reset} style={{
            width: '100%', marginTop: '12px', background: '#f1f5f9',
            border: '2px solid #e2e8f0', borderRadius: '12px', padding: '10px',
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '13px',
            cursor: 'pointer', color: '#475569'
          }}>🔄 Reset Plant</button>
        </div>
      </div>

      {/* Win banner */}
      {done && (
        <div style={{
          marginTop: '20px', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
          borderRadius: '20px', padding: '28px', textAlign: 'center',
          border: '3px solid #4ade80', animation: 'popIn 0.4s ease'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '10px' }}>🌳</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#14532d', marginBottom: '6px' }}>
            Your plant is complete!
          </div>
          <div style={{ color: '#166534', fontWeight: 700, marginBottom: '16px' }}>
            🌸 Flower on top → 🍃 Leaves for food → 🪵 Stem carries water → 🌱 Roots in soil!
          </div>
          <button onClick={reset} style={{
            background: '#16a34a', color: 'white', border: 'none', borderRadius: '50px',
            padding: '12px 28px', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '15px', cursor: 'pointer'
          }}>🔄 Build Again</button>
        </div>
      )}
    </div>
  );
}
