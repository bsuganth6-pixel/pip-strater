import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { startMusic, stopMusic } from './music.js';
import './music.css';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Cloud,
  FolderOpen,
  Heart,
  HeartHandshake,
  Home,
  Lamp,
  MapPin,
  MessageCircle,
  Moon,
  Music2,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

const ASSETS = {
  pip: '/assets/pip.jpg',
  lullaby: 'https://hax.baby/baby/assets/pip_lullaby_box.png',
  lantern: 'https://hax.baby/baby/assets/pip_dream_lantern.png',
};

const PROJECTS = [
  {
    id: 'lullaby',
    number: '01',
    category: 'SOUND FILE',
    title: 'The Lullaby Lab',
    description: 'A tiny music box that turns a busy brain into a sleepy cloud. Press play for a five-note bedtime tune.',
    image: ASSETS.lullaby,
    emoji: '🎵',
    color: 'pink',
    icon: Music2,
  },
  {
    id: 'nightlight',
    number: '02',
    category: 'LIGHT FILE',
    title: 'Nightlight Collection',
    description: 'Pocket-sized lanterns that make dark corners feel friendly and help little creatures find their dreams.',
    image: ASSETS.lantern,
    emoji: '🏮',
    color: 'gold',
    icon: Lamp,
  },
  {
    id: 'routes',
    number: '03',
    category: 'MAP FILE',
    title: 'Dream Delivery Routes',
    description: 'A star-dotted rooftop map for delivering brave dreams, ocean dreams, and one extra-soft goodnight.',
    image: null,
    emoji: '🗺️',
    color: 'blue',
    icon: MapPin,
  },
];

const SCENES = [
  {
    time: '00:03 · FIRST FLICKER',
    title: 'A little star needed a home.',
    text: 'Pip arrived in the Midnight Nursery as a warm speck of moonlight. Before the nightcap was tied, a jam jar, a tiny yawn, and three patient stars had already become Pip’s very first lantern.',
    emoji: '🌟',
  },
  {
    time: '00:17 · FIRST LULLABY',
    title: 'Everybody had a worry to tuck in.',
    text: 'Shy clouds, tiny ghosts, and one moon-walking hedgehog came to Pip when sleep felt far away. Pip listened first, then turned each worry into a gentle tune or a pocket-sized dream.',
    emoji: '🎶',
  },
  {
    time: '00:42 · DREAM DELIVERY',
    title: 'The rooftops began to glow.',
    text: 'Now Pip sends dreams through open windows and leaves a soft light on the way home. The job is small, the sky is enormous, and there is always room for one more dream.',
    emoji: '🌙',
  },
];

const LAUNCHERS = [
  { id: 'home', label: 'Nursery desktop', Icon: Home },
  { id: 'projects', label: 'Pip’s inventions', Icon: FolderOpen },
  { id: 'story', label: 'Origin story', Icon: BookOpen },
  { id: 'chat', label: 'Ask Pip', Icon: MessageCircle },
  { id: 'guestbook', label: 'Dream guestbook', Icon: HeartHandshake },
];

const WINDOW_TITLES = {
  about: 'PIP_PROFILE.EXE — character sheet',
  projects: 'MY LITTLE CREATIONS — 3 files',
  lullaby: 'LULLABY_LAB.WAV — music box',
  nightlight: 'NIGHTLIGHTS.BMP — glow settings',
  routes: 'DREAM_ROUTES.MAP — delivery desk',
  story: 'BEDTIME_STORY.BOOK — origin log',
  chat: 'PIP_CHAT.EXE — tiny comfort desk',
  guestbook: 'GUESTBOOK.TXT — leave a little love',
};

