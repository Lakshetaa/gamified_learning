import React, { useState } from 'react';

/* ─────────────────────────────────────────
   1. SORT IT OUT — drag items into categories
──────────────────────────────────────────── */
export function SortActivity({ items, categories, onComplete }) {
  const [buckets, setBuckets] = useState(() => {
    const b = {}; categories.forEach(c => { b[c.id] = []; }); return b;
  });
  const [remaining, setRemaining] = useState([...items]);
  const [dragging, setDragging] = useState(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const handleDragStart = (item, from) => setDragging({ item, from });

  const handleDrop = (catId) => {
    if (!dragging) return;
    const { item, from } = dragging;
    if (from === 'remaining') setRemaining(r => r.filter(i => i.id !== item.id));
    else setBuckets(b => ({ ...b, [from]: b[from].filter(i => i.id !== item.id) }));
    setBuckets(b => ({ ...b, [catId]: [...b[catId], item] }));
    setDragging(null); setDragOver(null);
  };

  const handleDropBack = () => {
    if (!dragging || dragging.from === 'remaining') return;
    const { item, from } = dragging;
    setBuckets(b => ({ ...b, [from]: b[from].filter(i => i.id !== item.id) }));
    setRemaining(r => [...r, item]);
    setDragging(null);
  };

  const checkAnswers = () => {
    let correct = 0; let total = 0;
    const res = {};
    categories.forEach(cat => {
      res[cat.id] = buckets[cat.id].map(item => {
        total++;
        const ok = item.category === cat.id;
        if (ok) correct++;
        return { ...item, correct: ok };
      });
    });
    setResults(res); setChecked(true);
    if (correct === total && total > 0) setTimeout(() => onComplete && onComplete(), 800);
  };

  const reset = () => {
    setBuckets(() => { const b = {}; categories.forEach(c => { b[c.id] = []; }); return b; });
    setRemaining([...items]); setChecked(false); setResults(null);
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div onDragOver={e => e.preventDefault()} onDrop={handleDropBack}
        style={{ minHeight: '72px', background: 'rgba(255,255,255,0.6)', borderRadius: '16px',
          padding: '16px', marginBottom: '20px', border: '2px dashed rgba(0,0,0,0.15)',
          display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        {remaining.length === 0
          ? <span style={{ color: '#9ca3af', fontWeight: 700, fontSize: '14px' }}>✅ All items placed!</span>
          : remaining.map(item => (
            <div key={item.id} draggable onDragStart={() => handleDragStart(item, 'remaining')}
              style={{ background: 'white', borderRadius: '10px', padding: '10px 16px', border: '2px solid #e5e7eb',
                cursor: 'grab', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center',
                gap: '8px', userSelect: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <span>{item.emoji}</span>{item.label}
            </div>
          ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${categories.length}, 1fr)`, gap: '16px', marginBottom: '20px' }}>
        {categories.map(cat => (
          <div key={cat.id}
            onDragOver={e => { e.preventDefault(); setDragOver(cat.id); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => handleDrop(cat.id)}
            style={{ borderRadius: '16px', padding: '16px', minHeight: '120px',
              background: dragOver === cat.id ? cat.highlightBg : cat.bg,
              border: `2px dashed ${dragOver === cat.id ? cat.borderActive : cat.border}`,
              transition: 'all 0.2s' }}>
            <div style={{ fontWeight: 900, fontSize: '14px', marginBottom: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '20px' }}>{cat.emoji}</span>{cat.label}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(checked ? results[cat.id] : buckets[cat.id]).map(item => (
                <div key={item.id} draggable={!checked} onDragStart={() => !checked && handleDragStart(item, cat.id)}
                  style={{ background: checked ? (item.correct ? '#dcfce7' : '#fee2e2') : 'white', borderRadius: '8px',
                    padding: '8px 12px', border: `2px solid ${checked ? (item.correct ? '#4ade80' : '#fca5a5') : '#e5e7eb'}`,
                    fontWeight: 700, fontSize: '13px', cursor: checked ? 'default' : 'grab',
                    display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {checked && <span>{item.correct ? '✅' : '❌'}</span>}
                  <span>{item.emoji}</span>{item.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {!checked
          ? <button onClick={checkAnswers} disabled={remaining.length > 0}
              style={{ padding: '12px 24px', background: remaining.length > 0 ? '#e5e7eb' : '#16a34a',
                color: remaining.length > 0 ? '#9ca3af' : 'white', border: 'none', borderRadius: '12px',
                fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '15px', cursor: remaining.length > 0 ? 'not-allowed' : 'pointer' }}>
              ✅ Check Answers
            </button>
          : <button onClick={reset}
              style={{ padding: '12px 24px', background: '#7c3aed', color: 'white', border: 'none',
                borderRadius: '12px', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>
              🔄 Try Again
            </button>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   2. FLIP CARDS — click to reveal facts
──────────────────────────────────────────── */
export function FlipCards({ cards }) {
  const [flipped, setFlipped] = useState(new Set());
  const toggle = (i) => setFlipped(f => { const n = new Set(f); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
      {cards.map((card, i) => (
        <div key={i} onClick={() => toggle(i)} style={{ perspective: '600px', cursor: 'pointer', height: '160px' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d',
            transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
            transform: flipped.has(i) ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
            <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: '16px',
              background: card.frontBg || 'linear-gradient(135deg,#dcfce7,#bbf7d0)', border: '2px solid rgba(74,222,128,0.3)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '40px', marginBottom: '10px' }}>{card.emoji}</span>
              <div style={{ fontWeight: 900, fontSize: '15px', color: '#14532d' }}>{card.front}</div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px', fontWeight: 600 }}>Tap to flip!</div>
            </div>
            <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
              borderRadius: '16px', background: card.backBg || 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '13px', color: 'white', lineHeight: 1.6 }}>{card.back}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   3. LABEL THE DIAGRAM — click parts to learn
──────────────────────────────────────────── */
export function LabelDiagram({ parts, title }) {
  const [active, setActive] = useState(null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
      <div style={{ position: 'relative', background: 'linear-gradient(180deg,#f0fdf4,#dcfce7)', borderRadius: '20px',
        padding: '24px', border: '2px solid #4ade80', minHeight: '340px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{title}</div>
        {parts.map((part, i) => (
          <div key={i} onClick={() => setActive(active === i ? null : i)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
              background: active === i ? part.color + '22' : 'transparent',
              border: `2px solid ${active === i ? part.color : 'transparent'}`, marginBottom: '4px' }}>
            <span style={{ fontSize: part.size || '28px' }}>{part.emoji}</span>
            <div style={{ marginLeft: '10px', fontWeight: 800, fontSize: '14px', color: active === i ? part.color : '#374151' }}>{part.label}</div>
            <div style={{ marginLeft: 'auto', fontSize: '18px', opacity: active === i ? 1 : 0.3 }}>{active === i ? '◀' : '▶'}</div>
          </div>
        ))}
      </div>
      <div style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {active === null
          ? <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👈</div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Click any part to learn about it!</div>
            </div>
          : <div style={{ background: 'white', borderRadius: '20px', padding: '28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: `3px solid ${parts[active].color}44`,
              animation: 'slideIn 0.3s ease' }}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>{parts[active].emoji}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: parts[active].color, marginBottom: '10px' }}>{parts[active].label}</div>
              <p style={{ fontWeight: 600, fontSize: '15px', color: '#374151', lineHeight: 1.7, marginBottom: '12px' }}>{parts[active].description}</p>
              {parts[active].funFact && (
                <div style={{ background: '#fef3c7', borderRadius: '12px', padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: '#78350f', display: 'flex', gap: '8px' }}>
                  <span>💡</span>{parts[active].funFact}
                </div>
              )}
            </div>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   4. FILL IN THE BLANK
──────────────────────────────────────────── */
export function FillBlank({ sentences, onComplete }) {
  const [inputs, setInputs] = useState(sentences.map(() => ''));
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const isCorrect = (i) => sentences[i].answers.some(a => a.toLowerCase() === inputs[i].trim().toLowerCase());

  const check = () => {
    const s = sentences.filter((_, i) => isCorrect(i)).length;
    setScore(s); setChecked(true);
    if (s === sentences.length) setTimeout(() => onComplete && onComplete(), 600);
  };

  return (
    <div>
      {sentences.map((sent, i) => (
        <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '20px 22px', marginBottom: '14px',
          border: `2px solid ${checked ? (isCorrect(i) ? '#4ade80' : '#fca5a5') : '#e5e7eb'}` }}>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#374151', marginBottom: '12px', lineHeight: 1.8 }}>
            {sent.before}
            <input value={inputs[i]}
              onChange={e => { if (!checked) { const n = [...inputs]; n[i] = e.target.value; setInputs(n); }}}
              disabled={checked} placeholder="…"
              style={{ display: 'inline-block', margin: '0 8px',
                border: `2px solid ${checked ? (isCorrect(i) ? '#4ade80' : '#ef4444') : '#7c3aed'}`,
                borderRadius: '8px', padding: '4px 12px', fontFamily: 'var(--font-body)',
                fontWeight: 800, fontSize: '15px', outline: 'none',
                background: checked ? (isCorrect(i) ? '#dcfce7' : '#fee2e2') : 'white',
                width: `${Math.max(sent.answers[0].length * 12 + 30, 80)}px`, textAlign: 'center' }} />
            {sent.after}
          </div>
          {checked && (
            <div style={{ fontSize: '13px', fontWeight: 700, color: isCorrect(i) ? '#16a34a' : '#dc2626', display: 'flex', gap: '6px' }}>
              {isCorrect(i) ? '✅ Correct!' : <><span>❌</span>Answer: <strong>{sent.answers[0]}</strong> — {sent.hint}</>}
            </div>
          )}
        </div>
      ))}
      {checked
        ? <div style={{ background: score === sentences.length ? '#dcfce7' : '#fef3c7', borderRadius: '14px', padding: '16px 20px',
            border: `2px solid ${score === sentences.length ? '#4ade80' : '#fbbf24'}`, fontWeight: 800, fontSize: '16px',
            color: score === sentences.length ? '#16a34a' : '#92400e', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {score === sentences.length ? '🎉 Perfect!' : `🌟 ${score}/${sentences.length} correct!`}
            <button onClick={() => { setChecked(false); setInputs(sentences.map(() => '')); }}
              style={{ marginLeft: 'auto', padding: '8px 16px', background: '#7c3aed', color: 'white', border: 'none',
                borderRadius: '10px', fontFamily: 'var(--font-body)', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}>
              🔄 Retry
            </button>
          </div>
        : <button onClick={check} disabled={inputs.some(v => !v.trim())}
            style={{ padding: '12px 28px', background: inputs.some(v => !v.trim()) ? '#e5e7eb' : '#16a34a',
              color: inputs.some(v => !v.trim()) ? '#9ca3af' : 'white', border: 'none',
              borderRadius: '12px', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '15px',
              cursor: inputs.some(v => !v.trim()) ? 'not-allowed' : 'pointer' }}>
            ✅ Check Answers
          </button>}
    </div>
  );
}

/* ─────────────────────────────────────────
   5. MATCH IT — click pairs to connect
──────────────────────────────────────────── */
export function MatchActivity({ pairs, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState({});
  const [wrong, setWrong] = useState(null);
  const [shuffledRights] = useState(() => [...pairs].sort(() => Math.random() - 0.5));

  const handleRight = (id) => {
    if (!selected || matched[selected] || wrong) return;
    if (id === selected) {
      const nm = { ...matched, [id]: true };
      setMatched(nm); setSelected(null);
      if (Object.keys(nm).length === pairs.length) setTimeout(() => onComplete && onComplete(), 600);
    } else {
      setWrong(id);
      setTimeout(() => { setWrong(null); setSelected(null); }, 800);
    }
  };

  return (
    <div>
      {Object.keys(matched).length === pairs.length && (
        <div style={{ background: '#dcfce7', borderRadius: '14px', padding: '16px', marginBottom: '16px',
          textAlign: 'center', fontWeight: 800, color: '#16a34a', fontSize: '17px' }}>
          🎉 Perfect Match! All correct!
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: '#6b7280', marginBottom: '4px' }}>👈 Click to select</div>
          {pairs.map(item => (
            <div key={item.id} onClick={() => !matched[item.id] && setSelected(item.id)}
              style={{ padding: '14px 18px', borderRadius: '14px', cursor: matched[item.id] ? 'default' : 'pointer',
                background: matched[item.id] ? '#dcfce7' : selected === item.id ? '#ede9fe' : 'white',
                border: `2px solid ${matched[item.id] ? '#4ade80' : selected === item.id ? '#7c3aed' : '#e5e7eb'}`,
                display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '14px',
                transition: 'all 0.2s', transform: selected === item.id ? 'scale(1.03)' : 'scale(1)' }}>
              <span style={{ fontSize: '22px' }}>{item.leftEmoji}</span>{item.left}
              {matched[item.id] && <span style={{ marginLeft: 'auto' }}>✅</span>}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: '#6b7280', marginBottom: '4px' }}>👉 Click to match</div>
          {shuffledRights.map(item => (
            <div key={item.id} onClick={() => handleRight(item.id)}
              style={{ padding: '14px 18px', borderRadius: '14px',
                cursor: matched[item.id] ? 'default' : selected ? 'pointer' : 'default',
                background: matched[item.id] ? '#dcfce7' : wrong === item.id ? '#fee2e2' : 'white',
                border: `2px solid ${matched[item.id] ? '#4ade80' : wrong === item.id ? '#ef4444' : selected ? '#a78bfa' : '#e5e7eb'}`,
                display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '14px', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '22px' }}>{item.rightEmoji}</span>{item.right}
              {matched[item.id] && <span style={{ marginLeft: 'auto' }}>✅</span>}
            </div>
          ))}
        </div>
      </div>
      {selected && Object.keys(matched).length < pairs.length && (
        <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: 700, color: '#7c3aed' }}>
          👆 Now click the matching answer on the right!
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   6. STEP SEQUENCE — animated step reveal
──────────────────────────────────────────── */
export function StepSequence({ steps }) {
  const [revealed, setRevealed] = useState(0);
  return (
    <div>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '12px', opacity: i <= revealed ? 1 : 0.35, transition: 'opacity 0.4s' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%',
              background: i < revealed ? '#16a34a' : i === revealed ? '#7c3aed' : '#e5e7eb',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '16px', transition: 'all 0.4s' }}>
              {i < revealed ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && <div style={{ width: '2px', flex: 1, minHeight: '20px', margin: '4px 0', background: i < revealed ? '#4ade80' : '#e5e7eb', transition: 'background 0.4s' }} />}
          </div>
          <div style={{ flex: 1, background: i <= revealed ? 'white' : '#f9fafb', borderRadius: '14px', padding: '16px 20px', marginBottom: '4px',
            border: `2px solid ${i === revealed ? '#7c3aed' : i < revealed ? '#4ade80' : '#e5e7eb'}`, transition: 'all 0.4s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>{step.emoji}</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: '15px', color: '#14532d' }}>{step.title}</div>
                {i <= revealed && (
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#374151', marginTop: '4px', lineHeight: 1.6, animation: 'fadeIn 0.4s ease' }}>
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {revealed < steps.length - 1
        ? <button onClick={() => setRevealed(r => r + 1)}
            style={{ padding: '12px 24px', background: '#7c3aed', color: 'white', border: 'none',
              borderRadius: '12px', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>
            ▶ Next Step
          </button>
        : <div style={{ background: '#dcfce7', borderRadius: '12px', padding: '14px 18px', fontWeight: 800, color: '#16a34a', fontSize: '15px' }}>
            🎉 You've seen all the steps!
          </div>}
    </div>
  );
}

/* ─────────────────────────────────────────
   7. TRUE / FALSE QUICK FIRE
──────────────────────────────────────────── */
export function TrueFalse({ statements, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  const check = () => {
    setChecked(true);
    const allCorrect = statements.every((s, i) => answers[i] === s.answer);
    if (allCorrect) setTimeout(() => onComplete && onComplete(), 600);
  };

  const score = checked ? statements.filter((s, i) => answers[i] === s.answer).length : 0;

  return (
    <div>
      {statements.map((s, i) => (
        <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '18px 20px', marginBottom: '12px',
          border: `2px solid ${checked ? (answers[i] === s.answer ? '#4ade80' : '#fca5a5') : '#e5e7eb'}` }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#374151', marginBottom: '12px', display: 'flex', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>{s.emoji}</span>{s.statement}
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[true, false].map(v => (
              <button key={String(v)} onClick={() => !checked && setAnswers(a => ({ ...a, [i]: v }))}
                style={{ padding: '10px 24px', borderRadius: '10px',
                  border: `2px solid ${answers[i] === v ? (v ? '#16a34a' : '#ef4444') : '#e5e7eb'}`,
                  fontFamily: 'var(--font-body)', fontWeight: 900, fontSize: '14px', cursor: checked ? 'default' : 'pointer',
                  background: answers[i] === v ? (v ? '#dcfce7' : '#fee2e2') : '#f9fafb',
                  color: answers[i] === v ? (v ? '#16a34a' : '#dc2626') : '#6b7280', transition: 'all 0.2s' }}>
                {v ? '✅ TRUE' : '❌ FALSE'}
              </button>
            ))}
            {checked && answers[i] !== s.answer && (
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626', alignSelf: 'center' }}>
                💡 {s.explanation}
              </div>
            )}
          </div>
        </div>
      ))}
      {!checked
        ? <button onClick={check} disabled={Object.keys(answers).length < statements.length}
            style={{ padding: '12px 28px', background: Object.keys(answers).length < statements.length ? '#e5e7eb' : '#16a34a',
              color: Object.keys(answers).length < statements.length ? '#9ca3af' : 'white', border: 'none',
              borderRadius: '12px', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '15px',
              cursor: Object.keys(answers).length < statements.length ? 'not-allowed' : 'pointer' }}>
            ✅ Submit
          </button>
        : <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px 18px', fontWeight: 800, fontSize: '15px',
            color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {score === statements.length ? '🏆 All Correct!' : `🌟 ${score}/${statements.length} Correct`}
            <button onClick={() => { setChecked(false); setAnswers({}); }}
              style={{ marginLeft: 'auto', padding: '6px 14px', background: '#7c3aed', color: 'white', border: 'none',
                borderRadius: '8px', fontFamily: 'var(--font-body)', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}>
              🔄 Retry
            </button>
          </div>}
    </div>
  );
}

/* ─────────────────────────────────────────
   MASTER EXPORT
──────────────────────────────────────────── */
export default function InteractiveModule({ config, onComplete }) {
  if (!config) return null;
  const props = { ...config, onComplete };
  switch (config.type) {
    case 'sort':      return <SortActivity {...props} />;
    case 'flip':      return <FlipCards {...props} />;
    case 'diagram':   return <LabelDiagram {...props} />;
    case 'fillblank': return <FillBlank {...props} />;
    case 'match':     return <MatchActivity {...props} />;
    case 'sequence':  return <StepSequence {...props} />;
    case 'truefalse': return <TrueFalse {...props} />;
    default:          return null;
  }
}
