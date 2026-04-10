import React, { useState, useCallback } from 'react';

// ── Item cards — the things to classify ──────────────────────────────────────
const LIVING_ITEMS = [
  { id: 'tree',      emoji: '🌳', label: 'Tree'      },
  { id: 'fish',      emoji: '🐟', label: 'Fish'      },
  { id: 'butterfly', emoji: '🦋', label: 'Butterfly' },
  { id: 'worm',      emoji: '🪱', label: 'Earthworm' },
];
const NONLIVING_ITEMS = [
  { id: 'stone', emoji: '🪨', label: 'Stone' },
  { id: 'car',   emoji: '🚗', label: 'Car'   },
  { id: 'chair', emoji: '🪑', label: 'Chair' },
  { id: 'book',  emoji: '📚', label: 'Book'  },
];

// 4 Living item cards + 4 Living category cards = 4 matches possible
// 4 Non-Living item cards + 4 Non-Living category cards = 4 matches possible
// Any Living ITEM can match any Living CATEGORY card (and vice versa for Non-Living)

function buildDeck() {
  const cards = [
    ...LIVING_ITEMS.map(c    => ({ uid: `item-${c.id}`,       type: 'item',     isLiving: true,  emoji: c.emoji, label: c.label        })),
    ...NONLIVING_ITEMS.map(c => ({ uid: `item-${c.id}`,       type: 'item',     isLiving: false, emoji: c.emoji, label: c.label        })),
    ...LIVING_ITEMS.map((_, i)    => ({ uid: `cat-living-${i}`,    type: 'category', isLiving: true,  emoji: '🌿', label: 'Living Thing' })),
    ...NONLIVING_ITEMS.map((_, i) => ({ uid: `cat-nonliving-${i}`, type: 'category', isLiving: false, emoji: '🪨', label: 'Non-Living'   })),
  ];
  return cards.sort(() => Math.random() - 0.5);
}

const TOTAL_PAIRS = 8;

