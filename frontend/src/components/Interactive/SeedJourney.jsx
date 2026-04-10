import React, { useState, useEffect } from 'react';

const STAGES = [
  {
    id: 0, day: 'Day 1', label: 'Plant the Seed',
    color: '#78350f', bg: '#ffedd5',
    description: 'A tiny seed is placed in warm, moist soil. Inside the seed is a baby plant (embryo) and stored food.',
    emoji: '🌰',
    visual: 'seed',
    tip: 'The seed coat protects the baby plant inside!'
  },
  {
    id: 1, day: 'Day 2-3', label: 'Water is Absorbed',
    color: '#0369a1', bg: '#e0f2fe',
    description: 'The seed soaks up water through its coat. It swells up and gets bigger. The seed coat begins to soften.',
    emoji: '💧',
    visual: 'water',
    tip: 'Water triggers the seed to wake up and start growing!'
  },
  {
    id: 2, day: 'Day 4-5', label: 'Seed Coat Cracks',
    color: '#92400e', bg: '#fef3c7',
    description: 'The seed coat splits open! A tiny white root (radicle) pushes downward into the soil to find water.',
    emoji: '🔓',
    visual: 'crack',
    tip: 'The root always grows DOWN — pulled by gravity!'
  },
  {
    id: 3, day: 'Day 6-7', label: 'Shoot Pushes Up',
    color: '#166534', bg: '#dcfce7',
    description: 'A tiny green shoot pushes upward through the soil toward the sunlight. It bends like a hook to push through!',
    emoji: '⬆️',
    visual: 'shoot',
    tip: 'The shoot grows UP — toward sunlight!'
  },
  {
    id: 4, day: 'Day 8-10', label: 'Seedling Appears!',
    color: '#16a34a', bg: '#bbf7d0',
    description: 'The seedling breaks through the soil surface and opens its first leaves (cotyledons). Now it can make its own food!',
    emoji: '🌱',
    visual: 'seedling',
    tip: 'The first leaves are called seed leaves or cotyledons!'
  },
  {
    id: 5, day: 'Week 3+', label: 'Young Plant!',
    color: '#15803d', bg: '#dcfce7',
    description: 'More leaves grow and the plant gets taller. Roots spread deeper. Soon it will flower and make new seeds!',
    emoji: '🌿',
    visual: 'plant',
    tip: 'The cycle of life continues — this plant will make new seeds!'
  },
];

const PlantVisual = ({ stage, animated }) => {
  const styles = {
    container: {
      width: '160px', height: '200px', position: 'relative',
      margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
    },
    soil: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: '65px', background: 'linear-gradient(180deg, #92400e 0%, #78350f 100%)',
      borderRadius: '0 0 12px 12px'
    }
  };

  const visuals = {
    seed: (
      <div style={styles.container}>
        <div style={styles.soil}/>
        <div style={{ position: 'absolute', bottom: '30px', fontSize: '36px',
          animation: animated ? 'float 2s ease-in-out infinite' : 'none' }}>🌰</div>
      </div>
    ),
    water: (
      <div style={styles.container}>
        <div style={styles.soil}/>
        <div style={{ position: 'absolute', bottom: '25px', fontSize: '32px' }}>🌰</div>
        {animated && ['20px','60px','100px'].map((l, i) => (
          <div key={i} style={{
            position: 'absolute', bottom: `${55 + i * 15}px`, left: l,
            fontSize: '16px', animation: `fall 1.5s ease-in ${i * 0.3}s infinite`
          }}>💧</div>
        ))}
      </div>
    ),
    crack: (
      <div style={styles.container}>
        <div style={styles.soil}/>
        <div style={{ position: 'absolute', bottom: '30px', fontSize: '28px' }}>🌰</div>
        <div style={{ position: 'absolute', bottom: '10px', fontSize: '22px',
          animation: animated ? 'wiggle 0.5s ease-in-out infinite' : 'none' }}>🪱</div>
      </div>
    ),
    shoot: (
      <div style={styles.container}>
        <div style={styles.soil}/>
        <div style={{ position: 'absolute', bottom: '60px', width: '6px', height: '30px',
          background: '#16a34a', borderRadius: '3px', left: '77px',
          animation: animated ? 'growUp 1s ease both' : 'none' }}/>
        <div style={{ position: 'absolute', bottom: '88px', fontSize: '18px', left: '68px',
          transform: 'rotate(-90deg)' }}>🌱</div>
      </div>
    ),
    seedling: (
      <div style={styles.container}>
        <div style={styles.soil}/>
        <div style={{ position: 'absolute', bottom: '60px', width: '6px', height: '50px',
          background: '#16a34a', borderRadius: '3px', left: '77px' }}/>
        <div style={{ position: 'absolute', bottom: '110px', fontSize: '28px',
          animation: animated ? 'popIn 0.5s ease' : 'none' }}>🌱</div>
      </div>
    ),
    plant: (
      <div style={styles.container}>
        <div style={styles.soil}/>
        <div style={{ position: 'absolute', bottom: '60px', width: '8px', height: '90px',
          background: '#15803d', borderRadius: '4px', left: '76px' }}/>
        <div style={{ position: 'absolute', bottom: '145px', fontSize: '44px',
          animation: animated ? 'float 3s ease-in-out infinite' : 'none' }}>🌿</div>
      </div>
    )
  };

  return visuals[stage] || null;
};