export default function App() {
  const [nightMode, setNightMode] = useState(false);
  const [muted, setMuted] = useState(true);
  const [activeWindow, setActiveWindow] = useState(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [secretFound, setSecretFound] = useState(false);
  const [toast, setToast] = useState('Welcome to PipOS 98 ✦ Tap ♫ for Pip’s lullaby');
  const [visitCount, setVisitCount] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestNote, setGuestNote] = useState('');
  const [guestbook, setGuestbook] = useState([]);
  const [chatAnswer, setChatAnswer] = useState('Pick a tiny worry and Pip will offer a tiny comfort.');
  const [delivered, setDelivered] = useState(false);
  const [played, setPlayed] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);
  const ribbonClicks = useRef(0);
  const toastTimer = useRef(null);
  const sparkleCounter = useRef(0);
  const [sparkles, setSparkles] = useState([]);

  function showToast(message) {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2800);
  }

  function toggleMusic() {
    if (musicOn) {
      stopMusic();
      setMusicOn(false);
      showToast('Music box paused. Quiet is lovely too.');
      return;
    }
    if (!startMusic()) {
      showToast('This browser can’t play the music box, but every button still works.');
      return;
    }
    setMuted(false);
    setMusicOn(true);
    showToast('♫ Pip’s midnight music box is playing.');
  }

  function toggleSound() {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (nextMuted && musicOn) {
      stopMusic();
      setMusicOn(false);
    }
    showToast(nextMuted ? 'Sound muted. Quiet is lovely too.' : 'Sound enabled. Try a project button! ♫');
  }

  function playTone(frequency = 659.25) {
    if (muted || typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      if (!audioRef.current || audioRef.current.state === 'closed') {
        audioRef.current = new AudioContextClass();
      }
      const context = audioRef.current;
      const start = () => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.28, context.currentTime + 0.11);
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.09, context.currentTime + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.23);
        oscillator.onended = () => {
          oscillator.disconnect();
          gain.disconnect();
        };
      };
      if (context.state === 'suspended') context.resume().then(start).catch(() => {});
      else start();
    } catch {
      // Audio is optional; all controls continue working if unavailable.
    }
  }

  useEffect(() => {
    try {
      const key = 'pipos98-visit-count';
      const current = Number(window.localStorage.getItem(key) || 0);
      const next = Number.isFinite(current) ? current + 1 : 1;
      window.localStorage.setItem(key, String(next));
      setVisitCount(next);
      const savedNotes = JSON.parse(window.localStorage.getItem('pipos98-guestbook') || '[]');
      setGuestbook(Array.isArray(savedNotes) ? savedNotes.slice(0, 6) : []);
    } catch {
      setVisitCount(1);
      setGuestbook([]);
    }
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      stopMusic();
      if (audioRef.current && audioRef.current.state !== 'closed') audioRef.current.close().catch(() => {});
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return undefined;
    let last = 0;
    const move = (event) => {
      const now = performance.now();
      if (now - last < 95) return;
      last = now;
      const point = { id: ++sparkleCounter.current, x: event.clientX, y: event.clientY, glyph: Math.random() > 0.5 ? '✦' : '✧' };
      setSparkles((items) => [...items.slice(-6), point]);
      window.setTimeout(() => setSparkles((items) => items.filter((item) => item.id !== point.id)), 600);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useEffect(() => {
    const keydown = (event) => {
      if (event.key === 'Escape') setActiveWindow(null);
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, []);

  function openWindow(id) {
    if (id === 'home') {
      setActiveWindow(null);
      showToast('You’re already home, little dreamer.');
      return;
    }
    setActiveWindow(id);
    playTone(523.25);
  }

  function toggleNight() {
    setNightMode((value) => !value);
    playTone(659.25);
    showToast(nightMode ? '☀️ Morning light is back!' : '🌙 Dream shift activated. Soft lights only.');
  }

  function handleRibbon() {
    ribbonClicks.current += 1;
    playTone(880);
    if (ribbonClicks.current >= 5 && !secretFound) {
      setSecretFound(true);
      showToast('Secret unlocked: you’re somebody’s favourite constellation. ✦');
      confetti({
        particleCount: 95,
        spread: 75,
        startVelocity: 26,
        origin: { y: 0.42 },
        colors: ['#a34063', '#f4c7d4', '#ffdc85', '#d9c8f0', '#fff8f1'],
        disableForReducedMotion: true,
      });
    } else if (!secretFound) {
      showToast(`A little ribbon sparkle… ${5 - ribbonClicks.current} more to discover the secret.`);
    }
  }

  function saveGuestbook(event) {
    event.preventDefault();
    const name = guestName.trim().slice(0, 28);
    const note = guestNote.trim().slice(0, 150);
    if (!name || !note) {
      showToast('Leave Pip both a name and a little note. ♡');
      return;
    }
    const next = [{ name, note, id: Date.now() }, ...guestbook].slice(0, 6);
    setGuestbook(next);
    setGuestName('');
    setGuestNote('');
    try {
      window.localStorage.setItem('pipos98-guestbook', JSON.stringify(next));
    } catch {
      // Keep it visible for this session even if storage is unavailable.
    }
    playTone(783.99);
    showToast('Your note has been tucked into this browser’s guestbook. ♡');
  }

  function renderProjectCards() {
    return (
      <div className="window-project-grid">
        {PROJECTS.map((project) => {
          const Icon = project.icon;
          return (
            <article className={`file-card ${project.color}`} key={project.id}>
              <div className="file-card-visual">
                <span className="file-number">{project.number}</span>
                <span className="file-emoji" aria-hidden="true">{project.emoji}</span>
                {project.image && <img src={project.image} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
              </div>
              <div className="file-card-copy">
                <span className="file-category">{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <button className="mini-action" type="button" onClick={() => openWindow(project.id)}><Icon size={15} /> Open file <span>↗</span></button>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  function renderWindowContent() {
    if (activeWindow === 'about') {
      return (
        <div className="about-sheet">
          <img className="about-avatar" src={ASSETS.pip} alt="Pip sitting on a cloud with a glowing lantern and music box" />
          <div className="about-copy">
            <div className="system-badge">CHARACTER FILE · TRACK 01</div>
            <h3>Pip the Skull Baby</h3>
            <p>A sleepy, gentle baby with a smooth round skull face, soft eye sockets with warm amber pinpricks, a tiny crooked smile, and a starry nightcap tied with a pink bow.</p>
            <dl className="profile-list">
              <div><dt>Species</dt><dd>Skull baby</dd></div>
              <div><dt>Occupation</dt><dd>Junior Dream Engineer</dd></div>
              <div><dt>Workplace</dt><dd>Midnight Nursery</dd></div>
              <div><dt>Personality</dt><dd>Gentle, curious, quietly brave</dd></div>
              <div><dt>Favorite tools</dt><dd>Lullaby box, lantern, dream map</dd></div>
            </dl>
          </div>
        </div>
      );
    }

    if (activeWindow === 'projects') return renderProjectCards();

    if (['lullaby', 'nightlight', 'routes'].includes(activeWindow)) {
      const project = PROJECTS.find((item) => item.id === activeWindow);
      if (!project) return null;
      const Icon = project.icon;
      return (
        <div className={`project-detail ${project.color}`}>
          <div className="detail-art">
            <span className="detail-big-emoji" aria-hidden="true">{project.emoji}</span>
            {project.image && <img src={project.image} alt={project.title} onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
          </div>
          <div className="detail-copy">
            <span className="file-category">FILE {project.number} · {project.category}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {activeWindow === 'lullaby' && <button className="retro-button primary" type="button" onClick={() => { setPlayed(true); [523.25, 659.25, 783.99, 659.25, 523.25].forEach((frequency, index) => window.setTimeout(() => playTone(frequency), index * 190)); showToast(muted ? 'Turn sound on in the top bar to hear Pip’s lullaby.' : '♫ Five little notes, just for you.'); }}><Music2 size={16} /> {played ? 'Play the lullaby again' : 'Play the tiny lullaby'}</button>}
            {activeWindow === 'nightlight' && <button className="retro-button primary" type="button" onClick={toggleNight}>{nightMode ? <Sun size={16} /> : <Moon size={16} />} {nightMode ? 'Switch to morning' : 'Turn on dream mode'}</button>}
            {activeWindow === 'routes' && <button className="retro-button primary" type="button" onClick={() => { setDelivered(true); playTone(783.99); showToast('Dream delivered to Cloudberry Lane. Sweet dreams! ✦'); }}><MapPin size={16} /> {delivered ? 'Deliver another dream' : 'Deliver a dream'}</button>}
            {activeWindow === 'routes' && <div className="route-line"><span>Midnight Nursery</span><i /><span>Cloudberry Lane</span><i /><span>Moonlit Ridge</span></div>}
            {activeWindow === 'lullaby' && <button className="retro-button" type="button" onClick={toggleMusic}><Music2 size={16} /> {musicOn ? 'Pause the music box' : 'Play the music box (loops)'}</button>}
            {activeWindow === 'lullaby' && <p className="tiny-note">Audio is opt-in. The speaker switch in the top bar mutes everything, including the music box.</p>}
          </div>
        </div>
      );
    }

    if (activeWindow === 'story') {
      const scene = SCENES[sceneIndex];
      return (
        <div className="story-viewer">
          <div className="story-art"><img src={ASSETS.pip} alt="Pip at the Midnight Nursery" /><span>{scene.emoji}</span></div>
          <div className="story-copy">
            <span className="system-badge">SCENE {String(sceneIndex + 1).padStart(2, '0')} / 03</span>
            <p className="scene-time">{scene.time}</p>
            <h3>{scene.title}</h3>
            <p>{scene.text}</p>
            <div className="story-controls">
              <button type="button" className="retro-button" disabled={sceneIndex === 0} onClick={() => setSceneIndex((index) => Math.max(0, index - 1))}><ChevronLeft size={16} /> Previous</button>
              <div className="story-dots" aria-label={`Scene ${sceneIndex + 1} of ${SCENES.length}`}>{SCENES.map((item, index) => <button key={item.time} type="button" className={index === sceneIndex ? 'active' : ''} aria-label={`Show scene ${index + 1}`} onClick={() => setSceneIndex(index)} />)}</div>
              <button type="button" className="retro-button primary" disabled={sceneIndex === SCENES.length - 1} onClick={() => setSceneIndex((index) => Math.min(SCENES.length - 1, index + 1))}>Next <ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      );
    }

    if (activeWindow === 'chat') {
      return (
        <div className="chat-panel">
          <div className="chat-avatar">🌙</div>
          <div className="chat-bubble"><strong>Pip says…</strong><p>{chatAnswer}</p></div>
          <p className="tiny-note">A tiny collection of prewritten comfort notes — no chatbot service or personal data connection.</p>
          <div className="chat-choices">
            <button type="button" className="retro-button" onClick={() => { setChatAnswer('Take one tiny breath. You do not have to solve the whole night at once. One soft step counts. ♡'); playTone(587.33); }}>I feel overwhelmed</button>
            <button type="button" className="retro-button" onClick={() => { setChatAnswer('Make the room gentle: lower one light, put one worry on paper, and let tomorrow carry the rest. ✦'); playTone(659.25); }}>Give me a bedtime tip</button>
            <button type="button" className="retro-button" onClick={() => { setChatAnswer('Tiny reminder: you have made it through every difficult day so far. Rest is allowed, little dreamer.'); playTone(783.99); }}>I need encouragement</button>
          </div>
        </div>
      );
    }

    if (activeWindow === 'guestbook') {
      return (
        <div className="guestbook-layout">
          <div>
            <p className="modal-intro">Leave a tiny note on Pip’s nursery wall. Notes are saved only in this browser on this device.</p>
            <form className="guest-form" onSubmit={saveGuestbook}>
              <label>Your name<input value={guestName} onChange={(event) => setGuestName(event.target.value)} maxLength={28} placeholder="Cloud friend" required /></label>
              <label>A little note<textarea value={guestNote} onChange={(event) => setGuestNote(event.target.value)} maxLength={150} rows={3} placeholder="Wishing you sweet dreams…" required /></label>
              <button className="retro-button primary" type="submit"><Heart size={15} /> Pin my note</button>
            </form>
          </div>
          <div className="guest-notes">
            <span className="file-category">LATEST NOTES · LOCAL ONLY</span>
            {guestbook.length === 0 ? <p className="empty-notes">The wall is quiet so far. You can be the first visitor to leave a note. ♡</p> : guestbook.map((item) => <article className="guest-note" key={item.id}><strong>{item.name}</strong><p>{item.note}</p></article>)}
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <main className={`pipos-desktop ${nightMode ? 'night-mode' : ''}`}>
      <div className="wallpaper-glow wallpaper-glow-a" />
      <div className="wallpaper-glow wallpaper-glow-b" />
      {sparkles.map((sparkle) => <span key={sparkle.id} className="sparkle-trail" aria-hidden="true" style={{ left: sparkle.x, top: sparkle.y }}>{sparkle.glyph}</span>)}

      <header className="system-topbar">
        <div className="system-brand"><span className="system-brand-icon"><Sparkles size={19} /></span><span className="system-brand-name">PipOS</span><span className="system-version">98.10 · nursery edition</span></div>
        <div className="system-status"><span className="online-light" /> DREAM NETWORK ONLINE <span className="status-divider">/</span> GOOD THINGS START SMALL</div>
        <div className="system-controls">
          <button className={`system-control ${musicOn ? 'is-playing' : ''}`} type="button" onClick={toggleMusic} title={musicOn ? 'Pause the music box' : 'Play the music box'} aria-label={musicOn ? 'Pause lullaby music' : 'Play lullaby music'} aria-pressed={musicOn}><Music2 size={17} /></button>
          <button className={`system-control ${muted ? 'is-muted' : ''}`} type="button" onClick={toggleSound} title={muted ? 'Enable sound' : 'Mute sound'} aria-label={muted ? 'Enable sound' : 'Mute sound'}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
          <button className="system-control" type="button" onClick={toggleNight} title={nightMode ? 'Switch to day mode' : 'Switch to dream mode'} aria-label={nightMode ? 'Switch to day mode' : 'Switch to dream mode'}>{nightMode ? <Sun size={17} /> : <Moon size={17} />}</button>
        </div>
      </header>

      <div className="desktop-layout">
        <aside className="launcher" aria-label="PipOS quick launch">
          <div className="launcher-caption">QUICK<br />LAUNCH</div>
          {LAUNCHERS.map(({ id, label, Icon }) => <button key={id} type="button" className={`launcher-button ${activeWindow === id ? 'selected' : ''}`} onClick={() => openWindow(id)} title={label} aria-label={label}><Icon size={20} /><span>{label}</span></button>)}
          <div className="launcher-spacer" />
          <button type="button" className="launcher-ribbon" onClick={handleRibbon} title="A tiny secret is hiding here" aria-label="Tap Pip's ribbon charm">🎀</button>
        </aside>

        <div className="desktop-workspace">
          <section className="retro-window hero-window" aria-labelledby="hero-heading">
            <div className="window-titlebar">
              <div className="window-title"><span className="tiny-app-icon">✦</span><span>PIP.EXE — DREAM ENGINEER PROFILE</span></div>
              <div className="window-buttons" aria-hidden="true"><span>_</span><span>□</span><span>×</span></div>
            </div>
            <div className="hero-grid">
              <div className="hero-copy">
                <div className="profile-status"><span className="online-light" /> USER PROFILE FOUND · TRACK 01</div>
                <h1 id="hero-heading">Good things<br />start <em>small.</em></h1>
                <p className="hero-tagline">“I build the dreams you fall asleep inside.”</p>
                <p className="hero-description">Meet Pip: a gentle skull baby and Junior Dream Engineer at the Midnight Nursery. Pip makes tiny lullabies, friendly nightlights, and bedtime adventures for creatures across the sleepy sky.</p>
                <div className="spec-chips"><span>SPECIES <b>SKULL BABY</b></span><span>MOOD <b>SOFT & SLEEPY</b></span></div>
                <div className="hero-actions">
                  <button className="retro-button primary" type="button" onClick={() => openWindow('projects')}><FolderOpen size={16} /> Open my portfolio</button>
                  <button className="retro-button" type="button" onClick={() => openWindow('story')}><BookOpen size={16} /> Origin story</button>
                  <button className="retro-button" type="button" onClick={toggleMusic} aria-pressed={musicOn}><Music2 size={16} /> {musicOn ? 'Pause lullaby' : 'Play lullaby'}</button>
                </div>
                <div className="hero-footnote"><Heart size={14} fill="currentColor" /> curious by nature · gentle by design</div>
              </div>
              <div className="hero-stage">
                <div className="stage-orbit orbit-one" /><div className="stage-orbit orbit-two" />
                <span className="stage-star stage-star-a">✦</span><span className="stage-star stage-star-b">✧</span><span className="stage-star stage-star-c">✶</span>
                <div className="hero-image-frame"><img className="pip-hero-image" src={ASSETS.pip} alt="Pip sitting on a fluffy cloud wearing a starry nightcap, holding a glowing lantern and a tiny music box" /><button className="ribbon-hotspot" type="button" onClick={handleRibbon} aria-label="Tap Pip's ribbon five times for a secret" title="A secret is hiding in this ribbon">🎀</button></div>
                <span className="floating-tag tag-top">✦ DREAM MAKER</span><span className="floating-tag tag-bottom">STATUS: A LITTLE SLEEPY</span>
              </div>
            </div>
            <div className="window-statusbar"><span><span className="status-square" /> Ready to dream</span><span>3 CREATIVE FILES <b>✦</b></span><span>VISITS THIS BROWSER: {String(visitCount).padStart(4, '0')}</span></div>
          </section>

          <section className="desktop-shortcuts" aria-label="Portfolio shortcuts">
            <button className="shortcut" type="button" onClick={() => openWindow('projects')}><span className="shortcut-icon shortcut-pink"><FolderOpen size={24} /></span><span>My Creations</span><small>3 files</small></button>
            <button className="shortcut" type="button" onClick={() => openWindow('story')}><span className="shortcut-icon shortcut-gold"><BookOpen size={24} /></span><span>Bedtime Story</span><small>3 scenes</small></button>
            <button className="shortcut" type="button" onClick={() => openWindow('guestbook')}><span className="shortcut-icon shortcut-blue"><HeartHandshake size={24} /></span><span>Dream Guestbook</span><small>leave a note</small></button>
            <button className="shortcut" type="button" onClick={() => openWindow('about')}><span className="shortcut-icon shortcut-lilac"><Cloud size={24} /></span><span>About Pip</span><small>character file</small></button>
          </section>

          <section className="projects-window retro-window">
            <div className="window-titlebar compact-titlebar"><div className="window-title"><span className="tiny-app-icon">▦</span><span>MY_LITTLE_CREATIONS — PREVIEW</span></div><button className="title-open" type="button" onClick={() => openWindow('projects')}>OPEN ALL ↗</button></div>
            <div className="project-strip">
              {PROJECTS.map((project) => <button type="button" key={project.id} className={`project-chip ${project.color}`} onClick={() => openWindow(project.id)}><span className="chip-emoji">{project.emoji}</span><span className="chip-text"><b>{project.title}</b><small>{project.category}</small></span><span className="chip-arrow">↗</span></button>)}
            </div>
          </section>

          <section className="system-quote"><span>✦</span><p>“A small light can make a very big night feel gentle.”</p><span>✦</span></section>
          <p className="credits-line">Credits: Pip character art and the Lullaby Box and Lantern images are from the haX.baby Track 1 asset pack. Music: an original lullaby synthesised live with the Web Audio API (no audio files). Fonts: Fredoka, DM Serif Display, IBM Plex Mono. Open source: React, Vite, Lucide, canvas-confetti.</p>
        </div>
      </div>

      <footer className="taskbar">
        <button className="start-button" type="button" onClick={() => openWindow('about')}><span>✦</span> Pip Start</button>
        <div className="taskbar-divider" />
        <button className={`taskbar-app ${activeWindow === 'projects' ? 'active' : ''}`} type="button" onClick={() => openWindow('projects')}><FolderOpen size={16} /><span>My Creations</span></button>
        <button className={`taskbar-app ${activeWindow === 'story' ? 'active' : ''}`} type="button" onClick={() => openWindow('story')}><BookOpen size={16} /><span>Bedtime Story</span></button>
        <div className="taskbar-spacer" />
        {musicOn && <span className="taskbar-now" role="status"><i /><i /><i /><b>MUSIC BOX</b></span>}
        <span className="taskbar-weather">☾ <b>{nightMode ? 'DREAM SHIFT' : 'NURSERY DAY'}</b></span>
        <span className="taskbar-clock">00:42</span>
      </footer>

      {toast && <div className="toast-message" role="status"><Sparkles size={16} /> {toast}</div>}

      {activeWindow && (
        <div className="modal-backdrop" onMouseDown={() => setActiveWindow(null)}>
          <section className="retro-window dialog-window" role="dialog" aria-modal="true" aria-label={WINDOW_TITLES[activeWindow] || 'PipOS window'} onMouseDown={(event) => event.stopPropagation()}>
            <div className="window-titlebar dialog-titlebar"><div className="window-title"><span className="tiny-app-icon">✦</span><span>{WINDOW_TITLES[activeWindow] || 'PIP.EXE'}</span></div><button className="close-window" type="button" onClick={() => setActiveWindow(null)} aria-label="Close window"><X size={17} /></button></div>
            <div className="dialog-content">{renderWindowContent()}</div>
            <div className="window-statusbar dialog-statusbar"><span><span className="status-square" /> PIPOS READY</span><span>ESC TO CLOSE</span></div>
          </section>
        </div>
      )}
      {secretFound && <span className="secret-flag" aria-live="polite">SECRET FOUND ✦</span>}
    </main>
  );
}
