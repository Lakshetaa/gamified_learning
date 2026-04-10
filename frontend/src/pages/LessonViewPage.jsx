import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/UI/Sidebar';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

// ── Existing interactive components ─────────────────────────────────────────
import SortGame      from '../components/Interactive/SortGame';
import PlantExplorer from '../components/Interactive/PlantExplorer';
import SeedJourney   from '../components/Interactive/SeedJourney';
import PlantUsesWheel from '../components/Interactive/PlantUsesWheel';
import FlipCard      from '../components/Interactive/FlipCard';
import MatchGame     from '../components/Interactive/MatchGame';

// ── NEW practical games ───────────────────────────────────────────────────────
import MemoryGame    from '../components/Interactive/MemoryGame';
import BuildAPlant   from '../components/Interactive/BuildAPlant';
import GrowYourSeed  from '../components/Interactive/GrowYourSeed';
import WordSearch    from '../components/Interactive/WordSearch';

// ── Static data ───────────────────────────────────────────────────────────────
const FLIP_CARDS_L1 = [
  { front:'Can a rock grow?', back:'No! Rocks cannot grow, breathe, or reproduce. They are NON-LIVING.', frontEmoji:'🪨', backEmoji:'❌', color:'#64748b', bg:'#f1f5f9' },
  { front:'Can a bird reproduce?', back:'Yes! Birds lay eggs which hatch into baby birds. REPRODUCTION is a sign of life!', frontEmoji:'🐦', backEmoji:'✅', color:'#16a34a', bg:'#dcfce7' },
  { front:'Does a plant move?', back:"Yes, slowly! Plants turn their leaves toward sunlight — called PHOTOTROPISM!", frontEmoji:'🌱', backEmoji:'🌞', color:'#d97706', bg:'#fef3c7' },
  { front:'Is water a living thing?', back:"No, but it's essential for all living things. Water is NON-LIVING — it can't breathe or grow.", frontEmoji:'💧', backEmoji:'🤔', color:'#0284c7', bg:'#e0f2fe' },
];

const FLIP_CARDS_L3 = [
  { front:'What do seeds need to germinate?', back:'Water + Warmth + Air! Without these 3 things, a seed stays sleeping.', frontEmoji:'🌰', backEmoji:'🔑', color:'#78350f', bg:'#ffedd5' },
  { front:'Which way does the root grow?', back:'Always DOWNWARD! Gravity pulls roots down into the soil to find water.', frontEmoji:'🌱', backEmoji:'⬇️', color:'#166534', bg:'#dcfce7' },
  { front:'How do dandelion seeds travel?', back:'BY WIND! They have fluffy parachutes that catch the breeze.', frontEmoji:'🌼', backEmoji:'🌬️', color:'#7c3aed', bg:'#ede9fe' },
  { front:'What is inside every seed?', back:'A tiny baby plant (embryo) and stored food (cotyledon) to help it grow!', frontEmoji:'🌰', backEmoji:'👶', color:'#0369a1', bg:'#e0f2fe' },
];

const PLANT_PARTS_MATCH = [
  { left:{label:'Root',   emoji:'🌱'}, right:{label:'Absorbs water from soil',  emoji:'💧'} },
  { left:{label:'Stem',   emoji:'🪵'}, right:{label:'Carries water upward',     emoji:'🚰'} },
  { left:{label:'Leaf',   emoji:'🍃'}, right:{label:'Makes food using sunlight',emoji:'☀️'} },
  { left:{label:'Flower', emoji:'🌸'}, right:{label:'Attracts bees & makes seeds',emoji:'🐝'} },
];
const SEED_TRAVEL_MATCH = [
  { left:{label:'Dandelion',emoji:'🌼'}, right:{label:'Travels by wind',    emoji:'🌬️'} },
  { left:{label:'Coconut',  emoji:'🥥'}, right:{label:'Travels by water',   emoji:'🌊'} },
  { left:{label:'Mango',    emoji:'🥭'}, right:{label:'Travels by animals', emoji:'🐦'} },
  { left:{label:'Wheat',    emoji:'🌾'}, right:{label:'Planted by humans',  emoji:'👨‍🌾'} },
];
const PLANT_USES_MATCH = [
  { left:{label:'Cotton',   emoji:'🧶'}, right:{label:'Makes our clothes',        emoji:'👕'} },
  { left:{label:'Neem',     emoji:'🌿'}, right:{label:'Kills germs & heals skin', emoji:'💊'} },
  { left:{label:'Rice',     emoji:'🍚'}, right:{label:'Gives us energy',          emoji:'⚡'} },
  { left:{label:'Teak tree',emoji:'🌳'}, right:{label:'Wood for furniture',       emoji:'🪵'} },
];

