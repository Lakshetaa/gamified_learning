import React, { useState, useCallback, useRef } from 'react';

const WORDS = ['ROOT','STEM','LEAF','FLOWER','SEED','FRUIT','NEEM','COTTON','BAMBOO','OXYGEN'];
const GRID_SIZE = 12;

// ── Grid builder ──────────────────────────────────────────────────────────────
function buildGrid(words, size) {
  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const placed = [];

  const directions = [
    [0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]
  ];

  for (const word of words) {
    let tries = 0, ok = false;
    while (!ok && tries < 200) {
      tries++;
      const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      const cells = [];
      let valid = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + dr * i, c = col + dc * i;
        if (r < 0 || r >= size || c < 0 || c >= size) { valid = false; break; }
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) { valid = false; break; }
        cells.push([r, c]);
      }
      if (valid) {
        cells.forEach(([r,c], i) => { grid[r][c] = word[i]; });
        placed.push({ word, cells });
        ok = true;
      }
    }
  }

  // Fill remaining cells
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (grid[r][c] === '') grid[r][c] = LETTERS[Math.floor(Math.random() * 26)];

  return { grid, placed };
}

const WORD_INFO = {
  ROOT:   { emoji:'🌱', hint:'Absorbs water from soil' },
  STEM:   { emoji:'🪵', hint:'Carries water upward' },
  LEAF:   { emoji:'🍃', hint:'Makes food with sunlight' },
  FLOWER: { emoji:'🌸', hint:'Attracts bees & makes seeds' },
  SEED:   { emoji:'🌰', hint:'A baby plant inside a coat' },
  FRUIT:  { emoji:'🍎', hint:'Grows from a flower' },
  NEEM:   { emoji:'🌿', hint:'Herbal medicine plant' },
  COTTON: { emoji:'🧶', hint:'Used to make clothes' },
  BAMBOO: { emoji:'🎋', hint:'Used to build huts & baskets' },
  OXYGEN: { emoji:'💨', hint:'Gas that plants give us' },
};

const WORD_COLORS = ['#16a34a','#0284c7','#7c3aed','#dc2626','#d97706','#0891b2','#9333ea','#be185d','#059669','#78350f'];

