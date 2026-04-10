import React, { useState, useEffect, useRef } from 'react';

const MAX_WATER  = 100;
const MAX_SUN    = 100;
const MAX_AIR    = 100;
const GROW_STAGES = [
  { name: 'Dry Seed',    emoji: '🌰', minWater: 0,  minSun: 0,  minAir: 0,  color: '#92400e', desc: 'Give your seed water, sunlight and air to wake it up!' },
  { name: 'Soaked Seed', emoji: '💧', minWater: 25, minSun: 0,  minAir: 0,  color: '#0284c7', desc: 'Good! The seed is absorbing water. Now add some sunlight and air!' },
  { name: 'Cracking!',   emoji: '🌿', minWater: 40, minSun: 20, minAir: 15, color: '#78350f', desc: 'The seed coat is cracking open. Keep going!' },
  { name: 'Root Out!',   emoji: '🌱', minWater: 55, minSun: 35, minAir: 30, color: '#166534', desc: 'A tiny root is growing down. Almost there!' },
  { name: 'Sprout Up!',  emoji: '🪴', minWater: 70, minSun: 55, minAir: 50, color: '#15803d', desc: 'A shoot is pushing upward toward the light!' },
  { name: 'Seedling!',   emoji: '🌿', minWater: 80, minSun: 70, minAir: 65, color: '#16a34a', desc: 'First leaves are open! The plant can make its own food now!' },
  { name: 'Young Plant!',emoji: '🌳', minWater: 90, minSun: 85, minAir: 80, color: '#14532d', desc: 'Congratulations! Your plant is growing strong! 🎉' },
];

function getStage(water, sun, air) {
  for (let i = GROW_STAGES.length - 1; i >= 0; i--) {
    const s = GROW_STAGES[i];
    if (water >= s.minWater && sun >= s.minSun && air >= s.minAir) return i;
  }
  return 0;
}

function PlantDisplay({ stageIdx, water, sun, air }) {
  const stage = GROW_STAGES[stageIdx];
  const heights = [0, 0, 4, 12, 28, 50, 80, 110];
  const stemH = heights[stageIdx] || 0;

  return (
    <div style={{
      width: '100%', height: '220px', position: 'relative',
      background: 'linear-gradient(180deg, #e0f2fe 0%, #dcfce7 60%, #fef3c7 100%)',
      borderRadius: '16px', overflow: 'hidden', border: '2px solid #4ade8040'
    }}>
      {/* Sun */}
      {sun > 20 && (
        <div style={{ position: 'absolute', top: '12px', right: '16px', fontSize: `${Math.min(32, 16 + sun/5)}px`,
          animation: 'float 3s ease-in-out infinite', filter: `brightness(${0.7 + sun/300})` }}>☀️</div>
      )}
      {/* Clouds (air) */}
      {air > 20 && <div style={{ position: 'absolute', top: '10px', left: '14px', fontSize: '22px', opacity: air/120 }}>☁️</div>}
      {air > 50 && <div style={{ position: 'absolute', top: '18px', left: '40px', fontSize: '16px', opacity: air/150 }}>🌬️</div>}
      {/* Rain drops */}
      {water > 20 && [1,2,3].map(i => (
        <div key={i} style={{ position: 'absolute', top: `${5+i*6}px`, left: `${25+i*18}px`, fontSize: '14px',
          opacity: water/120, animation: `fall ${1+i*0.3}s ease-in infinite`, animationDelay: `${i*0.4}s` }}>💧</div>
      ))}

      {/* Ground */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '52px',
        background: 'linear-gradient(180deg, #92400e, #78350f)', borderRadius: '0 0 14px 14px' }}>
        <div style={{ position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>SOIL</div>
      </div>

      {/* Stem */}
      {stemH > 0 && (
        <div style={{
          position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)',
          width: '8px', height: `${stemH}px`, background: '#16a34a',
          borderRadius: '4px 4px 2px 2px', transition: 'height 0.6s ease'
        }}/>
      )}

      {/* Plant emoji */}
      <div style={{
        position: 'absolute',
        bottom: stageIdx >= 2 ? `${48 + stemH - 4}px` : '44px',
        left: '50%', transform: 'translateX(-50%)',
        fontSize: stageIdx === 6 ? '52px' : stageIdx >= 4 ? '36px' : '28px',
        transition: 'all 0.5s ease',
        animation: stageIdx >= 5 ? 'float 3s ease-in-out infinite' : 'none',
        filter: stageIdx === 0 ? 'grayscale(0.4) opacity(0.7)' : 'none'
      }}>{stage.emoji}</div>

      {/* Stage label */}
      <div style={{
        position: 'absolute', bottom: '56px', left: '50%', transform: 'translateX(-50%) translateX(28px)',
        background: stage.color, color: 'white', borderRadius: '50px', padding: '3px 10px',
        fontSize: '10px', fontWeight: 900, whiteSpace: 'nowrap', opacity: 0.9
      }}>{stage.name}</div>
    </div>
  );
}

function ResourceBar({ label, emoji, value, color, onAdd, hint }) {
  const overfed = value >= MAX_WATER * 0.95;
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ fontWeight: 800, fontSize: '14px', color: '#374151', display: 'flex', gap: '6px', alignItems: 'center' }}>
          {emoji} {label}
        </div>
        <span style={{ fontSize: '13px', fontWeight: 800, color }}>{Math.round(value)}%</span>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '50px', height: '14px', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
          <div style={{
            height: '100%', borderRadius: '50px', background: `linear-gradient(90deg, ${color}99, ${color})`,
            width: `${value}%`, transition: 'width 0.4s ease'
          }}/>
        </div>
        <button
          onClick={onAdd}
          disabled={overfed}
          style={{
            width: '40px', height: '40px', borderRadius: '50%', border: 'none',
            background: overfed ? '#f1f5f9' : `linear-gradient(135deg, ${color}, ${color}cc)`,
            fontSize: '18px', cursor: overfed ? 'not-allowed' : 'pointer',
            boxShadow: overfed ? 'none' : `0 3px 8px ${color}50`,
            transition: 'all 0.2s', transform: overfed ? 'none' : 'scale(1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          title={hint}
        >{overfed ? '✅' : emoji}</button>
      </div>
      {hint && <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, marginTop: '3px' }}>{hint}</div>}
    </div>
  );
}

