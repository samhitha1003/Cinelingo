import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const speakKorean = (text) => {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR'; u.rate = 0.85; u.pitch = 1.1;
  window.speechSynthesis.speak(u);
};

const GREETINGS = [
  { korean: '안녕하세요!',       rom: 'An-nyeong-ha-se-yo',       english: 'Hello!' },
  { korean: '어서 오세요!',       rom: 'Eo-seo o-se-yo',           english: 'Welcome!' },
  { korean: '잘 지냈어요?',       rom: 'Jal ji-naet-sseo-yo',      english: 'Have you been well?' },
  { korean: '오늘도 화이팅!',     rom: 'O-neul-do hwa-i-ting',     english: 'Fighting spirit today too!' },
  { korean: '준비됐어요?',        rom: 'Jun-bi-dwaet-sseo-yo',     english: 'Are you ready?' },
];

const FEATURED_SCENES = [
  { emoji: '👋', title: 'Korean Greetings',  scene: '안녕하세요!',   level: 'Beginner',     color: '#4ade80', route: '/learn' },
  { emoji: '🍜', title: 'Order Food',         scene: '이거 주세요.', level: 'Beginner',     color: '#38bdf8', route: '/learn' },
  { emoji: '💕', title: 'K-Drama Phrases',    scene: '사랑해요.',     level: 'Intermediate', color: '#e94560', route: '/learn' },
  { emoji: '🦑', title: 'Squid Game Korean', scene: '살아남아야 해.', level: 'Advanced',     color: '#a78bfa', route: '/learn' },
];

const STATS = [
  { n: '10',   label: 'Drama Scenes',  icon: '🎬' },
  { n: '70+',  label: 'Korean Lines',  icon: '📜' },
  { n: '300+', label: 'Words & Phrases', icon: '🔤' },
  { n: '3',    label: 'Game Modes',    icon: '🎮' },
];

