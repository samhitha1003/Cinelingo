import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:8080';
const tok = () => localStorage.getItem('cinelingo_token') || '';
const hdr = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

async function saveScore(payload) {
  try {
    await fetch(`${API}/api/scores`, { method: 'POST', headers: hdr(), body: JSON.stringify(payload) });
  } catch { /* silent */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// VOCABULARY from Learn page videos — tied to game levels
// ─────────────────────────────────────────────────────────────────────────────
const GAME_VOCAB = {
  beginner: [
    { korean:'왼쪽', romanization:'oen-jjok', english:'Left', action:'moveLeft' },
    { korean:'오른쪽', romanization:'o-reun-jjok', english:'Right', action:'moveRight' },
    { korean:'점프', romanization:'jeom-peu', english:'Jump', action:'jump' },
    { korean:'멈춰', romanization:'meom-chwo', english:'Stop', action:'stop' },
    { korean:'달려', romanization:'dal-lyeo', english:'Run', action:'run' },
    { korean:'숨어', romanization:'sum-eo', english:'Hide', action:'hide' },
    { korean:'공격해', romanization:'gong-gyeo-kae', english:'Attack', action:'attack' },
    { korean:'올라가', romanization:'ol-la-ga', english:'Climb', action:'climb' },
  ],
  intermediate: [
    { korean:'왼쪽으로 가', romanization:'oen-jjog-eu-ro ga', english:'Go Left', action:'moveLeft' },
    { korean:'오른쪽으로 가', romanization:'o-reun-jjog-eu-ro ga', english:'Go Right', action:'moveRight' },
    { korean:'빨리 달려', romanization:'ppal-li dal-lyeo', english:'Run Fast', action:'runFast' },
    { korean:'조용히 해', romanization:'jo-yong-hi hae', english:'Be Quiet', action:'sneak' },
    { korean:'숨어요', romanization:'sum-eo-yo', english:'Please Hide', action:'hide' },
    { korean:'뛰어 올라', romanization:'ddwi-eo ol-la', english:'Jump Up', action:'jump' },
    { korean:'공격하세요', romanization:'gong-gyeo-ka-se-yo', english:'Attack!', action:'attack' },
    { korean:'멈추세요', romanization:'meom-chu-se-yo', english:'Please Stop', action:'stop' },
  ],
  advanced: [
    { korean:'왼쪽으로 빠르게 이동하세요', romanization:'oen-jjog-eu-ro ppa-reu-ge i-dong-ha-se-yo', english:'Move quickly to the left', action:'moveLeft' },
    { korean:'오른쪽 문으로 달려가세요', romanization:'o-reun-jjok mu-neu-ro dal-lyeo-ga-se-yo', english:'Run to the right door', action:'moveRight' },
    { korean:'적이 보이면 즉시 숨으세요', romanization:'jeog-i bo-i-myeon jeuk-si sum-eu-se-yo', english:'Hide immediately when you see an enemy', action:'hide' },
    { korean:'지금 당장 공격하세요', romanization:'ji-geum dang-jang gong-gyeo-ka-se-yo', english:'Attack right now', action:'attack' },
    { korean:'최대한 빨리 탈출하세요', romanization:'choe-dae-han ppal-li tal-chul-ha-se-yo', english:'Escape as fast as possible', action:'runFast' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// THRILLER MISSIONS — 3 cinematic scenarios with multi-stage gameplay
// ─────────────────────────────────────────────────────────────────────────────
const MISSIONS = [
  {
    id: 'hideout',
    title: '🕵️ Operation Hideout',
    subtitle: 'Undercover Agent',
    desc: 'Thugs have broken into the building. Guide your partner to safety.',
    difficulty: 'beginner',
    bg: ['#0d0d1a','#1a1030','#0a1220'],
    accentColor: '#a78bfa',
    icon: '🕵️',
    stages: [
      { id:'s1', situation:'⚠️ Thugs entered the lobby!', instruction:'Tell your partner to HIDE', expected:'숨어', hint:'숨어 (sum-eo)', time:12, reward:200, enemyCount:2, enemySpeed:1 },
      { id:'s2', situation:'🚶 A thug is walking toward the corridor!', instruction:'Tell your partner to be QUIET', expected:'조용히', hint:'조용히 (jo-yong-hi)', time:10, reward:250, enemyCount:2, enemySpeed:1.2 },
      { id:'s3', situation:'🪟 Window exit on the left!', instruction:'Tell your partner to GO LEFT', expected:'왼쪽', hint:'왼쪽 (oen-jjok)', time:8, reward:300, enemyCount:3, enemySpeed:1.5 },
      { id:'s4', situation:'🏃 Path is clear — ESCAPE NOW!', instruction:'Tell your partner to RUN FAST', expected:'달려', hint:'달려 (dal-lyeo)', time:6, reward:400, enemyCount:3, enemySpeed:2 },
    ],
  },
  {
    id: 'heist',
    title: '💎 Diamond Heist',
    subtitle: 'Master Thief',
    desc: 'High-security museum. One chance. Guide your crew through the vault.',
    difficulty: 'intermediate',
    bg: ['#0d0a0a','#1a0d0d','#110808'],
    accentColor: '#f8d347',
    icon: '💎',
    stages: [
      { id:'s1', situation:'📷 Security camera rotating RIGHT!', instruction:'Tell partner to go LEFT (before camera sweeps)', expected:'왼쪽으로 가', hint:'왼쪽으로 가 (oen-jjog-eu-ro ga)', time:10, reward:250, enemyCount:2, enemySpeed:1 },
      { id:'s2', situation:'👮 Guard approaching from ahead!', instruction:'Tell partner to HIDE behind the pillar', expected:'숨어요', hint:'숨어요 (sum-eo-yo)', time:8, reward:300, enemyCount:3, enemySpeed:1.3 },
      { id:'s3', situation:'🚨 Alarm triggered! Only 6 seconds!', instruction:'Tell partner to RUN FAST to exit', expected:'빨리 달려', hint:'빨리 달려 (ppal-li dal-lyeo)', time:6, reward:350, enemyCount:4, enemySpeed:2 },
      { id:'s4', situation:'🚁 Helicopter on the roof!', instruction:'Tell partner to JUMP onto the roof', expected:'뛰어 올라', hint:'뛰어 올라 (ddwi-eo ol-la)', time:8, reward:400, enemyCount:2, enemySpeed:1.5 },
      { id:'s5', situation:'💎 Diamond secured! Escape right!', instruction:'Tell partner to GO RIGHT to the van', expected:'오른쪽으로 가', hint:'오른쪽으로 가 (o-reun-jjog-eu-ro ga)', time:7, reward:500, enemyCount:5, enemySpeed:2.5 },
    ],
  },
  {
    id: 'spy',
    title: '🕶️ Spy Extraction',
    subtitle: 'Elite Operative',
    desc: 'Your asset is compromised. Full Korean communication only. Exfiltrate now.',
    difficulty: 'advanced',
    bg: ['#060a0d','#0a1628','#061018'],
    accentColor: '#38bdf8',
    icon: '🕶️',
    stages: [
      { id:'s1', situation:'📡 Laser grid active. 5 second window!', instruction:'Command: Move quickly to the LEFT', expected:'왼쪽으로 빠르게 이동하세요', hint:'왼쪽으로 빠르게 이동하세요', time:14, reward:300, enemyCount:3, enemySpeed:1 },
      { id:'s2', situation:'🔦 Searchlight sweeping!', instruction:'Command: Hide immediately when you see an enemy', expected:'적이 보이면 즉시 숨으세요', hint:'적이 보이면 즉시 숨으세요', time:12, reward:350, enemyCount:3, enemySpeed:1.5 },
      { id:'s3', situation:'🚗 Getaway car is RIGHT side!', instruction:'Command: Run to the right door', expected:'오른쪽 문으로 달려가세요', hint:'오른쪽 문으로 달려가세요', time:10, reward:400, enemyCount:4, enemySpeed:2 },
      { id:'s4', situation:'💣 Building is rigged! 8 seconds!', instruction:'Command: Escape as fast as possible', expected:'최대한 빨리 탈출하세요', hint:'최대한 빨리 탈출하세요', time:8, reward:500, enemyCount:5, enemySpeed:2.5 },
      { id:'s5', situation:'🎯 Sniper spotted! Attack first!', instruction:'Command: Attack right now', expected:'지금 당장 공격하세요', hint:'지금 당장 공격하세요', time:7, reward:600, enemyCount:6, enemySpeed:3 },
    ],
  },
];

const STORY_LEVELS = [
  { number:1, title:'Basic Commands', icon:'🌱', color:'#4ade80', difficulty:'beginner', desc:'Control your character with basic Korean words', vocab: GAME_VOCAB.beginner.slice(0,4) },
  { number:2, title:'Action Hero', icon:'⚡', color:'#38bdf8', difficulty:'beginner', desc:'Master movement and combat basics', vocab: GAME_VOCAB.beginner.slice(0,6) },
  { number:3, title:'Phrase Master', icon:'🎯', color:'#fb923c', difficulty:'intermediate', desc:'Use full Korean phrases to control your character', vocab: GAME_VOCAB.intermediate.slice(0,4) },
  { number:4, title:'Korean Agent', icon:'🕵️', color:'#a78bfa', difficulty:'intermediate', desc:'Intermediate commands in high-pressure situations', vocab: GAME_VOCAB.intermediate },
  { number:5, title:'Elite Operative', icon:'🔥', color:'#e94560', difficulty:'advanced', desc:'Full sentences — true Korean fluency under pressure', vocab: GAME_VOCAB.advanced },
];

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS GAME ENGINE
// ─────────────────────────────────────────────────────────────────────────────
function GameCanvas({ gameState, onAction }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const stateRef  = useRef(gameState);

  useEffect(() => { stateRef.current = gameState; }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;

    const draw = () => {
      const { width: W, height: H } = canvas;
      const st = stateRef.current;
      frame++;

      // ── Background ──
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      const bg = st.mission?.bg || ['#0d0d1a','#161630','#1a1a3e'];
      bgGrad.addColorStop(0, bg[0]);
      bgGrad.addColorStop(0.6, bg[1]);
      bgGrad.addColorStop(1, bg[2]);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // ── Parallax stars ──
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      for (let i = 0; i < 40; i++) {
        const x = ((i * 137 + frame * 0.2) % W);
        const y = (i * 83) % (H * 0.55);
        const s = (i % 3 === 0) ? 1.5 : 1;
        ctx.fillRect(x, y, s, s);
      }

      // ── Ground ──
      const groundY = H * 0.78;
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, H);
      groundGrad.addColorStop(0, 'rgba(60,200,120,0.25)');
      groundGrad.addColorStop(1, 'rgba(20,80,40,0.4)');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, W, H - groundY);

      // Ground line
      ctx.strokeStyle = 'rgba(100,255,150,0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

      // ── Buildings silhouettes ──
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      const bldgs = [[0.05,0.3,0.08,0.55],[0.15,0.42,0.06,0.43],[0.25,0.25,0.1,0.6],[0.42,0.35,0.07,0.5],[0.55,0.2,0.12,0.65],[0.72,0.38,0.08,0.47],[0.85,0.28,0.1,0.57]];
      bldgs.forEach(([x,y,w,h]) => {
        ctx.fillRect(W*x, H*y, W*w, H*h);
        // Windows
        ctx.fillStyle = 'rgba(255,220,100,0.15)';
        for (let wy = H*y + 10; wy < H*(y+h) - 10; wy += 18) {
          for (let wx = W*x + 8; wx < W*(x+w) - 8; wx += 14) {
            if (Math.sin(wx * wy * 0.001 + frame * 0.02) > 0.2) ctx.fillRect(wx, wy, 6, 8);
          }
        }
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
      });

      // ── Enemies ──
      (st.enemies || []).forEach(enemy => {
        const ex = enemy.x * W / 100;
        const ey = groundY - enemy.size;
        const accentColor = st.mission?.accentColor || '#e94560';

        // Body
        const bodyGrad = ctx.createRadialGradient(ex, ey - enemy.size/2, 2, ex, ey - enemy.size/2, enemy.size);
        bodyGrad.addColorStop(0, '#cc2222');
        bodyGrad.addColorStop(1, '#660000');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(ex, ey - enemy.size * 0.4, enemy.size * 0.35, enemy.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#b8a090';
        ctx.beginPath();
        ctx.arc(ex, ey - enemy.size, enemy.size * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Glowing eyes
        ctx.fillStyle = accentColor;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(ex - 5, ey - enemy.size, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + 5, ey - enemy.size, 3, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        // Alert indicator
        if (enemy.alerted) {
          ctx.fillStyle = '#ff4444';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText('!', ex - 4, ey - enemy.size * 1.6);
        }
      });

      // ── Player character ──
      if (st.player) {
        const px = st.player.x * W / 100;
        const py = groundY;
        const { action, size = 40, hidden, attacking } = st.player;
        const accentColor = st.level?.color || st.mission?.accentColor || '#4ade80';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath(); ctx.ellipse(px, py - 4, 22, 6, 0, 0, Math.PI * 2); ctx.fill();

        if (!hidden) {
          // Body glow
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = 12 + Math.sin(frame * 0.1) * 4;

          // Legs (animated walk)
          const legAngle = (action === 'moveLeft' || action === 'moveRight' || action === 'run' || action === 'runFast')
            ? Math.sin(frame * 0.4) * 18 : 0;

          // Torso
          const bodyY = py - size * 0.6;
          const bodyGrad = ctx.createLinearGradient(px - 14, bodyY - 18, px + 14, bodyY + 18);
          bodyGrad.addColorStop(0, accentColor + 'cc');
          bodyGrad.addColorStop(1, accentColor + '55');
          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.roundRect(px - 14, bodyY - 18, 28, 36, 6);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Left leg
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(px - 6, bodyY + 18);
          ctx.lineTo(px - 6 + Math.sin((legAngle) * Math.PI/180) * 18, py);
          ctx.stroke();

          // Right leg
          ctx.beginPath();
          ctx.moveTo(px + 6, bodyY + 18);
          ctx.lineTo(px + 6 - Math.sin((legAngle) * Math.PI/180) * 18, py);
          ctx.stroke();

          // Arms
          const armSwing = action === 'attack' ? 60 : Math.sin(frame * 0.4) * 25;
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(px - 14, bodyY - 5); ctx.lineTo(px - 30, bodyY - 5 + armSwing * 0.3); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(px + 14, bodyY - 5); ctx.lineTo(px + 30, bodyY - 5 - armSwing * 0.3); ctx.stroke();

          // Head
          ctx.fillStyle = '#e8c8a8';
          ctx.beginPath(); ctx.arc(px, bodyY - 26, 16, 0, Math.PI * 2); ctx.fill();

          // Hair
          ctx.fillStyle = accentColor;
          ctx.beginPath(); ctx.arc(px, bodyY - 38, 10, Math.PI, Math.PI * 2); ctx.fill();

          // Eyes
          ctx.fillStyle = '#333';
          ctx.beginPath(); ctx.arc(px - 5, bodyY - 28, 3, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(px + 5, bodyY - 28, 3, 0, Math.PI * 2); ctx.fill();

          // Attack effect
          if (attacking) {
            ctx.strokeStyle = '#f8d347';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#f8d347';
            ctx.shadowBlur = 20;
            for (let a = 0; a < 8; a++) {
              const angle = (a / 8) * Math.PI * 2 + frame * 0.2;
              ctx.beginPath();
              ctx.moveTo(px + Math.cos(angle) * 25, bodyY - 10 + Math.sin(angle) * 25);
              ctx.lineTo(px + Math.cos(angle) * 45, bodyY - 10 + Math.sin(angle) * 45);
              ctx.stroke();
            }
            ctx.shadowBlur = 0;
          }

          // Run dust particles
          if (action === 'runFast') {
            for (let p = 0; p < 5; p++) {
              const dustX = px - 20 - p * 12 + Math.sin(frame * 0.3 + p) * 5;
              const dustY = py - Math.random() * 10;
              ctx.fillStyle = `rgba(255,255,255,${0.15 - p * 0.025})`;
              ctx.beginPath(); ctx.arc(dustX, dustY, 4 - p * 0.5, 0, Math.PI * 2); ctx.fill();
            }
          }
        } else {
          // Hidden state — crouched silhouette
          ctx.fillStyle = 'rgba(100,200,255,0.15)';
          ctx.strokeStyle = 'rgba(100,200,255,0.4)';
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(px, py - 16, 16, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.font = '18px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('👻', px, py - 8);
        }

        // Name tag
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath(); ctx.roundRect(px - 28, py - size - 24, 56, 18, 4); ctx.fill();
        ctx.fillStyle = accentColor;
        ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('YOU', px, py - size - 11);
      }

      // ── Platforms ──
      if (st.platforms) {
        st.platforms.forEach(p => {
          const px2 = p.x * W / 100, py2 = p.y * H / 100;
          const pw = p.w * W / 100;
          ctx.fillStyle = 'rgba(100,200,100,0.2)';
          ctx.strokeStyle = 'rgba(100,200,100,0.5)';
          ctx.lineWidth = 2;
          ctx.fillRect(px2, py2, pw, 10);
          ctx.strokeRect(px2, py2, pw, 10);
        });
      }

      // ── Score popup ──
      if (st.scorePopup) {
        const alpha = 1 - st.scorePopup.age / 60;
        ctx.fillStyle = `rgba(248,211,71,${alpha})`;
        ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(`+${st.scorePopup.value}`, st.scorePopup.x * W/100, (groundY - 60) - st.scorePopup.age * 1.5);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block' }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// FUZZY MATCH
// ─────────────────────────────────────────────────────────────────────────────
function fuzzyMatch(spoken, target) {
  const s = spoken.trim().toLowerCase().replace(/\s+/g,' ');
  const t = target.trim().toLowerCase();
  if (s === t || s.includes(t) || t.includes(s)) return true;
  // Character overlap score
  let matches = 0;
  for (const ch of s) { if (t.includes(ch)) matches++; }
  return (matches / Math.max(s.length, t.length)) > 0.6;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN GAME COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Game() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [screen, setScreen]     = useState('menu'); // menu | briefing | playing | end
  const [mode, setMode]         = useState(null);   // { type:'story'|'thriller', data: level|mission }
  const [stageIdx, setStageIdx] = useState(0);
  const [score, setScore]       = useState(0);
  const [lives, setLives]       = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [listening, setListening] = useState(false);
  const [heard, setHeard]       = useState('');
  const [feedback, setFeedback] = useState(null);  // { text, type: 'success'|'error'|'info' }
  const [endReason, setEndReason] = useState('');
  const [combo, setCombo]       = useState(0);
  const [streak, setStreak]     = useState(0);
  const [completedWords, setCompletedWords] = useState([]);

  // Canvas game state
  const [gameState, setGameState] = useState({
    player: { x: 15, y: 70, action: 'idle', hidden: false, attacking: false, size: 40 },
    enemies: [],
    platforms: [],
    scorePopup: null,
    mission: null,
    level: null,
  });

  const recRef    = useRef(null);
  const timerRef  = useRef(null);
  const scoreRef  = useRef(0);
  const livesRef  = useRef(3);
  const comboRef  = useRef(0);
  const stageRef  = useRef(0);

  // ── Setup speech recognition ──────────────────────────────────────────────
  const setupRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.lang = 'ko-KR'; r.continuous = false; r.interimResults = false;
    r.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      setHeard(text);
      handleSpoken(text);
    };
    r.onend = () => setListening(false);
    r.onerror = () => { setListening(false); setFeedback({ text:'Mic error — try again', type:'error' }); };
    return r;
  }, [mode, stageIdx]);

  useEffect(() => {
    recRef.current = setupRecognition();
    return () => recRef.current?.abort();
  }, [setupRecognition]);

  // ── Timer ─────────────────────────────────────────────────────────────────
  const startTimer = (seconds) => {
    clearInterval(timerRef.current);
    let t = seconds;
    timerRef.current = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t <= 0) { clearInterval(timerRef.current); endGame('timeout'); }
    }, 1000);
  };

  // ── Spawn enemies ──────────────────────────────────────────────────────────
  const spawnEnemies = (count, speed) => {
    const enemies = [];
    for (let i = 0; i < count; i++) {
      enemies.push({
        id: i,
        x: 60 + i * 15,
        speed,
        size: 36,
        alerted: i === 0,
        dir: -1,
      });
    }
    setGameState(prev => ({ ...prev, enemies }));
  };

  // ── Start game ────────────────────────────────────────────────────────────
  const startGame = (selectedMode) => {
    setMode(selectedMode);
    setScore(0); scoreRef.current = 0;
    setLives(3); livesRef.current = 3;
    setCombo(0); comboRef.current = 0;
    setStreak(0);
    setStageIdx(0); stageRef.current = 0;
    setHeard(''); setFeedback(null); setEndReason('');
    setCompletedWords([]);

    const firstStage = selectedMode.type === 'thriller'
      ? selectedMode.data.stages[0]
      : null;
    const time = firstStage?.time || 60;
    setTimeLeft(time);

    const missionData = selectedMode.type === 'thriller' ? selectedMode.data : null;
    const levelData   = selectedMode.type === 'story'    ? selectedMode.data : null;

    setGameState({
      player: { x: 15, y: 70, action: 'idle', hidden: false, attacking: false, size: 40 },
      enemies: [],
      platforms: [{ x:30,y:55,w:15 },{ x:55,y:45,w:12 },{ x:75,y:60,w:10 }],
      scorePopup: null,
      mission: missionData,
      level: levelData,
    });

    if (firstStage) spawnEnemies(firstStage.enemyCount || 2, firstStage.enemySpeed || 1);
    setScreen('playing');
    startTimer(time);
  };

  // ── End game ──────────────────────────────────────────────────────────────
  const endGame = useCallback((reason) => {
    clearInterval(timerRef.current);
    recRef.current?.abort();
    setEndReason(reason);
    setScreen('end');
    if (user?.id) {
      saveScore({
        userId: user.id, username: user.username,
        gameMode: mode?.type || 'story',
        level: mode?.data?.number || mode?.data?.difficulty || 1,
        totalScore: scoreRef.current,
        livesRemaining: livesRef.current,
        status: reason,
      });
    }
  }, [mode, user]);

  // ── Handle spoken command ──────────────────────────────────────────────────
  const handleSpoken = useCallback((text) => {
    if (!mode) return;

    if (mode.type === 'thriller') {
      const stages = mode.data.stages;
      const stage = stages[stageRef.current];
      if (!stage) return;

      if (fuzzyMatch(text, stage.expected)) {
        // Success
        const bonusMultiplier = 1 + comboRef.current * 0.1;
        const points = Math.round(stage.reward * bonusMultiplier);
        scoreRef.current += points;
        setScore(scoreRef.current);
        comboRef.current++;
        setCombo(comboRef.current);
        setStreak(p => p + 1);
        setCompletedWords(p => [...p, stage.expected]);
        setFeedback({ text: `✅ 완벽해요! +${points}${comboRef.current > 1 ? ` 🔥×${comboRef.current}` : ''}`, type:'success' });

        // Animate player action
        const action = stage.expected.includes('왼쪽') ? 'moveLeft'
          : stage.expected.includes('오른쪽') ? 'moveRight'
          : stage.expected.includes('달려') ? 'runFast'
          : stage.expected.includes('숨') ? 'hide'
          : stage.expected.includes('공격') ? 'attack'
          : stage.expected.includes('점프') || stage.expected.includes('뛰') ? 'jump'
          : 'idle';

        applyAction(action);

        // Score popup
        setGameState(prev => ({
          ...prev,
          scorePopup: { value: points, x: 50, age: 0 },
        }));
        setTimeout(() => setGameState(prev => ({ ...prev, scorePopup: null })), 2000);

        setTimeout(() => {
          const next = stageRef.current + 1;
          if (next >= stages.length) {
            endGame('victory');
          } else {
            stageRef.current = next;
            setStageIdx(next);
            setFeedback(null);
            const nextStage = stages[next];
            setTimeLeft(nextStage.time);
            spawnEnemies(nextStage.enemyCount, nextStage.enemySpeed);
            startTimer(nextStage.time);
          }
        }, 2000);
      } else {
        // Wrong
        comboRef.current = 0;
        setCombo(0);
        livesRef.current--;
        setLives(livesRef.current);
        setFeedback({ text: `❌ Wrong! Say: ${stage.hint}`, type:'error' });
        shakePlayer();
        if (livesRef.current <= 0) setTimeout(() => endGame('gameover'), 1000);
      }
    } else {
      // Story mode
      const vocab = mode.data.vocab || [];
      const matched = vocab.find(w => fuzzyMatch(text, w.korean));
      if (matched) {
        const alreadyDone = completedWords.includes(matched.korean);
        if (!alreadyDone) {
          const pts = 80 + comboRef.current * 20;
          scoreRef.current += pts;
          setScore(scoreRef.current);
          comboRef.current++;
          setCombo(comboRef.current);
          setStreak(p => p + 1);
          setCompletedWords(p => [...p, matched.korean]);
          setFeedback({ text: `✅ ${matched.korean} — ${matched.english}! +${pts}`, type:'success' });
          applyAction(matched.action);
          setGameState(prev => ({ ...prev, scorePopup: { value: pts, x: 50, age: 0 } }));
          setTimeout(() => setGameState(prev => ({ ...prev, scorePopup: null })), 1500);

          // Check if all words done
          if (completedWords.length + 1 >= vocab.length) {
            setTimeout(() => endGame('victory'), 1500);
          }
        } else {
          setFeedback({ text:`⭐ ${matched.korean} — already done! Try another.`, type:'info' });
        }
      } else {
        comboRef.current = 0; setCombo(0);
        livesRef.current--; setLives(livesRef.current);
        setFeedback({ text:`❌ Not recognized. Try again!`, type:'error' });
        shakePlayer();
        if (livesRef.current <= 0) endGame('gameover');
      }
    }
  }, [mode, completedWords, endGame]);

  const applyAction = (action) => {
    setGameState(prev => {
      let { x } = prev.player;
      let hidden = false, attacking = false;

      switch(action) {
        case 'moveLeft':  x = Math.max(5, x - 20); break;
        case 'moveRight': x = Math.min(90, x + 20); break;
        case 'run':       x = Math.min(90, x + 15); break;
        case 'runFast':   x = Math.min(90, x + 30); break;
        case 'hide':      hidden = true; break;
        case 'attack':    attacking = true; break;
        case 'jump':      break; // handled by animation
        default: break;
      }

      return { ...prev, player: { ...prev.player, x, action, hidden, attacking } };
    });

    // Reset attacking state
    if (action === 'attack') setTimeout(() => setGameState(prev => ({ ...prev, player: { ...prev.player, attacking: false } })), 1000);
    if (action === 'hide') setTimeout(() => setGameState(prev => ({ ...prev, player: { ...prev.player, hidden: false } })), 3000);
  };

  const shakePlayer = () => {
    const origX = gameState.player.x;
    setGameState(prev => ({ ...prev, player: { ...prev.player, x: prev.player.x + 4 } }));
    setTimeout(() => setGameState(prev => ({ ...prev, player: { ...prev.player, x: prev.player.x - 8 } })), 100);
    setTimeout(() => setGameState(prev => ({ ...prev, player: { ...prev.player, x: origX } })), 200);
  };

  const speak = () => {
    if (!recRef.current || listening) return;
    setListening(true); setHeard(''); setFeedback(null);
    try { recRef.current.start(); } catch { setListening(false); }
  };

  const stopGame = () => {
    clearInterval(timerRef.current);
    recRef.current?.abort();
    setScreen('menu');
  };

  // ── Current stage info ────────────────────────────────────────────────────
  const currentStage = mode?.type === 'thriller' ? mode.data.stages[stageIdx] : null;
  const maxTime = currentStage?.time || 60;
  const timeColor = timeLeft <= 5 ? '#e94560' : timeLeft <= 15 ? '#fb923c' : '#4ade80';
  const difficultyColor = { beginner:'#4ade80', intermediate:'#fb923c', advanced:'#e94560' };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'#08081a', color:'#fff', fontFamily:"'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        @keyframes glow{0%,100%{box-shadow:0 0 16px rgba(233,69,96,0.3)}50%{box-shadow:0 0 36px rgba(233,69,96,0.7)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes bounceIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
        .card-hover:hover{transform:translateY(-5px)!important;border-color:var(--accent)!important}
        .tab-btn:hover{opacity:.85}
      `}</style>

      {/* Nav */}
      <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 28px', background:'rgba(8,8,26,0.97)', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, zIndex:100, backdropFilter:'blur(12px)' }}>
        <div style={{ fontSize:'19px', fontWeight:'800', color:'#e94560', cursor:'pointer', fontFamily:"'Syne',sans-serif" }} onClick={() => navigate('/')}>🎬 CineLingo</div>
        <div style={{ display:'flex', gap:'22px' }}>
          {[['Learn','/learn'],['Game','/game'],['Leaderboard','/leaderboard'],['Profile','/profile']].map(([l,p])=>(
            <span key={p} style={{ fontSize:'13px', cursor:'pointer', color:p==='/game'?'#e94560':'#666', fontWeight:p==='/game'?'700':'400' }} onClick={()=>navigate(p)}>{l}</span>
          ))}
        </div>
        <span style={{ color:'#555', fontSize:'13px' }}>👋 {user?.username}</span>
      </nav>

      {/* ════════════════════ MENU ════════════════════ */}
      {screen === 'menu' && (
        <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'44px 24px', animation:'fadeUp .45s ease' }}>
          <div style={{ textAlign:'center', marginBottom:'44px' }}>
            <div style={{ fontSize:'11px', color:'#e94560', fontWeight:'700', letterSpacing:'4px', marginBottom:'10px' }}>KOREAN VOICE CONTROL</div>
            <h1 style={{ fontSize:'48px', fontWeight:'900', margin:'0 0 8px', fontFamily:"'Syne',sans-serif", letterSpacing:'-1px' }}>🎮 Choose Your Mission</h1>
            <p style={{ fontSize:'14px', color:'#444', margin:0 }}>Speak Korean → Character moves. No typing, no clicking. Pure voice.</p>
          </div>

          {/* Story Mode */}
          <div style={{ marginBottom:'44px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
              <div style={{ fontSize:'11px', color:'#4ade80', fontWeight:'700', letterSpacing:'2px' }}>📖 STORY MODE</div>
              <div style={{ flex:1, height:'1px', background:'rgba(74,222,128,0.15)' }}/>
              <span style={{ fontSize:'11px', color:'#444' }}>Levels 1-5 · Beginner → Advanced</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'12px' }}>
              {STORY_LEVELS.map(lvl => (
                <div key={lvl.number} className="card-hover"
                  style={{ '--accent':lvl.color, background:'rgba(255,255,255,0.02)', border:`1px solid ${lvl.color}28`, borderRadius:'16px', padding:'20px', cursor:'pointer', transition:'all .22s' }}
                  onClick={() => startGame({ type:'story', data: lvl })}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                    <span style={{ fontSize:'28px' }}>{lvl.icon}</span>
                    <span style={{ fontSize:'10px', background:`${lvl.color}18`, border:`1px solid ${lvl.color}44`, borderRadius:'8px', padding:'2px 8px', color:lvl.color, fontWeight:'800' }}>LVL {lvl.number}</span>
                  </div>
                  <div style={{ fontSize:'14px', fontWeight:'800', color:lvl.color, marginBottom:'3px', fontFamily:"'Syne',sans-serif" }}>{lvl.title}</div>
                  <div style={{ fontSize:'11px', color:'#555', marginBottom:'12px' }}>{lvl.desc}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                    {lvl.vocab.slice(0,3).map((w,i)=>(
                      <span key={i} style={{ fontSize:'10px', padding:'2px 7px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'6px', color:'#888' }}>
                        {w.romanization}
                      </span>
                    ))}
                    {lvl.vocab.length > 3 && <span style={{ fontSize:'10px', color:'#444' }}>+{lvl.vocab.length-3} more</span>}
                  </div>
                  <div style={{ marginTop:'12px', fontSize:'10px', color:difficultyColor[lvl.difficulty], fontWeight:'700', textTransform:'uppercase' }}>● {lvl.difficulty}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Thriller Missions */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
              <div style={{ fontSize:'11px', color:'#e94560', fontWeight:'700', letterSpacing:'2px' }}>🔥 THRILLER MISSIONS</div>
              <div style={{ flex:1, height:'1px', background:'rgba(233,69,96,0.15)' }}/>
              <span style={{ fontSize:'11px', color:'#444' }}>Multi-stage · High-stakes Korean</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'14px' }}>
              {MISSIONS.map(mission => (
                <div key={mission.id} className="card-hover"
                  style={{ '--accent':mission.accentColor, position:'relative', background:`linear-gradient(135deg,${mission.bg[0]},${mission.bg[1]},${mission.bg[2]})`, border:`1px solid ${mission.accentColor}33`, borderRadius:'20px', padding:'24px', cursor:'pointer', transition:'all .22s', overflow:'hidden' }}
                  onClick={() => startGame({ type:'thriller', data: mission })}>
                  {/* Glow orb */}
                  <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'80px', height:'80px', borderRadius:'50%', background:mission.accentColor, opacity:0.08, filter:'blur(20px)' }}/>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                    <div>
                      <div style={{ fontSize:'10px', color:mission.accentColor, fontWeight:'700', letterSpacing:'2px', marginBottom:'4px' }}>{mission.subtitle.toUpperCase()}</div>
                      <div style={{ fontSize:'18px', fontWeight:'800', color:'#fff', fontFamily:"'Syne',sans-serif" }}>{mission.title}</div>
                    </div>
                    <span style={{ fontSize:'11px', padding:'4px 10px', borderRadius:'8px', background:`${difficultyColor[mission.difficulty]}18`, border:`1px solid ${difficultyColor[mission.difficulty]}44`, color:difficultyColor[mission.difficulty], fontWeight:'800' }}>
                      {mission.difficulty}
                    </span>
                  </div>
                  <p style={{ fontSize:'13px', color:'#666', margin:'0 0 16px', lineHeight:1.6 }}>{mission.desc}</p>
                  {/* Stage pills */}
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'14px' }}>
                    {mission.stages.map((st,i)=>(
                      <div key={i} style={{ fontSize:'10px', padding:'3px 10px', borderRadius:'8px', background:`${mission.accentColor}15`, border:`1px solid ${mission.accentColor}33`, color:mission.accentColor, fontWeight:'700' }}>
                        Stage {i+1}
                      </div>
                    ))}
                  </div>
                  {/* Vocab preview */}
                  <div style={{ fontSize:'11px', color:'#444' }}>
                    Commands: {mission.stages.map(s => s.expected).join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div style={{ marginTop:'32px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', padding:'16px 20px', display:'flex', gap:'12px', alignItems:'center' }}>
            <span style={{ fontSize:'20px' }}>💡</span>
            <div>
              <div style={{ fontSize:'13px', fontWeight:'700', marginBottom:'2px' }}>How it works</div>
              <div style={{ fontSize:'12px', color:'#555' }}>Press the mic button → Speak Korean → Watch your character react on the canvas. Use Chrome for best voice recognition results.</div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════ PLAYING ════════════════════ */}
      {screen === 'playing' && (
        <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 57px)' }}>

          {/* HUD */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 20px', background:'rgba(0,0,0,0.7)', borderBottom:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(10px)', gap:'16px' }}>
            {/* Left: mode info */}
            <div style={{ display:'flex', alignItems:'center', gap:'10px', minWidth:'180px' }}>
              <span style={{ fontSize:'18px' }}>{mode?.data?.icon || '🎮'}</span>
              <div>
                <div style={{ fontSize:'13px', fontWeight:'800', color: mode?.data?.accentColor || mode?.data?.color || '#e94560', fontFamily:"'Syne',sans-serif" }}>
                  {mode?.data?.title || 'Story Mode'}
                </div>
                {mode?.type === 'thriller' && (
                  <div style={{ fontSize:'10px', color:'#444' }}>Stage {stageIdx+1} / {mode.data.stages.length}</div>
                )}
              </div>
            </div>

            {/* Center: timer */}
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{ flex:1, height:'8px', background:'rgba(255,255,255,0.06)', borderRadius:'4px', overflow:'hidden' }}>
                <div style={{ width:`${(timeLeft/maxTime)*100}%`, height:'100%', background:timeColor, borderRadius:'4px', transition:'width 1s linear, background .3s' }}/>
              </div>
              <span style={{ fontSize:'18px', fontWeight:'800', color:timeColor, minWidth:'40px', fontFamily:"'Syne',sans-serif" }}>{timeLeft}s</span>
            </div>

            {/* Right: score + lives + combo */}
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              {combo > 1 && (
                <span style={{ fontSize:'12px', padding:'3px 10px', background:'rgba(248,211,71,0.15)', border:'1px solid rgba(248,211,71,0.4)', borderRadius:'20px', color:'#f8d347', fontWeight:'800', animation:'pulse .5s ease' }}>
                  🔥 ×{combo}
                </span>
              )}
              <span style={{ fontSize:'18px', fontWeight:'800', color:'#f8d347', fontFamily:"'Syne',sans-serif" }}>⭐ {score}</span>
              <div style={{ display:'flex', gap:'3px' }}>
                {[...Array(3)].map((_,i)=>( <span key={i} style={{ fontSize:'16px', opacity:i < lives ? 1 : 0.2 }}>❤️</span> ))}
              </div>
              <button onClick={stopGame} style={{ padding:'5px 12px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'8px', color:'#666', fontSize:'11px', cursor:'pointer', fontFamily:'inherit' }}>✕ Quit</button>
            </div>
          </div>

          {/* Stage directive banner (thriller) */}
          {mode?.type === 'thriller' && currentStage && (
            <div style={{ margin:'10px 16px', background:`linear-gradient(135deg,${mode.data.bg[0]},${mode.data.bg[1]})`, border:`1px solid ${mode.data.accentColor}33`, borderRadius:'14px', padding:'16px 20px', animation:'slideIn .3s ease' }}>
              {/* Stage progress dots */}
              <div style={{ display:'flex', gap:'6px', marginBottom:'12px' }}>
                {mode.data.stages.map((_,i)=>(
                  <div key={i} style={{ flex:1, height:'4px', borderRadius:'2px', background:i<stageIdx?'#4ade80':i===stageIdx?mode.data.accentColor:'rgba(255,255,255,0.08)', transition:'background .3s' }}/>
                ))}
              </div>
              <div style={{ display:'flex', gap:'24px', alignItems:'flex-start' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'14px', fontWeight:'700', color:'#f8d347', marginBottom:'6px' }}>⚠️ {currentStage.situation}</div>
                  <div style={{ fontSize:'13px', color:'#888', marginBottom:'6px' }}>📢 {currentStage.instruction}</div>
                  <div style={{ fontSize:'13px', color:mode.data.accentColor, fontWeight:'700' }}>💬 Say: <span style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px' }}>{currentStage.expected}</span></div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'11px', color:'#444', marginBottom:'3px' }}>Pronunciation</div>
                  <div style={{ fontSize:'13px', color:'#666', fontStyle:'italic' }}>{currentStage.hint.split('(')[1]?.replace(')','') || currentStage.hint}</div>
                  <div style={{ fontSize:'11px', color:'#f8d347', marginTop:'6px' }}>+{currentStage.reward} pts</div>
                </div>
              </div>
            </div>
          )}

          {/* Canvas Game World */}
          <div style={{ flex:1, position:'relative', margin:'0 16px 8px', borderRadius:'14px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)', minHeight:'200px' }}>
            <GameCanvas gameState={{ ...gameState, mission: mode?.type==='thriller'?mode.data:null, level: mode?.type==='story'?mode.data:null }} />

            {/* Story mode: word checklist overlay */}
            {mode?.type === 'story' && (
              <div style={{ position:'absolute', top:'12px', right:'12px', display:'flex', flexDirection:'column', gap:'6px' }}>
                {mode.data.vocab.map((w,i)=>{
                  const done = completedWords.includes(w.korean);
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', background:done?'rgba(74,222,128,0.15)':'rgba(0,0,0,0.6)', border:`1px solid ${done?'rgba(74,222,128,0.5)':'rgba(255,255,255,0.12)'}`, borderRadius:'10px', backdropFilter:'blur(8px)', transition:'all .3s' }}>
                      <span style={{ fontSize:'16px' }}>{done?'✅':'🎤'}</span>
                      <div>
                        <div style={{ fontSize:'10px', color:done?'#4ade80':'#888', fontWeight:'700' }}>{w.romanization}</div>
                        <div style={{ fontSize:'9px', color:'#444' }}>{w.english}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Feedback overlay */}
            {feedback && (
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'bounceIn .3s ease', zIndex:10 }}>
                <div style={{ padding:'14px 28px', borderRadius:'14px', fontSize:'16px', fontWeight:'800', fontFamily:"'Syne',sans-serif", textAlign:'center', backdropFilter:'blur(12px)',
                  background:feedback.type==='success'?'rgba(74,222,128,0.2)':feedback.type==='error'?'rgba(233,69,96,0.2)':'rgba(56,189,248,0.15)',
                  border:`1px solid ${feedback.type==='success'?'rgba(74,222,128,0.5)':feedback.type==='error'?'rgba(233,69,96,0.5)':'rgba(56,189,248,0.4)'}`,
                  color:feedback.type==='success'?'#4ade80':feedback.type==='error'?'#e94560':'#38bdf8',
                  boxShadow:`0 0 32px ${feedback.type==='success'?'rgba(74,222,128,0.3)':feedback.type==='error'?'rgba(233,69,96,0.3)':'rgba(56,189,248,0.2)'}`,
                }}>
                  {feedback.text}
                </div>
              </div>
            )}
          </div>

          {/* Voice Controls */}
          <div style={{ padding:'12px 16px 16px', background:'rgba(0,0,0,0.5)', borderTop:'1px solid rgba(255,255,255,0.06)', backdropFilter:'blur(10px)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>

              {/* Heard display */}
              <div style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', padding:'10px 16px', minHeight:'44px', display:'flex', alignItems:'center' }}>
                {listening ? (
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ display:'flex', gap:'3px', alignItems:'flex-end', height:'20px' }}>
                      {[1,2,3,4,5].map(i=>(
                        <div key={i} style={{ width:'3px', background:'#4ade80', borderRadius:'2px', animation:`pulse ${0.5+i*0.1}s ease infinite`, height:`${8+i*3}px` }}/>
                      ))}
                    </div>
                    <span style={{ fontSize:'13px', color:'#4ade80', fontWeight:'700' }}>Listening for Korean...</span>
                  </div>
                ) : heard ? (
                  <span style={{ fontSize:'16px', fontWeight:'800', color:'#f8d347', fontFamily:"'Syne',sans-serif" }}>🎤 "{heard}"</span>
                ) : (
                  <span style={{ fontSize:'13px', color:'#333' }}>Press the mic and speak Korean 🇰🇷</span>
                )}
              </div>

              {/* Mic button */}
              <button onClick={speak} disabled={listening}
                style={{ padding:'13px 36px', borderRadius:'50px', border:'none', color:'#fff', fontSize:'15px', fontWeight:'800', cursor:listening?'not-allowed':'pointer', fontFamily:"'Syne',sans-serif",
                  background:listening?'linear-gradient(135deg,#4ade80,#22c55e)':'linear-gradient(135deg,#e94560,#c73652)',
                  transform:listening?'scale(1.05)':'scale(1)', transition:'all .2s',
                  boxShadow:listening?'0 4px 28px rgba(74,222,128,0.5)':'0 4px 28px rgba(233,69,96,0.4)',
                  animation:listening?'glow 1s ease infinite':'none',
                }}>
                {listening ? '🎤 …' : '🎤 Speak'}
              </button>

              {/* Story mode: vocab quick-ref */}
              {mode?.type === 'story' && (
                <div style={{ display:'flex', gap:'6px', overflow:'auto' }}>
                  {mode.data.vocab.map((w,i)=>{
                    const done = completedWords.includes(w.korean);
                    return (
                      <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'6px 10px', background:done?'rgba(74,222,128,0.1)':'rgba(255,255,255,0.03)', border:`1px solid ${done?'rgba(74,222,128,0.4)':'rgba(255,255,255,0.07)'}`, borderRadius:'10px', minWidth:'64px', flexShrink:0 }}>
                        <span style={{ fontSize:'10px', fontWeight:'700', color:done?'#4ade80':'#ccc', textAlign:'center' }}>{w.romanization}</span>
                        <span style={{ fontSize:'9px', color:'#444', marginTop:'2px' }}>{w.english}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════ END SCREEN ════════════════════ */}
      {screen === 'end' && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'calc(100vh - 57px)', animation:'fadeUp .4s ease', padding:'24px' }}>
          <div style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${endReason==='victory'?'rgba(248,211,71,0.35)':'rgba(233,69,96,0.25)'}`, borderRadius:'24px', padding:'48px', textAlign:'center', maxWidth:'480px', width:'100%' }}>

            <div style={{ fontSize:'72px', marginBottom:'16px', animation:'bounceIn .5s ease' }}>
              {endReason==='victory'?'🏆':endReason==='timeout'?'⏰':'💀'}
            </div>

            <h2 style={{ fontSize:'32px', fontWeight:'900', marginBottom:'6px', fontFamily:"'Syne',sans-serif",
              color:endReason==='victory'?'#f8d347':endReason==='timeout'?'#fb923c':'#e94560' }}>
              {endReason==='victory'?'MISSION COMPLETE!':endReason==='timeout'?'TIME\'S UP':'MISSION FAILED'}
            </h2>

            <p style={{ fontSize:'14px', color:'#555', marginBottom:'28px' }}>
              {endReason==='victory'
                ? `🎉 Amazing Korean! ${streak > 3 ? `${streak} streak combo!` : '잘했어요!'}`
                : endReason==='timeout' ? '⏰ Ran out of time. Practice pronunciation speed!'
                : '😢 Keep practicing — every attempt builds fluency!'}
            </p>

            {/* Score display */}
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'20px', marginBottom:'20px' }}>
              <div style={{ fontSize:'52px', fontWeight:'900', color:endReason==='victory'?'#f8d347':'#e94560', lineHeight:1, fontFamily:"'Syne',sans-serif" }}>{score}</div>
              <div style={{ fontSize:'11px', color:'#444', textTransform:'uppercase', letterSpacing:'1px', marginTop:'4px' }}>Final Score</div>
              <div style={{ display:'flex', justifyContent:'center', gap:'20px', marginTop:'14px' }}>
                <div>
                  <div style={{ fontSize:'18px', fontWeight:'800', color:'#4ade80', fontFamily:"'Syne',sans-serif" }}>{completedWords.length}</div>
                  <div style={{ fontSize:'10px', color:'#444' }}>Commands</div>
                </div>
                <div style={{ width:'1px', background:'rgba(255,255,255,0.07)' }}/>
                <div>
                  <div style={{ fontSize:'18px', fontWeight:'800', color:'#a78bfa', fontFamily:"'Syne',sans-serif" }}>{Math.max(streak, combo)}</div>
                  <div style={{ fontSize:'10px', color:'#444' }}>Best Combo</div>
                </div>
                <div style={{ width:'1px', background:'rgba(255,255,255,0.07)' }}/>
                <div>
                  <div style={{ fontSize:'18px', fontWeight:'800', color:'#38bdf8', fontFamily:"'Syne',sans-serif" }}>{lives}</div>
                  <div style={{ fontSize:'10px', color:'#444' }}>Lives Left</div>
                </div>
              </div>
            </div>

            <p style={{ fontSize:'11px', color:'#333', marginBottom:'20px' }}>📊 Score saved to leaderboard</p>

            <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={() => { if(mode) startGame(mode); }}
                style={{ padding:'11px 22px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', color:'#ccc', fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:'inherit' }}>
                🔄 Retry
              </button>
              <button onClick={() => navigate('/leaderboard')}
                style={{ padding:'11px 22px', background:'rgba(248,211,71,0.1)', border:'1px solid rgba(248,211,71,0.3)', borderRadius:'10px', color:'#f8d347', fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:'inherit' }}>
                🏆 Leaderboard
              </button>
              <button onClick={() => navigate('/learn')}
                style={{ padding:'11px 22px', background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.3)', borderRadius:'10px', color:'#4ade80', fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:'inherit' }}>
                📖 Learn More
              </button>
              <button onClick={() => setScreen('menu')}
                style={{ padding:'11px 22px', background:'rgba(233,69,96,0.1)', border:'1px solid rgba(233,69,96,0.3)', borderRadius:'10px', color:'#e94560', fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:'inherit' }}>
                🏠 Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