// ── Activity registry — each entry gets its own card in the Activities tab ───
function getActivityBlocks(lessonNumber) {
  const blocks = {
    1: [
      { id:'memory',  tag:'🧠 NEW', title:'Memory Match Game',        desc:'Flip cards to match each creature or object to its category — Living or Non-Living!', component:<MemoryGame /> },
      { id:'sort',    tag:'🎮',     title:'Sort It Out!',             desc:'Click each card and send it to the correct bucket.',                                    component:<SortGame /> },
      { id:'flip1',   tag:'🃏',     title:'True or False? Flip Cards',desc:'Guess the answer, then flip to check!',
        component:<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>{FLIP_CARDS_L1.map((c,i)=><FlipCard key={i} {...c}/>)}</div> },
    ],
    2: [
      { id:'build',   tag:'🧩 NEW', title:'Build-a-Plant!',           desc:'Drag (or tap) each plant part into its correct position on the plant diagram!',         component:<BuildAPlant /> },
      { id:'explore', tag:'🌿',     title:'Plant Explorer',            desc:'Click on each part of the plant SVG diagram to discover what it does.',                component:<PlantExplorer /> },
      { id:'match2',  tag:'🔗',     title:'Match: Plant Part → Job',  desc:'Match each part to its function.',
        component:<MatchGame pairs={PLANT_PARTS_MATCH} title="Plant Parts Match!" color="#16a34a" bg="#dcfce7"/> },
    ],
    3: [
      { id:'grow',    tag:'🌱 NEW', title:'Grow Your Seed!',          desc:'Press the buttons to give your seed water, sunlight & air — watch it germinate step by step!', component:<GrowYourSeed /> },
      { id:'journey', tag:'🎬',     title:'Seed Journey Animation',   desc:'Step through germination stages. Hit Auto Play!',                                       component:<SeedJourney /> },
      { id:'flip3',   tag:'🃏',     title:'Seed Quiz Flip Cards',     desc:'Think first, then flip!',
        component:<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>{FLIP_CARDS_L3.map((c,i)=><FlipCard key={i} {...c}/>)}</div> },
      { id:'match3',  tag:'🔗',     title:'How Do Seeds Travel?',     desc:'Match seed to travel method.',
        component:<MatchGame pairs={SEED_TRAVEL_MATCH} title="Seed Travel Match!" color="#78350f" bg="#ffedd5"/> },
    ],
    4: [
      { id:'wordsearch', tag:'🔍 NEW', title:'Plant Word Search',      desc:'Find all 10 hidden plant words in the letter grid — click and drag to select!',         component:<WordSearch /> },
      { id:'uses',    tag:'🌍',     title:'How Plants Help Us',        desc:'Click each category to explore food, air, shelter and medicine.',                       component:<PlantUsesWheel /> },
      { id:'match4',  tag:'🔗',     title:'Match: Plant → Use',        desc:'Match each plant to how it helps us.',
        component:<MatchGame pairs={PLANT_USES_MATCH} title="Plants We Use — Match!" color="#15803d" bg="#dcfce7"/> },
    ],
  };
  return blocks[lessonNumber] || [];
}