export default function Home() {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();
  const [greetIdx, setGreetIdx]         = useState(0);
  const [visible, setVisible]           = useState(true);
  const [time, setTime]                 = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const intervalRef = useRef(null);

  // Cycle greetings
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setGreetIdx(i => (i + 1) % GREETINGS.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = () => setShowUserMenu(false);
    if (showUserMenu) document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showUserMenu]);

  const greeting = GREETINGS[greetIdx];
  const hour      = time.getHours();
  const timeGreet = hour < 12 ? '좋은 아침이에요! 🌅' : hour < 17 ? '좋은 오후예요! ☀️' : '좋은 저녁이에요! 🌙';
  const timeGreetEn = hour < 12 ? 'Good morning!' : hour < 17 ? 'Good afternoon!' : 'Good evening!';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#08081a', color: '#fff',
      fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow    { 0%,100%{box-shadow:0 0 24px rgba(233,69,96,0.25)} 50%{box-shadow:0 0 48px rgba(233,69,96,0.5)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .scene-card:hover  { transform:translateY(-6px) scale(1.01)!important; }
        .scene-card        { transition:all .25s ease!important; }
        .main-btn:hover    { transform:translateY(-2px)!important; box-shadow:0 8px 36px rgba(233,69,96,0.5)!important; }
        .main-btn          { transition:all .22s ease!important; }
        .sec-btn:hover     { background:rgba(255,255,255,0.08)!important; }
        .sec-btn           { transition:all .2s ease!important; }
        .nav-pill:hover    { background:rgba(255,255,255,0.06)!important; }
        .nav-pill          { transition:all .2s; }
        .speak-chip:hover  { transform:scale(1.05); cursor:pointer; }
        .speak-chip        { transition:transform .15s; }
        .logout-btn:hover  { background:rgba(233,69,96,0.15)!important; color:#e94560!important; }
        .logout-btn        { transition:all .15s; }
      `}</style>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 32px', background: 'rgba(8,8,26,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, zIndex: 200, backdropFilter: 'blur(14px)',
      }}>
        <div style={{ fontSize: '20px', fontWeight: '900', color: '#e94560',
          fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px' }}>
          🎬 CineLingo
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            ['📖 Learn', '/learn'],
            ['🎮 Game', '/game'],
            ['🏆 Leaderboard', '/leaderboard'],
            ['👤 Profile', '/profile'],
          ].map(([label, path]) => (
            <button key={path} className="nav-pill"
              onClick={() => navigate(path)}
              style={{
                padding: '8px 16px', borderRadius: '10px', fontSize: '13px',
                fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)', color: '#888',
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* User avatar + dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={e => { e.stopPropagation(); setShowUserMenu(m => !m); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#e94560,#c73652)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '900', fontFamily: "'Syne',sans-serif",
            }}>
              {(user?.username || 'G').charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '13px', color: '#666' }}>{user?.username}</span>
            <span style={{ fontSize: '10px', color: '#333' }}>▼</span>
          </div>

          {showUserMenu && (
            <div onClick={e => e.stopPropagation()} style={{
              position: 'absolute', top: '44px', right: 0,
              background: '#13132a', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '6px', minWidth: '160px',
              zIndex: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
              <div style={{ padding: '10px 14px', fontSize: '13px', color: '#888',
                borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '4px' }}>
                <div style={{ fontWeight: '700', color: '#ccc' }}>{user?.username}</div>
                {user?.email && <div style={{ fontSize: '11px', marginTop: '2px' }}>{user.email}</div>}
              </div>
              <button className="logout-btn"
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '9px 14px', textAlign: 'left',
                  background: 'transparent', border: 'none', color: '#666',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  fontFamily: 'inherit', borderRadius: '8px',
                }}>
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        maxWidth: '1100px', margin: '0 auto', padding: '64px 32px 48px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center',
        animation: 'fadeUp .5s ease',
      }}>
        {/* Left */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', background: 'rgba(248,211,71,0.08)',
            border: '1px solid rgba(248,211,71,0.2)', borderRadius: '20px',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '12px', color: '#f8d347', fontWeight: '700' }}>{timeGreet}</span>
            <span style={{ fontSize: '11px', color: '#555' }}>{timeGreetEn}</span>
          </div>

          <h1 style={{
            fontSize: '52px', fontWeight: '900', lineHeight: 1.1, margin: '0 0 16px',
            fontFamily: "'Syne',sans-serif", letterSpacing: '-1.5px',
          }}>
            Learn Korean<br/>
            <span style={{ background: 'linear-gradient(135deg,#e94560,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Through Drama
            </span>
          </h1>

          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, marginBottom: '28px', maxWidth: '440px' }}>
            Real scenes. Real scripts. Real Korean.
            Watch K-Drama clips, learn the exact dialogue, speak it yourself.
            Completely different from Duolingo.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <button className="main-btn"
              onClick={() => navigate('/learn')}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg,#e94560,#c73652)',
                border: 'none', borderRadius: '14px', color: '#fff',
                fontSize: '16px', fontWeight: '800', cursor: 'pointer',
                fontFamily: 'inherit', boxShadow: '0 4px 28px rgba(233,69,96,0.35)',
                animation: 'glow 3s ease infinite',
              }}>
              🎬 Start Learning
            </button>
            <button className="sec-btn"
              onClick={() => navigate('/game')}
              style={{
                padding: '14px 32px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px',
                color: '#ccc', fontSize: '16px', fontWeight: '700',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
              🎮 Play Game
            </button>
          </div>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#e94560', fontFamily: "'Syne',sans-serif" }}>
                  {s.icon} {s.n}
                </div>
                <div style={{ fontSize: '11px', color: '#444' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — greeting card */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(233,69,96,0.2)',
            borderRadius: '28px', padding: '40px 36px', textAlign: 'center',
            width: '100%', maxWidth: '380px',
            boxShadow: '0 0 60px rgba(233,69,96,0.08)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(233,69,96,0.08)', filter: 'blur(40px)' }}/>

            <div style={{ fontSize: '13px', color: '#e94560', fontWeight: '700', letterSpacing: '2px', marginBottom: '16px' }}>
              TODAY'S GREETING
            </div>

            <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease', marginBottom: '20px' }}>
              <div style={{ fontSize: '42px', fontWeight: '900', color: '#fff', fontFamily: "'Syne',sans-serif", marginBottom: '8px', lineHeight: 1.2 }}>
                {greeting.korean}
              </div>
              <div style={{ fontSize: '16px', color: '#e94560', fontWeight: '600', marginBottom: '4px' }}>
                {greeting.rom}
              </div>
              <div style={{ fontSize: '18px', color: '#4ade80', fontWeight: '700' }}>
                {greeting.english}
              </div>
            </div>

            <button className="speak-chip"
              onClick={() => speakKorean(greeting.korean)}
              style={{
                padding: '10px 24px', background: 'rgba(233,69,96,0.12)',
                border: '1px solid rgba(233,69,96,0.3)', borderRadius: '10px',
                color: '#e94560', fontSize: '14px', fontWeight: '800',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
              }}>
              🔊 Hear it
            </button>
            <div style={{ marginTop: '16px', fontSize: '11px', color: '#333' }}>
              Rotates every 3.5 seconds · Click 🔊 to hear pronunciation
            </div>
          </div>
        </div>
      </section>

      {/* ── NAVIGATION CARDS ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px 56px' }}>
        <div style={{ fontSize: '11px', color: '#e94560', fontWeight: '700', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>
          WHERE DO YOU WANT TO GO?
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: '900', textAlign: 'center', fontFamily: "'Syne',sans-serif", margin: '0 0 28px' }}>
          Choose Your Path
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }}>
          {[
            {
              path: '/learn', icon: '🎬', tag: 'LEARN', color: '#4ade80',
              title: 'Drama Script Immersion',
              desc: 'Watch 10 real K-Drama clips. Read the exact script. Click any word to hear pronunciation. Shadow, quiz, master.',
              chips: ['📜 Script Mode', '🎤 Shadow Mode', '🧩 Voice Quiz'],
              cta: 'Start Learning →',
            },
            {
              path: '/game', icon: '🎮', tag: 'GAME', color: '#e94560',
              title: 'Korean Voice Control Game',
              desc: 'Speak Korean → your character moves. Thriller missions, story levels. No typing, pure voice.',
              chips: ['🕵️ Thriller', '📖 Story', '💀 Survival'],
              cta: 'Play Now →',
            },
            {
              path: '/leaderboard', icon: '🏆', tag: 'LEADERBOARD', color: '#f8d347',
              title: 'Global Rankings',
              desc: 'See top Korean voice game players worldwide. Filter by mode. Climb the ranks.',
              chips: ['🌍 Global', '📖 Story', '🔥 Thriller'],
              cta: 'View Rankings →',
            },
            {
              path: '/profile', icon: '📊', tag: 'PROFILE', color: '#a78bfa',
              title: 'Your Progress',
              desc: 'Track your XP, streaks, achievements, pronunciation scores and vocabulary mastery.',
              chips: ['⭐ XP & Levels', '🏅 Achievements', '🎤 Pronunciation'],
              cta: 'View Profile →',
            },
          ].map(card => (
            <div key={card.path} className="scene-card"
              onClick={() => navigate(card.path)}
              style={{
                background: `linear-gradient(135deg,${card.color}06,rgba(8,8,26,0))`,
                border: `1px solid ${card.color}22`, borderRadius: '20px',
                padding: '28px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
              }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: `${card.color}06`, filter: 'blur(30px)' }}/>
              <div style={{ fontSize: '44px', marginBottom: '14px' }}>{card.icon}</div>
              <div style={{ fontSize: '11px', color: card.color, fontWeight: '700', letterSpacing: '2px', marginBottom: '6px' }}>{card.tag}</div>
              <div style={{ fontSize: '22px', fontWeight: '900', fontFamily: "'Syne',sans-serif", marginBottom: '8px', color: '#fff' }}>{card.title}</div>
              <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>{card.desc}</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {card.chips.map(t => (
                  <span key={t} style={{ fontSize: '11px', padding: '3px 10px', background: `${card.color}10`, border: `1px solid ${card.color}22`, borderRadius: '8px', color: card.color, fontWeight: '700' }}>{t}</span>
                ))}
              </div>
              <div style={{ color: card.color, fontSize: '14px', fontWeight: '800' }}>{card.cta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED SCENES ──────────────────────────────────────────────── */}
      <section style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '48px 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#e94560', fontWeight: '700', letterSpacing: '3px', marginBottom: '6px' }}>FEATURED SCENES</div>
              <h2 style={{ fontSize: '24px', fontWeight: '900', fontFamily: "'Syne',sans-serif", margin: 0 }}>Start with these</h2>
            </div>
            <button onClick={() => navigate('/learn')}
              style={{ padding: '9px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#888', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
              View All 10 Scenes →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '12px' }}>
            {FEATURED_SCENES.map((s, i) => (
              <div key={i} className="scene-card"
                onClick={() => navigate(s.route)}
                style={{ background: `linear-gradient(135deg,${s.color}08,rgba(8,8,26,0))`, border: `1px solid ${s.color}28`, borderRadius: '16px', padding: '20px', cursor: 'pointer' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{s.emoji}</div>
                <div style={{ fontSize: '10px', color: s.color, fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>{s.level.toUpperCase()}</div>
                <div style={{ fontSize: '15px', fontWeight: '800', fontFamily: "'Syne',sans-serif", marginBottom: '6px', color: '#eee' }}>{s.title}</div>
                <div style={{ fontSize: '18px', color: s.color, fontWeight: '900', fontFamily: "'Syne',sans-serif", marginBottom: '10px', cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); speakKorean(s.scene); }}>
                  {s.scene}
                </div>
                <div style={{ fontSize: '11px', color: '#444' }}>🔊 Click Korean to hear it</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 32px' }}>
        <div style={{ fontSize: '11px', color: '#e94560', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>HOW IT WORKS</div>
        <h2 style={{ fontSize: '28px', fontWeight: '900', textAlign: 'center', fontFamily: "'Syne',sans-serif", margin: '0 0 36px' }}>
          Unlike any Korean app you've tried
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px' }}>
          {[
            { step: '01', icon: '🎬', title: 'Pick a Scene',       desc: 'Choose from 10 real K-Drama clips with actual dialogue scripts' },
            { step: '02', icon: '📜', title: 'Read the Script',    desc: 'See exact lines from the video with Korean, romanization, and meaning' },
            { step: '03', icon: '🔊', title: 'Click to Hear',      desc: 'Tap any word or sentence — hear native pronunciation instantly' },
            { step: '04', icon: '🎤', title: 'Shadow & Record',    desc: 'Record yourself repeating each line and compare your pronunciation' },
            { step: '05', icon: '🧩', title: 'Voice Quiz',         desc: 'Hear the English meaning, say it in Korean, get scored instantly' },
            { step: '06', icon: '🎮', title: 'Play the Game',      desc: 'Speak Korean commands to control your character in voice-driven missions' },
          ].map(s => (
            <div key={s.step} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '12px', right: '14px', fontSize: '10px', color: '#222', fontWeight: '900', fontFamily: "'Syne',sans-serif" }}>{s.step}</div>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{s.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', fontFamily: "'Syne',sans-serif", marginBottom: '6px' }}>{s.title}</div>
              <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: '900', color: '#e94560', fontFamily: "'Syne',sans-serif", marginBottom: '6px' }}>
          🎬 CineLingo
        </div>
        <div style={{ fontSize: '12px', color: '#333' }}>
          Learn Korean through K-Dramas · Built for placement portfolio
        </div>
      </footer>
    </div>
  );
}