export default function MemoryGame() {
  const [deck, setDeck]               = useState(() => buildDeck());
  const [matchedUids, setMatchedUids] = useState(new Set());
  const [flipped, setFlipped]         = useState([]);
  const [wrong, setWrong]             = useState([]);
  const [moves, setMoves]             = useState(0);
  const [done, setDone]               = useState(false);

  const pairsMatched = matchedUids.size / 2;

  const handleFlip = useCallback((idx) => {
    if (flipped.length === 2) return;
    if (flipped.includes(idx)) return;
    if (matchedUids.has(deck[idx].uid)) return;
    if (wrong.includes(idx)) return;

    const next = [...flipped, idx];
    setFlipped(next);

    if (next.length === 2) {
      setMoves(m => m + 1);
      const cardA = deck[next[0]];
      const cardB = deck[next[1]];

      // MATCH RULE: one must be 'item', the other 'category', BOTH same isLiving
      const isMatch = cardA.type !== cardB.type && cardA.isLiving === cardB.isLiving;

      if (isMatch) {
        const newMatched = new Set([...matchedUids, cardA.uid, cardB.uid]);
        setMatchedUids(newMatched);
        setFlipped([]);
        if (newMatched.size / 2 >= TOTAL_PAIRS) setTimeout(() => setDone(true), 500);
      } else {
        setWrong(next);
        setTimeout(() => { setFlipped([]); setWrong([]); }, 1000);
      }
    }
  }, [flipped, matchedUids, wrong, deck]);

  const reset = () => {
    setDeck(buildDeck());
    setFlipped([]); setMatchedUids(new Set()); setWrong([]);
    setMoves(0); setDone(false);
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f766e, #0d9488)',
        borderRadius: '20px', padding: '20px 24px', marginBottom: '16px',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>🧠 Memory Match</div>
          <div style={{ opacity: 0.85, fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
            Match item cards with their category — any Living item 🌿 with any Living card, any Non-Living 🪨 with any Non-Living card!
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>{moves}</div>
            <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: 700 }}>MOVES</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>{pairsMatched}/{TOTAL_PAIRS}</div>
            <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: 700 }}>PAIRS</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#e5e7eb', borderRadius: '50px', height: '10px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '50px',
          background: 'linear-gradient(90deg, #0d9488, #4ade80)',
          width: `${(pairsMatched / TOTAL_PAIRS) * 100}%`,
          transition: 'width 0.5s ease'
        }}/>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ background: '#dcfce7', borderRadius: '50px', padding: '5px 14px', fontSize: '12px', fontWeight: 800, color: '#166534', border: '2px solid #4ade80' }}>
          🌿 Living Things = can grow, breathe, reproduce
        </div>
        <div style={{ background: '#f1f5f9', borderRadius: '50px', padding: '5px 14px', fontSize: '12px', fontWeight: 800, color: '#475569', border: '2px solid #cbd5e1' }}>
          🪨 Non-Living = cannot grow or breathe
        </div>
      </div>

      {/* Grid — 4 columns × 4 rows = 16 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px', position: 'relative' }}>
        {deck.map((card, idx) => {
          const matched  = matchedUids.has(card.uid);
          const isFlipped = flipped.includes(idx) || matched;
          const isWrong   = wrong.includes(idx);

          return (
            <div key={card.uid} onClick={() => handleFlip(idx)} style={{
              height: '86px', borderRadius: '14px',
              cursor: matched ? 'default' : 'pointer',
              perspective: '600px', userSelect: 'none',
              transform: matched ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.2s'
            }}>
              <div style={{
                width: '100%', height: '100%', position: 'relative',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)'
              }}>
                {/* Back face */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #134e4a, #0f766e)',
                  borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', border: '2px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
                }}>🌿</div>

                {/* Front face */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: matched ? (card.isLiving ? '#dcfce7' : '#f1f5f9') : isWrong ? '#fee2e2' : 'white',
                  borderRadius: '14px',
                  border: `2.5px solid ${matched ? (card.isLiving ? '#4ade80' : '#94a3b8') : isWrong ? '#fca5a5' : '#e5e7eb'}`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '6px',
                }}>
                  <div style={{ fontSize: '24px', lineHeight: 1 }}>{card.emoji}</div>
                  <div style={{
                    fontSize: '10px', fontWeight: 900, textAlign: 'center', lineHeight: 1.2,
                    color: matched ? (card.isLiving ? '#166534' : '#475569') : '#374151'
                  }}>{card.label}</div>
                  {card.type === 'category' && !matched && (
                    <div style={{
                      fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '50px',
                      background: card.isLiving ? '#dcfce7' : '#f1f5f9',
                      color: card.isLiving ? '#166534' : '#475569',
                      border: `1px solid ${card.isLiving ? '#4ade80' : '#cbd5e1'}`
                    }}>CATEGORY</div>
                  )}
                  {matched && <div style={{ fontSize: '11px' }}>✅</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>
          💡 Flip an item card (🌳🐟🦋🪱🪨🚗🪑📚) then flip a CATEGORY card (🌿 or 🪨) — if they match, you score!
        </div>
        <button onClick={reset} style={{
          background: '#f1f5f9', border: '2px solid #e2e8f0', borderRadius: '50px',
          padding: '8px 18px', fontFamily: 'var(--font-body)', fontWeight: 800,
          fontSize: '13px', cursor: 'pointer', color: '#475569', whiteSpace: 'nowrap', flexShrink: 0
        }}>🔄 New Game</button>
      </div>

      {/* Win overlay */}
      {done && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
          borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
        }}>
          <div style={{
            background: 'white', borderRadius: '24px', padding: '36px',
            textAlign: 'center', maxWidth: '320px'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '10px' }}>🏆</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#0f766e', marginBottom: '6px' }}>
              All pairs matched!
            </div>
            <div style={{ color: '#6b7280', fontWeight: 600, marginBottom: '10px' }}>
              Done in {moves} moves
            </div>
            <div style={{ fontSize: '34px', margin: '10px 0' }}>⭐⭐⭐</div>
            <div style={{ fontWeight: 700, color: '#374151', marginBottom: '18px', fontSize: '13px', lineHeight: 1.6 }}>
              🌟 Brilliant! Living things grow, breathe & reproduce. Non-living things do not!
            </div>
            <button onClick={reset} style={{
              background: 'linear-gradient(135deg, #0f766e, #0d9488)', color: 'white',
              border: 'none', borderRadius: '50px', padding: '11px 26px',
              fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', cursor: 'pointer'
            }}>🔄 Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