// ── Content section renderer ──────────────────────────────────────────────────
function ContentSection({ section, index }) {
  const S = {
    intro:    { bg:'linear-gradient(135deg,#dcfce7,#bbf7d0)', border:'#4ade80',  chip:'🌟 intro'    },
    concept:  { bg:'white',                                    border:'rgba(74,222,128,0.2)', chip:'💡 learn' },
    fact:     { bg:'linear-gradient(135deg,#fef3c7,#fde68a)', border:'#fbbf24',  chip:'🤩 fun fact'  },
    activity: { bg:'linear-gradient(135deg,#ede9fe,#ddd6fe)', border:'#a78bfa',  chip:'🎮 activity'  },
    summary:  { bg:'linear-gradient(135deg,#dbeafe,#bfdbfe)', border:'#60a5fa',  chip:'🏆 summary'   },
  };
  const s = S[section.type] || S.concept;
  return (
    <div className="fade-in" style={{ animationDelay:`${index*0.07}s`, marginBottom:'20px' }}>
      <div style={{ background:s.bg, borderRadius:'20px', padding:'28px', border:`2px solid ${s.border}`, position:'relative' }}>
        <div style={{ position:'absolute', top:'-1px', right:'20px', background:'white', border:`2px solid ${s.border}`, borderRadius:'0 0 10px 10px', padding:'3px 12px', fontSize:'10px', fontWeight:900, color:'#374151', textTransform:'uppercase', letterSpacing:'0.5px' }}>{s.chip}</div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'22px', color:'var(--dark-text)', marginBottom:'12px', marginTop:'8px', display:'flex', gap:'10px', alignItems:'center' }}>
          <span>{section.emoji}</span>{section.title}
        </h2>
        <p style={{ fontSize:'16px', lineHeight:1.8, color:'#374151', fontWeight:600 }}>{section.text}</p>
        {section.items?.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:'14px', marginTop:'20px' }}>
            {section.items.map((item,i) => (
              <div key={i} style={{ background: section.type==='fact'?'rgba(255,255,255,0.7)':section.type==='activity'?'rgba(255,255,255,0.6)':'var(--green-pale)', borderRadius:'14px', padding:'18px', border:'2px solid rgba(74,222,128,0.25)' }}>
                <div style={{ fontSize:'28px', marginBottom:'6px' }}>{item.emoji}</div>
                <div style={{ fontWeight:900, fontSize:'14px', color:'var(--dark-text)', marginBottom:'4px' }}>{item.label}</div>
                <div style={{ fontSize:'12px', color:'#374151', fontWeight:600, lineHeight:1.5 }}>{item.description}</div>
              </div>
            ))}
          </div>
        )}
        {section.funFact && (
          <div style={{ background:'rgba(255,255,255,0.6)', borderRadius:'14px', padding:'16px 18px', marginTop:'18px', borderLeft:'5px solid #fbbf24', display:'flex', gap:'12px', alignItems:'flex-start' }}>
            <span style={{ fontSize:'26px' }}>💡</span>
            <p style={{ fontWeight:700, fontSize:'14px', color:'#78350f', lineHeight:1.6 }}><strong>Did You Know?</strong> {section.funFact}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LessonViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateUser, refreshUser } = useAuth();
  const [lesson,          setLesson]          = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [activeTab,       setActiveTab]       = useState('learn');
  const [showCelebration, setShowCelebration] = useState(false);
  const [lessonDone,      setLessonDone]      = useState(false);
  const [newBadges,       setNewBadges]       = useState([]);
  const startTime = useRef(Date.now());

  useEffect(() => {
    api.get(`/lessons/${id}`)
      .then(res => {
        setLesson(res.data);
        setLessonDone(!!res.data.progress?.completed);
        setLoading(false);
        api.post(`/lessons/${id}/start`).catch(() => {});
      })
      .catch(() => navigate('/lessons'));
  }, [id]);

  const handleComplete = async () => {
    if (lessonDone) return;
    try {
      const res = await api.post(`/lessons/${id}/complete`, {
        timeSpent: Math.round((Date.now() - startTime.current) / 1000)
      });

      if (res.data.alreadyCompleted) {
        setLessonDone(true);
        return;
      }

      // Update local lesson state immediately
      setLessonDone(true);
      setLesson(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          completed: true,
          starsEarned: res.data.progress?.starsEarned || prev.starsReward
        }
      }));

      // Update sidebar user stats directly from response — no extra round-trip
      if (res.data.user) {
        updateUser({
          totalStars:  res.data.user.totalStars,
          totalPoints: res.data.user.totalPoints,
          level:       res.data.user.level
        });
      }

      // Capture any newly earned badges to show in celebration modal
      setNewBadges(res.data.newBadges || []);

      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    } catch (err) {
      console.error('Complete error:', err);
    }
  };

  if (loading) return (
    <div className="app-layout"><Sidebar />
      <main className="main-content" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div className="loader"/>
      </main>
    </div>
  );
  if (!lesson) return null;

  const activityBlocks = getActivityBlocks(lesson.lessonNumber);

  const TABS = [
    { key:'learn',      icon:'📖', label:'Read & Learn' },
    { key:'activities', icon:'🎮', label:`Games & Activities (${activityBlocks.length})` },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth:'1040px' }}>

          {/* ── Banner ── */}
          <div style={{ background:lesson.color, borderRadius:'24px', padding:'30px 36px', marginBottom:'22px', color:'white', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', right:'32px', top:'50%', transform:'translateY(-50%)', fontSize:'110px', opacity:0.12 }}>{lesson.emoji}</div>
            <Link to="/lessons" style={{ color:'rgba(255,255,255,0.75)', textDecoration:'none', fontWeight:700, fontSize:'13px', display:'inline-flex', alignItems:'center', gap:'5px', marginBottom:'14px' }}>← Back to Lessons</Link>
            <div style={{ display:'flex', gap:'8px', marginBottom:'10px', flexWrap:'wrap' }}>
              {[`Lesson ${lesson.lessonNumber}`, `⭐ ${lesson.starsReward} stars`, `🎯 ${lesson.pointsReward} pts`, ...(lessonDone?['✅ Completed']:[])].map(tag => (
                <span key={tag} style={{ background:'rgba(255,255,255,0.2)', borderRadius:'50px', padding:'4px 14px', fontSize:'12px', fontWeight:900 }}>{tag}</span>
              ))}
            </div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'32px', lineHeight:1.1, marginBottom:'5px' }}>{lesson.emoji} {lesson.title}</h1>
            <p style={{ opacity:0.85, fontWeight:600, fontSize:'15px' }}>{lesson.subtitle}</p>
          </div>

          {/* ── Tab bar ── */}
          <div style={{ display:'flex', gap:'8px', marginBottom:'22px', background:'white', borderRadius:'16px', padding:'6px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                flex:1, padding:'12px 8px', borderRadius:'12px',
                background: activeTab===tab.key ? lesson.color : '#f9fafb',
                border:`2px solid ${activeTab===tab.key ? lesson.color : '#e5e7eb'}`,
                fontFamily:'var(--font-body)', fontWeight:800, fontSize:'14px',
                color: activeTab===tab.key ? 'white' : '#374151',
                cursor:'pointer', transition:'all 0.2s'
              }}>{tab.icon} {tab.label}</button>
            ))}
            <Link to={`/lessons/${id}/quiz`} style={{
              flex:1, padding:'12px 8px', borderRadius:'12px', textAlign:'center',
              background:'#f5f3ff', border:'2px solid #a78bfa',
              fontFamily:'var(--font-body)', fontWeight:800, fontSize:'14px', color:'#7c3aed',
              textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px'
            }}>🧠 Quiz</Link>
          </div>

          {/* ── LEARN tab ── */}
          {activeTab === 'learn' && (
            <div className="fade-in">
              {lesson.content?.map((sec, i) => <ContentSection key={i} section={sec} index={i} />)}
              <div style={{ background:'linear-gradient(135deg,#14532d,#15803d)', borderRadius:'20px', padding:'28px', textAlign:'center', color:'white', marginTop:'8px' }}>
                <div style={{ fontSize:'44px', marginBottom:'10px' }}>🎓</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'22px', marginBottom:'8px' }}>
                  {lessonDone ? 'Lesson complete! Keep exploring!' : 'Finished reading?'}
                </div>
                <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap', marginTop:'16px' }}>
                  {!lessonDone && (
                    <button onClick={handleComplete} style={{ background:'#4ade80', color:'#14532d', border:'none', borderRadius:'50px', padding:'13px 26px', fontFamily:'var(--font-body)', fontWeight:900, fontSize:'15px', cursor:'pointer', boxShadow:'0 4px 12px rgba(74,222,128,0.4)' }}>
                      ✅ Mark Complete!
                    </button>
                  )}
                  <button onClick={() => setActiveTab('activities')} style={{ background:'rgba(255,255,255,0.15)', color:'white', border:'2px solid rgba(255,255,255,0.4)', borderRadius:'50px', padding:'13px 26px', fontFamily:'var(--font-body)', fontWeight:900, fontSize:'15px', cursor:'pointer' }}>
                    🎮 Play Games
                  </button>
                  <Link to={`/lessons/${id}/quiz`} style={{ background:'white', color:'#14532d', borderRadius:'50px', padding:'13px 26px', fontFamily:'var(--font-body)', fontWeight:900, fontSize:'15px', textDecoration:'none' }}>
                    🧠 Take Quiz →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── ACTIVITIES tab ── */}
          {activeTab === 'activities' && (
            <div className="fade-in">
              {activityBlocks.map((block, i) => (
                <div key={block.id} style={{ marginBottom:'32px', animation:`slideUp 0.4s ease ${i*0.08}s both` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                    <div style={{ background: block.tag.includes('NEW') ? '#fef3c7' : '#f1f5f9', border:`2px solid ${block.tag.includes('NEW') ? '#fbbf24' : '#e2e8f0'}`, borderRadius:'50px', padding:'4px 12px', fontSize:'11px', fontWeight:900, color: block.tag.includes('NEW') ? '#92400e' : '#6b7280', whiteSpace:'nowrap' }}>
                      {block.tag}
                    </div>
                    <div>
                      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'20px', color:'var(--dark-text)', margin:0 }}>{block.title}</h2>
                      <p style={{ color:'#6b7280', fontWeight:600, fontSize:'13px', margin:0 }}>{block.desc}</p>
                    </div>
                  </div>
                  <div className="interactive-section" style={{ position:'relative' }}>
                    {block.component}
                  </div>
                </div>
              ))}

              <div style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius:'20px', padding:'28px', textAlign:'center', color:'white' }}>
                <div style={{ fontSize:'40px', marginBottom:'10px' }}>🧠</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'22px', marginBottom:'8px' }}>Games done? Show what you know!</div>
                <Link to={`/lessons/${id}/quiz`} style={{ background:'white', color:'#4f46e5', borderRadius:'50px', padding:'13px 32px', fontFamily:'var(--font-body)', fontWeight:900, fontSize:'16px', textDecoration:'none', display:'inline-block', marginTop:'4px' }}>
                  🏆 Start Quiz →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Celebration modal ── */}
      {showCelebration && (
        <div className="celebration-overlay" onClick={() => setShowCelebration(false)}>
          <div className="celebration-card" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:'80px', marginBottom:'16px' }}>🎉</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'30px', color:'var(--dark-text)', marginBottom:'8px' }}>Lesson Complete!</h2>
            <p style={{ color:'#6b7280', fontWeight:600, marginBottom:'20px' }}>Awesome work! You earned:</p>
            <div style={{ display:'flex', gap:'16px', justifyContent:'center', marginBottom:'20px' }}>
              <div style={{ textAlign:'center', background:'#fef3c7', borderRadius:'16px', padding:'16px 22px' }}>
                <div style={{ fontSize:'32px' }}>⭐</div>
                <div style={{ fontWeight:900, color:'#78350f', marginTop:'4px' }}>{lesson.starsReward} Stars</div>
              </div>
              <div style={{ textAlign:'center', background:'#ede9fe', borderRadius:'16px', padding:'16px 22px' }}>
                <div style={{ fontSize:'32px' }}>🎯</div>
                <div style={{ fontWeight:900, color:'#4c1d95', marginTop:'4px' }}>{lesson.pointsReward} Points</div>
              </div>
            </div>

            {/* New badges earned */}
            {newBadges.length > 0 && (
              <div style={{ background:'#fef3c7', borderRadius:'16px', padding:'16px', marginBottom:'20px', border:'2px solid #fbbf24' }}>
                <div style={{ fontWeight:900, fontSize:'13px', color:'#92400e', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                  🏅 Badge{newBadges.length > 1 ? 's' : ''} Unlocked!
                </div>
                <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
                  {newBadges.map(b => (
                    <div key={b.name} style={{ textAlign:'center', background:'white', borderRadius:'12px', padding:'10px 14px', border:'2px solid #fbbf24' }}>
                      <div style={{ fontSize:'28px' }}>{b.emoji}</div>
                      <div style={{ fontWeight:800, fontSize:'12px', color:'#92400e', marginTop:'4px' }}>{b.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
              <button onClick={() => { setShowCelebration(false); setActiveTab('activities'); }} style={{ background:'#dcfce7', color:'#16a34a', border:'2px solid #4ade80', borderRadius:'50px', padding:'11px 20px', fontFamily:'var(--font-body)', fontWeight:800, fontSize:'14px', cursor:'pointer' }}>🎮 Play Games</button>
              <Link to={`/lessons/${id}/quiz`} onClick={() => setShowCelebration(false)} style={{ background:'#7c3aed', color:'white', borderRadius:'50px', padding:'11px 20px', fontFamily:'var(--font-body)', fontWeight:800, fontSize:'14px', textDecoration:'none' }}>🧠 Quiz!</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