export default function SeedJourney() {
  const [current, setCurrent] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto) return;
    if (current >= STAGES.length - 1) { setAuto(false); return; }
    const t = setTimeout(() => {
      const next = current + 1;
      setCurrent(next);
      setVisited(prev => new Set([...prev, next]));
    }, 2200);
    return () => clearTimeout(t);
  }, [auto, current]);

  const goTo = (i) => {
    setCurrent(i);
    setVisited(prev => new Set([...prev, i]));
  };

  const stage = STAGES[current];

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{
        background: 'linear-gradient(135deg, #78350f, #92400e)',
        borderRadius: '20px', padding: '20px 24px', marginBottom: '20px', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>🌱 Seed Journey</div>
          <div style={{ opacity: 0.85, fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
            Watch a seed grow into a plant step by step!
          </div>
        </div>
        <button onClick={() => { setCurrent(0); setVisited(new Set([0])); setAuto(true); }}
          style={{
            background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)',
            color: 'white', borderRadius: '50px', padding: '8px 18px',
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '13px', cursor: 'pointer'
          }}>
          ▶ Auto Play
        </button>
      </div>

      {/* Stage timeline */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {STAGES.map((s, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            flex: 1, minWidth: '70px', padding: '10px 6px',
            background: current === i ? s.color : visited.has(i) ? s.bg : '#f3f4f6',
            border: `2px solid ${current === i ? s.color : visited.has(i) ? s.color + '50' : '#e5e7eb'}`,
            borderRadius: '12px', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '11px',
            color: current === i ? 'white' : visited.has(i) ? s.color : '#9ca3af',
            transition: 'all 0.2s', textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '4px' }}>{s.emoji}</div>
            {s.day}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
        {/* Visual */}
        <div style={{
          background: stage.bg, borderRadius: '20px', padding: '24px',
          border: `3px solid ${stage.color}40`, minHeight: '240px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <PlantVisual stage={stage.visual} animated={true} />
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <div style={{ fontSize: '26px' }}>{stage.emoji}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: stage.color, marginTop: '6px' }}>
              {stage.day}
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ animation: 'slideIn 0.3s ease' }}>
          <div style={{
            background: stage.bg, borderRadius: '16px', padding: '20px',
            border: `2.5px solid ${stage.color}40`, marginBottom: '14px'
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: stage.color, marginBottom: '8px' }}>
              {stage.label}
            </div>
            <p style={{ fontSize: '14px', color: '#374151', fontWeight: 600, lineHeight: 1.8 }}>
              {stage.description}
            </p>
          </div>
          <div style={{
            background: '#fef3c7', borderRadius: '12px', padding: '14px 16px',
            border: '2px solid #fbbf24', display: 'flex', gap: '10px', alignItems: 'flex-start'
          }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#78350f', lineHeight: 1.6 }}>
              {stage.tip}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'center' }}>
        <button onClick={() => goTo(Math.max(0, current - 1))} disabled={current === 0}
          style={{
            padding: '10px 24px', borderRadius: '50px',
            background: current === 0 ? '#f3f4f6' : '#fef3c7',
            border: `2px solid ${current === 0 ? '#e5e7eb' : '#fbbf24'}`,
            color: current === 0 ? '#9ca3af' : '#92400e',
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', cursor: current === 0 ? 'not-allowed' : 'pointer'
          }}>← Previous</button>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {STAGES.map((_, i) => (
            <div key={i} style={{
              width: i === current ? '20px' : '8px', height: '8px', borderRadius: '4px',
              background: i === current ? stage.color : visited.has(i) ? stage.color + '50' : '#e5e7eb',
              transition: 'all 0.3s', cursor: 'pointer'
            }} onClick={() => goTo(i)}/>
          ))}
        </div>
        <button onClick={() => goTo(Math.min(STAGES.length - 1, current + 1))} disabled={current === STAGES.length - 1}
          style={{
            padding: '10px 24px', borderRadius: '50px',
            background: current === STAGES.length - 1 ? '#f3f4f6' : stage.color,
            border: `2px solid ${current === STAGES.length - 1 ? '#e5e7eb' : stage.color}`,
            color: current === STAGES.length - 1 ? '#9ca3af' : 'white',
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', cursor: current === STAGES.length - 1 ? 'not-allowed' : 'pointer'
          }}>Next →</button>
      </div>
    </div>
  );
}