export default function GrowYourSeed() {
  const [water, setWater] = useState(0);
  const [sun,   setSun]   = useState(0);
  const [air,   setAir]   = useState(0);
  const [log,   setLog]   = useState(['🌰 You have a dry seed. Help it grow!']);
  const prevStageRef = useRef(0);

  const stageIdx = getStage(water, sun, air);
  const stage = GROW_STAGES[stageIdx];

  useEffect(() => {
    if (stageIdx !== prevStageRef.current) {
      setLog(prev => [`✨ Stage ${stageIdx + 1}: ${stage.name}! ${stage.desc}`, ...prev.slice(0, 4)]);
      prevStageRef.current = stageIdx;
    }
  }, [stageIdx]);

  const addWater = () => {
    const amt = 12 + Math.random() * 6;
    setWater(w => Math.min(MAX_WATER, w + amt));
    setLog(prev => ['💧 You watered the seed!', ...prev.slice(0, 4)]);
  };
  const addSun = () => {
    const amt = 10 + Math.random() * 8;
    setSun(s => Math.min(MAX_SUN, s + amt));
    setLog(prev => ['☀️ Sunlight absorbed!', ...prev.slice(0, 4)]);
  };
  const addAir = () => {
    const amt = 10 + Math.random() * 7;
    setAir(a => Math.min(MAX_AIR, a + amt));
    setLog(prev => ['🌬️ Fresh air provided!', ...prev.slice(0, 4)]);
  };

  const reset = () => {
    setWater(0); setSun(0); setAir(0);
    setLog(['🌰 You have a dry seed. Help it grow!']);
    prevStageRef.current = 0;
  };

  const allDone = stageIdx === GROW_STAGES.length - 1;

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #78350f, #a16207)',
        borderRadius: '20px', padding: '20px 24px', marginBottom: '20px',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>🌱 Grow Your Seed!</div>
          <div style={{ opacity: 0.85, fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
            Press the buttons to give your seed what it needs — watch it grow!
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '8px 14px',
          textAlign: 'center'
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>{stage.emoji}</div>
          <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.85 }}>Stage {stageIdx+1}/7</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
        {/* Left: plant + log */}
        <div>
          <PlantDisplay stageIdx={stageIdx} water={water} sun={sun} air={air} />

          <div style={{
            marginTop: '14px', background: '#f8fafc', borderRadius: '14px',
            padding: '14px', border: '2px solid #e2e8f0', maxHeight: '110px', overflowY: 'auto'
          }}>
            {log.map((entry, i) => (
              <div key={i} style={{
                fontSize: '13px', fontWeight: 700, color: i === 0 ? '#374151' : '#9ca3af',
                padding: '3px 0', borderBottom: i < log.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'color 0.3s'
              }}>{entry}</div>
            ))}
          </div>
        </div>

        {/* Right: controls */}
        <div>
          <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '2px solid #e2e8f0' }}>
            <div style={{ fontWeight: 900, fontSize: '13px', color: '#374151', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🎮 Seed Controls
            </div>
            <ResourceBar label="Water" emoji="💧" value={water} color="#0284c7" onAdd={addWater} hint="Seeds need water to germinate" />
            <ResourceBar label="Sunlight" emoji="☀️" value={sun} color="#d97706" onAdd={addSun} hint="Warmth activates the seed" />
            <ResourceBar label="Air (O₂)" emoji="🌬️" value={air} color="#16a34a" onAdd={addAir} hint="Seeds need oxygen to breathe" />
          </div>

          {/* Current stage info */}
          <div style={{
            marginTop: '12px', background: `${stage.color}15`, borderRadius: '14px',
            padding: '14px', border: `2px solid ${stage.color}30`
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: stage.color, marginBottom: '6px' }}>
              {stage.emoji} {stage.name}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', lineHeight: 1.6 }}>
              {stage.desc}
            </div>
          </div>

          <button onClick={reset} style={{
            width: '100%', marginTop: '12px', background: '#fff7ed',
            border: '2px solid #fed7aa', borderRadius: '12px', padding: '10px',
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '13px',
            cursor: 'pointer', color: '#92400e'
          }}>🔄 Start Over</button>
        </div>
      </div>

      {/* Win state */}
      {allDone && (
        <div style={{
          marginTop: '20px', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
          borderRadius: '20px', padding: '28px', textAlign: 'center',
          border: '3px solid #4ade80', animation: 'popIn 0.4s ease'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '10px' }}>🌳</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#14532d', marginBottom: '8px' }}>
            Your seed grew into a plant!
          </div>
          <div style={{ color: '#166534', fontWeight: 700, marginBottom: '16px', lineHeight: 1.7 }}>
            You gave it 💧 Water + ☀️ Sunlight + 🌬️ Air — the three things every seed needs to germinate!
          </div>
          <button onClick={reset} style={{
            background: '#16a34a', color: 'white', border: 'none', borderRadius: '50px',
            padding: '12px 28px', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '15px', cursor: 'pointer'
          }}>🌱 Grow Again!</button>
        </div>
      )}
    </div>
  );
}
