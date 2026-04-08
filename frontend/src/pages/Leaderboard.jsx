import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:8081';
const tok = () => localStorage.getItem('cinelingo_token') || '';
const hdr = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

// ── Mock data shown when backend is offline ───────────────────────────────────
const MOCK = [
  { userId:'m1', username:'SeoJun_Master',   totalScore:12450, gameMode:'thriller', level:5, accuracyRate:0.94 },
  { userId:'m2', username:'KoreanQueen',      totalScore:10800, gameMode:'story',    level:4, accuracyRate:0.88 },
  { userId:'m3', username:'DragonLearner',    totalScore:9600,  gameMode:'survival', level:5, accuracyRate:0.82 },
  { userId:'m4', username:'HangeulHero',      totalScore:8750,  gameMode:'thriller', level:4, accuracyRate:0.79 },
  { userId:'m5', username:'KdramaFan99',      totalScore:7300,  gameMode:'story',    level:3, accuracyRate:0.91 },
  { userId:'m6', username:'SeoulSurvivor',    totalScore:6200,  gameMode:'survival', level:3, accuracyRate:0.75 },
  { userId:'m7', username:'BTS_Learner',      totalScore:5500,  gameMode:'story',    level:2, accuracyRate:0.83 },
  { userId:'m8', username:'PyeoncheonPark',   totalScore:4800,  gameMode:'thriller', level:2, accuracyRate:0.71 },
  { userId:'m9', username:'GangseoGamer',     totalScore:3900,  gameMode:'story',    level:2, accuracyRate:0.68 },
  { userId:'m10',username:'NewLearner01',     totalScore:2100,  gameMode:'story',    level:1, accuracyRate:0.60 },
];

const MODES = [
  { key:'all',      label:'🌍 Global',   color:'#e94560' },
  { key:'story',    label:'📖 Story',    color:'#4ade80' },
  { key:'survival', label:'💀 Survival', color:'#a78bfa' },
  { key:'thriller', label:'🔥 Thriller', color:'#fb923c' },
];

async function safeFetch(url, opts, timeout = 4000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } catch {
    clearTimeout(id);
    return null;
  }
}