export default function WordSearch() {
  const [{ grid, placed }] = useState(() => buildGrid(WORDS, GRID_SIZE));
  const [found,    setFound]    = useState(new Set());
  const [selecting,setSelecting]= useState(false);
  const [selCells, setSelCells] = useState([]);
  const [highlight,setHighlight]= useState({}); // key "r-c" → colorIndex
  const [wrong,    setWrong]    = useState(false);
  const [done,     setDone]     = useState(false);

  // Build a lookup: "r-c" → word
  const cellToWords = useRef({});
  placed.forEach(({word, cells}, wi) => {
    cells.forEach(([r,c]) => {
      const k = `${r}-${c}`;
      if (!cellToWords.current[k]) cellToWords.current[k] = [];
      cellToWords.current[k].push({ word, colorIdx: wi });
    });
  });

  const wordColorMap = Object.fromEntries(placed.map(({word}, i) => [word, i]));

  const startSelect = (r, c) => {
    setSelecting(true);
    setSelCells([[r,c]]);
    setWrong(false);
  };

  const extendSelect = (r, c) => {
    if (!selecting) return;
    const first = selCells[0];
    if (!first) return;
    // Only extend in straight lines
    const dr = r - first[0], dc = c - first[1];
    const len = Math.max(Math.abs(dr), Math.abs(dc));
    if (len === 0) { setSelCells([first]); return; }
    // Check if direction is valid (straight or diagonal)
    const isDiag = Math.abs(dr) === Math.abs(dc);
    const isStraight = dr === 0 || dc === 0;
    if (!isDiag && !isStraight) return;
    const stepR = len > 0 ? Math.sign(dr) : 0;
    const stepC = len > 0 ? Math.sign(dc) : 0;
    const cells = [];
    for (let i = 0; i <= len; i++) cells.push([first[0]+stepR*i, first[1]+stepC*i]);
    setSelCells(cells);
  };

  const endSelect = useCallback(() => {
    if (!selecting) return;
    setSelecting(false);
    const word = selCells.map(([r,c]) => grid[r][c]).join('');
    const wordRev = [...word].reverse().join('');
    const match = placed.find(p => p.word === word || p.word === wordRev);

    if (match && !found.has(match.word)) {
      const newFound = new Set([...found, match.word]);
      const colorIdx = wordColorMap[match.word];
      const newHL = { ...highlight };
      match.cells.forEach(([r,c]) => { newHL[`${r}-${c}`] = colorIdx; });
      setHighlight(newHL);
      setFound(newFound);
      if (newFound.size === WORDS.length) setTimeout(() => setDone(true), 400);
    } else if (selCells.length > 1) {
      setWrong(true);
      setTimeout(() => setWrong(false), 700);
    }
    setSelCells([]);
  }, [selecting, selCells, grid, placed, found, highlight, wordColorMap]);

  const isSelecting = (r, c) => selCells.some(([sr,sc]) => sr === r && sc === c);
  const hlColor = (r, c) => {
    const idx = highlight[`${r}-${c}`];
    return idx !== undefined ? WORD_COLORS[idx] : null;
  };

  const reset = () => {
    setFound(new Set()); setSelCells([]); setHighlight({});
    setWrong(false); setDone(false); setSelecting(false);
    // Rebuild grid
    window.location.reload(); // simple reset — rebuild via state
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
        borderRadius: '20px', padding: '20px 24px', marginBottom: '20px',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>🔍 Plant Word Search</div>
          <div style={{ opacity: 0.85, fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
            Find all 10 plant words hidden in the grid. Click and drag to select. No rush! 🔍
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>{found.size}/{WORDS.length}</div>
          <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: 700 }}>FOUND</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px', alignItems: 'start' }}>
        {/* Grid */}
        <div>
          <div
            style={{ display: 'inline-block', userSelect: 'none', cursor: 'crosshair',
              background: '#f8fafc', borderRadius: '16px', padding: '12px',
              border: '2px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
            onMouseLeave={endSelect}
          >
            {grid.map((row, r) => (
              <div key={r} style={{ display: 'flex' }}>
                {row.map((letter, c) => {
                  const hl = hlColor(r, c);
                  const sel = isSelecting(r, c);
                  return (
                    <div
                      key={c}
                      onMouseDown={() => startSelect(r, c)}
                      onMouseEnter={() => extendSelect(r, c)}
                      onMouseUp={endSelect}
                      onTouchStart={() => startSelect(r, c)}
                      onTouchMove={e => {
                        const t = e.touches[0];
                        const el = document.elementFromPoint(t.clientX, t.clientY);
                        if (el?.dataset.r && el?.dataset.c) extendSelect(+el.dataset.r, +el.dataset.c);
                      }}
                      onTouchEnd={endSelect}
                      data-r={r} data-c={c}
                      style={{
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700,
                        borderRadius: '6px', margin: '1px',
                        background: hl ? `${hl}30` : sel ? (wrong ? '#fee2e2' : '#dbeafe') : 'transparent',
                        color: hl ? hl : sel ? (wrong ? '#dc2626' : '#1d4ed8') : '#374151',
                        border: `2px solid ${hl ? hl+'50' : sel ? (wrong ? '#fca5a5' : '#93c5fd') : 'transparent'}`,
                        transition: 'all 0.1s',
                        transform: (hl || sel) ? 'scale(1.08)' : 'scale(1)',
                        cursor: 'crosshair', pointerEvents: 'auto'
                      }}
                    >{letter}</div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Word list */}
        <div>
          <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '14px', border: '2px solid #e2e8f0' }}>
            <div style={{ fontWeight: 900, fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Find These Words</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {WORDS.map(word => {
                const isFound = found.has(word);
                const colorIdx = wordColorMap[word];
                const color = WORD_COLORS[colorIdx];
                const info = WORD_INFO[word];
                return (
                  <div key={word} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 10px', borderRadius: '10px',
                    background: isFound ? `${color}18` : '#f1f5f9',
                    border: `2px solid ${isFound ? color+'40' : '#e2e8f0'}`,
                    transition: 'all 0.3s'
                  }}>
                    <span style={{ fontSize: '18px' }}>{info.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 900, fontSize: '13px',
                        color: isFound ? color : '#9ca3af',
                        textDecoration: isFound ? 'line-through' : 'none',
                        transition: 'all 0.3s'
                      }}>{word}</div>
                      {isFound && <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>{info.hint}</div>}
                    </div>
                    {isFound && <span style={{ fontSize: '14px' }}>✅</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Win banner */}
      {done && (
        <div style={{
          marginTop: '20px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
          borderRadius: '20px', padding: '28px', textAlign: 'center',
          border: '3px solid #60a5fa', animation: 'popIn 0.4s ease'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '10px' }}>🔍</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#1d4ed8', marginBottom: '6px' }}>
            All 10 words found!
          </div>
          <div style={{ color: '#1e40af', fontWeight: 700 }}>
            You're a Plant Vocabulary Champion! 🌱🪵🌸💧
          </div>
        </div>
      )}
    </div>
  );
}