export default function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]       = useState('all');
  const [entries, setEntries] = useState([]);
  const [myRank, setMyRank]   = useState(null);
  const [myStats, setMyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock]   = useState(false);

  useEffect(() => { loadBoard(); }, [mode]);
  useEffect(() => { if (user?.id) { loadMyRank(); loadMyStats(); } }, [user?.id]);

  const loadBoard = async () => {
    setLoading(true);
    const url = mode !== 'all'
      ? `${API}/api/leaderboard?mode=${mode}`
      : `${API}/api/leaderboard`;
    const data = await safeFetch(url, { headers: hdr() });

    if (data && Array.isArray(data) && data.length > 0) {
      setEntries(data);
      setIsMock(false);
    } else {
      // Backend offline or empty — show filtered mock data
      const mock = mode === 'all' ? MOCK : MOCK.filter(e => e.gameMode === mode);
      setEntries(mock);
      setIsMock(true);
    }
    setLoading(false);
  };

  const loadMyRank = async () => {
    const d = await safeFetch(`${API}/api/leaderboard/rank/${user.id}`, { headers: hdr() });
    if (d) setMyRank(d);
  };

  const loadMyStats = async () => {
    const d = await safeFetch(`${API}/api/game/stats/${user.id}`, { headers: hdr() });
    if (d) setMyStats(d);
  };

  const medal = (i) => i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`;
  const isMe  = (e) => e.userId===user?.id || e.username===user?.username;

  const modeColor = MODES.find(m=>m.key===mode)?.color || '#e94560';

  return (
    <div style={{ minHeight:'100vh', background:'#08081a', color:'#fff', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .entry-row:hover{background:rgba(255,255,255,0.025)!important}
        .mode-btn:hover{opacity:.85}
      `}</style>

      {/* Nav */}
      <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 28px', background:'rgba(8,8,26,0.97)', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, zIndex:100, backdropFilter:'blur(12px)' }}>
        <div style={{ fontSize:'19px', fontWeight:'800', color:'#e94560', cursor:'pointer', fontFamily:"'Syne',sans-serif" }} onClick={()=>navigate('/')}>🎬 CineLingo</div>
        <div style={{ display:'flex', gap:'22px' }}>
          {[['Learn','/learn'],['Game','/game'],['Leaderboard','/leaderboard'],['Profile','/profile']].map(([l,p])=>(
            <span key={p} style={{ fontSize:'13px', cursor:'pointer', color:p==='/leaderboard'?'#e94560':'#666', fontWeight:p==='/leaderboard'?'700':'400' }} onClick={()=>navigate(p)}>{l}</span>
          ))}
        </div>
        <span style={{ color:'#555', fontSize:'13px' }}>👋 {user?.username}</span>
      </nav>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'40px 24px', animation:'fadeUp .4s ease' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ fontSize:'11px', color:'#e94560', fontWeight:'700', letterSpacing:'3px', marginBottom:'8px' }}>RANKINGS</div>
          <h1 style={{ fontSize:'40px', fontWeight:'800', margin:'0 0 6px', fontFamily:"'Syne',sans-serif" }}>🏆 Leaderboard</h1>
          <p style={{ color:'#444', fontSize:'14px', margin:0 }}>Top Korean voice game players worldwide</p>
        </div>

        {/* Preview banner when mock */}
        {isMock && (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(248,211,71,0.06)', border:'1px solid rgba(248,211,71,0.22)', borderRadius:'12px', padding:'10px 16px', marginBottom:'20px' }}>
            <span style={{ fontSize:'13px', color:'#f8d347' }}>
              📡 <strong>Preview Mode</strong> — Start Spring Boot to see real scores
            </span>
            <button onClick={loadBoard} style={{ padding:'5px 14px', background:'rgba(248,211,71,0.12)', border:'1px solid rgba(248,211,71,0.35)', borderRadius:'8px', color:'#f8d347', cursor:'pointer', fontSize:'12px', fontWeight:'700', fontFamily:'inherit' }}>
              🔄 Retry
            </button>
          </div>
        )}

        {/* My Stats */}
        <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap', marginBottom:'28px' }}>
          {[
            ['🏅 Your Rank',  myRank?.rank>0?`#${myRank.rank}`:'—',  '#e94560'],
            ['⭐ Best Score', myRank?.bestScore??'—',                  '#f8d347'],
            ['🎮 Games',      myStats?.gamesPlayed??'—',               '#38bdf8'],
            ['📊 Win Rate',   myStats?.winRate!=null?`${Math.round(myStats.winRate)}%`:'—', '#4ade80'],
            ['🏆 Victories',  myStats?.victories??'—',                 '#a78bfa'],
          ].map(([label,val,color])=>(
            <div key={label} style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${color}22`, borderRadius:'14px', padding:'14px 20px', textAlign:'center', minWidth:'90px' }}>
              <div style={{ fontSize:'22px', fontWeight:'800', color, marginBottom:'3px', fontFamily:"'Syne',sans-serif" }}>{val}</div>
              <div style={{ fontSize:'10px', color:'#444', textTransform:'uppercase', letterSpacing:'1px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Mode Tabs */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'20px', justifyContent:'center', flexWrap:'wrap' }}>
          {MODES.map(m=>(
            <button key={m.key} className="mode-btn" onClick={()=>setMode(m.key)} style={{ padding:'9px 20px', borderRadius:'24px', fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:'inherit', border:`1px solid ${mode===m.key?m.color:'rgba(255,255,255,0.08)'}`, background:mode===m.key?`${m.color}18`:'transparent', color:mode===m.key?m.color:'#555', transition:'all .2s' }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', overflow:'hidden' }}>
          {loading ? (
            <div style={{ padding:'80px', textAlign:'center' }}>
              <div style={{ width:'36px', height:'36px', border:'3px solid rgba(233,69,96,0.15)', borderTop:'3px solid #e94560', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 14px' }}/>
              <p style={{ color:'#444', fontSize:'13px' }}>Loading scores...</p>
            </div>
          ) : entries.length === 0 ? (
            <div style={{ padding:'80px', textAlign:'center' }}>
              <div style={{ fontSize:'56px', marginBottom:'16px' }}>🎮</div>
              <p style={{ color:'#555', fontSize:'16px', marginBottom:'6px', fontFamily:"'Syne',sans-serif", fontWeight:'700' }}>No scores yet for this mode!</p>
              <p style={{ color:'#333', fontSize:'13px', marginBottom:'24px' }}>Play a game in {mode} mode to appear here!</p>
              <button onClick={()=>navigate('/game')} style={{ padding:'12px 32px', background:'linear-gradient(135deg,#e94560,#c73652)', border:'none', borderRadius:'12px', color:'#fff', fontWeight:'800', cursor:'pointer', fontSize:'14px', fontFamily:'inherit' }}>🎮 Play Now</button>
            </div>
          ) : (
            <>
              {/* Header row */}
              <div style={{ display:'grid', gridTemplateColumns:'60px 1fr 110px 100px 80px 70px', padding:'12px 20px', background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                {['Rank','Player','Score','Mode','Level','Accuracy'].map((h,i)=>(
                  <div key={h} style={{ fontSize:'10px', color:'#333', textTransform:'uppercase', letterSpacing:'1px', fontWeight:'700', textAlign:i===1?'left':'center' }}>{h}</div>
                ))}
              </div>

              {/* Entries */}
              {entries.slice(0,50).map((entry,i)=>(
                <div key={entry.userId||i} className="entry-row"
                  style={{ display:'grid', gridTemplateColumns:'60px 1fr 110px 100px 80px 70px', alignItems:'center', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:isMe(entry)?'rgba(233,69,96,0.06)':'transparent', transition:'background .2s' }}>

                  {/* Rank */}
                  <div style={{ textAlign:'center', fontSize:i<3?'22px':'14px', fontWeight:'800', color:i===0?'#ffd700':i===1?'#c0c0c0':i===2?'#cd7f32':'#333', fontFamily:"'Syne',sans-serif" }}>
                    {medal(i)}
                  </div>

                  {/* Player */}
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:isMe(entry)?'linear-gradient(135deg,#e94560,#c73652)':'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px', fontWeight:'800', flexShrink:0, fontFamily:"'Syne',sans-serif" }}>
                      {(entry.username||'P')[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize:'14px', fontWeight:'700', color:isMe(entry)?'#e94560':'#ccc' }}>{entry.username||'Player'}</div>
                      {isMe(entry)&&<div style={{ fontSize:'9px', color:'#e94560', fontWeight:'800', letterSpacing:'1px' }}>YOU</div>}
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ textAlign:'center', fontSize:'18px', fontWeight:'800', color:i===0?'#ffd700':i===1?'#c0c0c0':i===2?'#cd7f32':'#fff', fontFamily:"'Syne',sans-serif" }}>
                    {(entry.totalScore||0).toLocaleString()}
                  </div>

                  {/* Mode */}
                  <div style={{ textAlign:'center' }}>
                    <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'8px', fontWeight:'700',
                      background: entry.gameMode==='story'?'rgba(74,222,128,0.1)': entry.gameMode==='thriller'?'rgba(251,146,60,0.1)': entry.gameMode==='survival'?'rgba(167,139,250,0.1)':'rgba(255,255,255,0.05)',
                      color: entry.gameMode==='story'?'#4ade80': entry.gameMode==='thriller'?'#fb923c': entry.gameMode==='survival'?'#a78bfa':'#666' }}>
                      {entry.gameMode||'story'}
                    </span>
                  </div>

                  {/* Level */}
                  <div style={{ textAlign:'center' }}>
                    <span style={{ fontSize:'12px', padding:'3px 10px', borderRadius:'8px', background:'rgba(233,69,96,0.1)', color:'#e94560', fontWeight:'700' }}>
                      Lv {entry.level||1}
                    </span>
                  </div>

                  {/* Accuracy */}
                  <div style={{ textAlign:'center' }}>
                    {entry.accuracyRate!=null?(
                      <div>
                        <div style={{ height:'4px', background:'rgba(255,255,255,0.05)', borderRadius:'2px', overflow:'hidden', marginBottom:'3px' }}>
                          <div style={{ width:`${Math.round((entry.accuracyRate||0)*100)}%`, height:'100%', borderRadius:'2px', background:(entry.accuracyRate||0)>=0.8?'#4ade80':(entry.accuracyRate||0)>=0.6?'#fb923c':'#f87171' }}/>
                        </div>
                        <span style={{ fontSize:'11px', color:'#555' }}>{Math.round((entry.accuracyRate||0)*100)}%</span>
                      </div>
                    ):<span style={{ color:'#333', fontSize:'13px' }}>—</span>}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* CTA */}
        <div style={{ textAlign:'center', marginTop:'28px' }}>
          <button onClick={()=>navigate('/game')} style={{ padding:'14px 40px', background:'linear-gradient(135deg,#e94560,#c73652)', border:'none', borderRadius:'14px', color:'#fff', fontSize:'16px', fontWeight:'800', cursor:'pointer', boxShadow:'0 4px 28px rgba(233,69,96,0.3)', fontFamily:'inherit' }}>
            🎮 Play & Climb the Ranks
          </button>
        </div>
      </div>
    </div>
  );
}
