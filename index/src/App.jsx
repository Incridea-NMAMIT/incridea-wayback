import { useState, useEffect, useRef, useCallback } from 'react';
import editionsData from '../editions.json';

const CREATORS = [
  {
    id: 'akshay',
    name: 'Akshay S Rai',
    quote: 'My Git history is longer than my therapy notes, and both are full of regrets.',
    photo: '/akshy.webp',
    photoPosition: 'center 15%',
    socials: [
      { name: 'GitHub', url: 'https://github.com/akshy-rai', type: 'github' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/akshay-s-rai/', type: 'linkedin' },
      { name: 'Instagram', url: 'https://instagram.com/akshyy_rai/', type: 'instagram' },
    ],
  },
  {
    id: 'shishir',
    name: 'Shishir G Karkera',
    quote: 'I treat production like my pet… feed it, monitor it, pray for it.',
    photo: '/shishir.webp',
    photoPosition: 'center 15%',
    socials: [
      { name: 'GitHub', url: 'https://github.com/shishirkarkeraa', type: 'github' },
      { name: 'LinkedIn', url: 'https://linkedin.com', type: 'linkedin' },
      { name: 'Instagram', url: 'https://www.instagram.com/shishir.karkeraa/', type: 'instagram' },
    ],
  },
];

function SocialIcon({ type }) {
  if (type === 'github') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }
  if (type === 'linkedin') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
      </svg>
    );
  }
  if (type === 'instagram') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    );
  }
  return null;
}

function CreatorsModal({ activeCreator, onSelectCreator, onClose }) {
  if (!activeCreator) return null;

  return (
    <div 
      className="arch-modal-overlay" 
      onClick={onClose}
      role="presentation"
    >
      <div 
        className="arch-modal-window" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="arch-modal-heading"
      >
        {/* Archival Corner Crosshairs */}
        <span className="modal-crosshair ch-tl" aria-hidden="true">+</span>
        <span className="modal-crosshair ch-tr" aria-hidden="true">+</span>
        <span className="modal-crosshair ch-bl" aria-hidden="true">+</span>
        <span className="modal-crosshair ch-br" aria-hidden="true">+</span>

        {/* Modal Header */}
        <div className="arch-modal-topbar">
          <div className="arch-topbar-meta">
            <h2 id="arch-modal-heading" className="arch-modal-title">Wayback Architects</h2>
          </div>
          <div className="arch-topbar-actions">
            <button
              type="button"
              className="arch-close-trigger"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Dual Architect Cards Showcase */}
        <div className="arch-showcase-grid">
          {CREATORS.map((creator) => {
            const isSelected = activeCreator === creator.id;
            return (
              <article 
                key={creator.id} 
                className={`arch-card ${isSelected ? 'arch-card-featured' : ''}`}
                onClick={() => onSelectCreator?.(creator.id)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectCreator?.(creator.id);
                  }
                }}
              >
                {/* Portrait Container */}
                <div className="arch-portrait-box">
                  <img 
                    src={creator.photo} 
                    alt={creator.name} 
                    className="arch-portrait-img"
                    style={{ objectPosition: creator.photoPosition }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="arch-portrait-scrim" aria-hidden="true" />
                </div>

                {/* Identity & Details */}
                <div className="arch-card-info">
                  <div className="arch-name-lockup">
                    <h3 className="arch-name">{creator.name}</h3>
                  </div>

                  {/* Dev Quote */}
                  <p className="arch-quote">
                    &ldquo;{creator.quote}&rdquo;
                  </p>

                  {/* Social Channels Dock */}
                  <div className="arch-social-dock">
                    {creator.socials.map((s) => (
                      <a 
                        key={s.name} 
                        href={s.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`arch-social-btn btn-${s.type}`}
                        title={`${creator.name} on ${s.name}`}
                        aria-label={`${creator.name} on ${s.name}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SocialIcon type={s.type} />
                        <span className="social-btn-label">{s.name}</span>
                        <svg className="social-ext-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DeveloperNotesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="arch-modal-overlay" 
      onClick={onClose}
      role="presentation"
    >
      <div 
        className="arch-modal-window dev-notes-modal-window" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dev-notes-title"
      >
        {/* Archival Corner Crosshairs */}
        <span className="modal-crosshair ch-tl" aria-hidden="true">+</span>
        <span className="modal-crosshair ch-tr" aria-hidden="true">+</span>
        <span className="modal-crosshair ch-bl" aria-hidden="true">+</span>
        <span className="modal-crosshair ch-br" aria-hidden="true">+</span>

        {/* Modal Header */}
        <div className="arch-modal-topbar">
          <div className="arch-topbar-meta">
            <h2 id="dev-notes-title" className="arch-modal-title">Developers&apos; Notes</h2>
          </div>
          <div className="arch-topbar-actions">
            <button
              type="button"
              className="arch-close-trigger"
              onClick={onClose}
              aria-label="Close notes modal"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Notes Content */}
        <div className="dev-notes-body">
          <section className="dev-note-section">
            <div className="dev-note-label">
              <span className="dev-note-prompt">&gt;</span>
              <span>ARCHIVAL INTENT</span>
            </div>
            <p className="dev-note-text">
              Incridea has always been more than just a college festival. It&apos;s a collection of creativity, crazy ideas, beautiful designs, and memories that make NMAMIT special. Every year, a new team brings something different to life, and the fest website becomes a small part of that experience.
            </p>
            <p className="dev-note-text">
              But once a fest is over, its website often gets forgotten. Hosting expires, domains change, and old code slowly stops working. Before we know it, a piece of Incridea&apos;s history is gone.
            </p>
            <p className="dev-note-text">
              That&apos;s where <strong>Wayback</strong> comes in.
            </p>
            <p className="dev-note-text">
              Wayback was built to keep those memories alive. It brings together the websites of past Incridea editions in one place, so anyone can revisit them, explore their designs, and see how the fest has evolved over the years.
            </p>
            <p className="dev-note-text">
              It&apos;s a way of preserving the work, creativity, and memories that went into every edition&mdash;not just for the people who were there, but for everyone who wants to look back at what made Incridea what it is today.
            </p>
          </section>

          <div className="dev-note-footer">
            <span className="dev-note-sign">Built with <span className="heart">♥</span> for the Incridea legacy &middot; Akshay &amp; Shishir</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isNotFound, setIsNotFound] = useState(false);
  const [activeCreator, setActiveCreator] = useState(null);
  const [isDevNotesOpen, setIsDevNotesOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);
  const carouselRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({ isDown: false, startX: 0, scrollLeft: 0, hasMoved: false });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check 404 fallback logic matching domain script rules
  useEffect(() => {
    const publishedYears = editionsData
      .filter((ed) => ed.status === 'published')
      .map((ed) => String(ed.year));
    
    const match = window.location.hostname.match(/^(\d{4})\.wayback\.incridea\.in$/);
    if (match && !publishedYears.includes(match[1])) {
      setIsNotFound(true);
      document.title = "Archive not found | Incridea Wayback";
    }
  }, []);

  // Close modals on Escape key and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveCreator(null);
        setIsDevNotesOpen(false);
      }
    };
    if (activeCreator || isDevNotesOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeCreator, isDevNotesOpen]);

  // Subtle mouse move parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      document.documentElement.style.setProperty('--parallax-x', `${x * 12}px`);
      document.documentElement.style.setProperty('--parallax-y', `${y * 12}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cosmic Stardust Field Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = Math.min(50, Math.floor(window.innerWidth / 24));
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.6,
      alpha: Math.random() * 0.5 + 0.2,
      speedAlpha: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25 - 0.08,
      color: Math.random() > 0.35 ? '236, 203, 138' : '205, 230, 255',
    }));

    let mouse = { x: -1000, y: -1000 };
    const handleCanvasPointer = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleCanvasPointer, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Subtle gentle cursor repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const force = (130 - dist) / 130;
          p.x -= (dx / dist) * force * 0.5;
          p.y -= (dy / dist) * force * 0.5;
        }

        // Breathing alpha pulse
        p.alpha += p.speedAlpha;
        if (p.alpha > 0.75 || p.alpha < 0.15) {
          p.speedAlpha *= -1;
        }

        // Loop boundaries smoothly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowColor = `rgba(${p.color}, 0.5)`;
        ctx.shadowBlur = p.radius * 3;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleCanvasPointer);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Ambient sound control
  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.volume = 0.4;
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.warn('Audio play restricted or unavailable:', err);
      });
    }
  }, [isPlayingAudio]);

  // Carousel boundary check
  const checkScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 4) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
    } else {
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < maxScroll - 6);
    }
  }, []);

  const getScrollStep = () => {
    if (carouselRef.current) {
      const firstCard = carouselRef.current.querySelector('.edition-card');
      if (firstCard) {
        return firstCard.offsetWidth + 18;
      }
    }
    return 270;
  };

  const scrollBy = (offset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX) && e.deltaY !== 0) {
        if (el.scrollWidth > el.clientWidth + 4) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    checkScroll();

    const timer = setTimeout(checkScroll, 150);

    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
    };
  }, [checkScroll]);

  // Drag-to-scroll handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const el = carouselRef.current;
    if (!el) return;

    dragInfo.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      hasMoved: false,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!dragInfo.current.isDown) return;
      const el = carouselRef.current;
      if (!el) return;

      const x = e.pageX - el.offsetLeft;
      const walk = (x - dragInfo.current.startX) * 1.5;
      if (Math.abs(walk) > 6) {
        dragInfo.current.hasMoved = true;
      }
      el.scrollLeft = dragInfo.current.scrollLeft - walk;
    };

    const handleGlobalMouseUp = () => {
      if (dragInfo.current.isDown) {
        dragInfo.current.isDown = false;
        setIsDragging(false);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  const handleClickCapture = (e) => {
    // Only prevent opening link if user actually dragged more than 6px
    if (dragInfo.current.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      dragInfo.current.hasMoved = false;
    }
  };

  const handleCarouselKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollBy(getScrollStep());
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollBy(-getScrollStep());
    }
  };

  // Holographic 3D Card Tilt + Spotlight
  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    e.currentTarget.style.setProperty('--card-rot-x', `${rotateX.toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--card-rot-y', `${rotateY.toFixed(2)}deg`);
  };

  const handleCardMouseLeave = (e) => {
    e.currentTarget.style.setProperty('--card-rot-x', '0deg');
    e.currentTarget.style.setProperty('--card-rot-y', '0deg');
  };

  if (isNotFound) {
    return (
      <main className="shell terminal-shell" id="app">
        <header className="topline">
          <div className="brand-lockup">
            <img src="/incridea.png" alt="Incridea Logo" className="brand-logo" />
            <span className="brand-badge">Wayback</span>
          </div>
          <span>Archival Notice</span>
        </header>

        <div className="portal-content">
          <section className="hero">
            <p className="eyebrow">No public record</p>
            <h1>That archive is <em>not here.</em></h1>
            <p className="hero-copy">No published fest edition matches this address. You may return to the directory to browse all preserved fest years.</p>
            <div className="hero-action">
              <a href="https://wayback.incridea.in" className="return-btn">
                &larr; Return to archive directory
              </a>
            </div>
          </section>
        </div>

        <footer className="footnote">
          <div className="footnote-left">
            <img src="/nmamit.png" alt="NMAMIT Emblem" className="footer-crest" />
            <p>
              <span className="footer-inst-name">NMAM Institute of Technology &middot; </span>
              <span>Nitte, Karkala</span>
            </p>
          </div>
          <div className="footnote-right">
            <p className="footnote-credit">
              Made with <span className="heart" aria-label="love">♥</span> by{' '}
              <button
                type="button"
                className="creator-link-btn"
                onClick={() => setActiveCreator('akshay')}
              >
                Akshay S Rai
              </button>{' '}
              and{' '}
              <button
                type="button"
                className="creator-link-btn"
                onClick={() => setActiveCreator('shishir')}
              >
                Shishir G Karkera
              </button>
            </p>
          </div>
        </footer>

        <CreatorsModal 
          activeCreator={activeCreator} 
          onSelectCreator={setActiveCreator} 
          onClose={() => setActiveCreator(null)} 
        />
      </main>
    );
  }

  return (
    <main className="shell terminal-shell" id="app">
      {/* Background anthem audio */}
      <audio ref={audioRef} src="/incridea-anthem.mp3" loop preload="none" />

      {/* Interactive Cosmic Stardust Particles */}
      <canvas ref={canvasRef} className="cosmic-canvas" aria-hidden="true" />

      {/* Portal Ring */}
      <div className="portal-ring" aria-hidden="true"></div>

      {/* Top Header */}
      <header className="topline">
        <div className="brand-lockup">
          <img src="/incridea.png" alt="Incridea Logo" className="brand-logo" />
          <span className="brand-badge">Wayback</span>
        </div>

        <div className="topline-right">
          {/* Anthem Audio Toggle */}
          <button 
            type="button" 
            className={`anthem-btn ${isPlayingAudio ? 'is-playing' : ''}`}
            onClick={toggleAudio}
            aria-label={isPlayingAudio ? "Pause fest anthem" : "Play fest anthem"}
            title={isPlayingAudio ? "Pause anthem" : "Play anthem"}
          >
            {isPlayingAudio ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="5" y="4" width="4.5" height="16" rx="1.5" />
                <rect x="14.5" y="4" width="4.5" height="16" rx="1.5" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            )}
            <span className="anthem-btn-text">{isPlayingAudio ? 'Anthem playing' : 'Play anthem'}</span>
          </button>

          {/* NMAMIT png */}
          <div className="crest-badge" title="NMAM Institute of Technology, Nitte">
            <img src="/nmamit.png" alt="NMAMIT Emblem" className="header-crest" />
          </div>
        </div>
      </header>

      {/* Central Portal Container*/}
      <div className="portal-content">
        {/* Hero Section */}
        <section className="hero">
          <p className="eyebrow">The archive is open</p>
          <h1>A time portal to Incridea’s <em className="shimmer-text">unforgettable chapters.</em></h1>
          <p className="hero-copy">Step into preserved, read-only editions of Incridea, each one a record of the people, events and ideas that moved through it.</p>
        </section>

        {/* Archive Carousel Section */}
        <section className="archive" aria-labelledby="edition-heading">
          <div className="archive-heading">
            <div className="archive-title-group">
              <h2 id="edition-heading">Select an edition</h2>
              <p>Swipe or scroll through the preserved fest years.</p>
            </div>

            {(canScrollLeft || canScrollRight) && (
              <div className="carousel-nav" aria-label="Archive navigation">
                <button 
                  type="button" 
                  className="carousel-nav-btn" 
                  onClick={() => scrollBy(-getScrollStep())}
                  disabled={!canScrollLeft}
                  aria-label="Previous edition"
                  title="Previous edition"
                >
                  &larr;
                </button>
                <button 
                  type="button" 
                  className="carousel-nav-btn" 
                  onClick={() => scrollBy(getScrollStep())}
                  disabled={!canScrollRight}
                  aria-label="Next edition"
                  title="Next edition"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Carousel Container */}
          <div 
            className={`carousel ${isDragging ? 'is-dragging' : ''}`}
            ref={carouselRef}
            tabIndex={0}
            role="region"
            aria-label="Preserved editions carousel"
            onScroll={checkScroll}
            onKeyDown={handleCarouselKeyDown}
            onMouseDown={handleMouseDown}
            onClickCapture={handleClickCapture}
            onDragStart={(e) => e.preventDefault()}
          >
            {editionsData.map((edition) => (
              <a 
                key={edition.year} 
                className="edition-card" 
                href={edition.url} 
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundImage: `url(${edition.image})` }}
                aria-label={`Open Incridea ${edition.year} (${edition.theme || edition.name}) archive in a new tab`}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                {/* Image Scrim Gradient Overlay */}
                <div className="card-scrim" aria-hidden="true"></div>

                {/* Card Top Pill Badge */}
                <div className="card-top">
                  <span className="card-year-badge">{edition.year}</span>
                </div>

                <div className="card-bottom">
                  <span className="card-dash-label">{edition.year}</span>
                  <h2 className="card-theme-title">{edition.theme || edition.name}</h2>
                  <div className="card-footer">
                    <span>Enter archive</span>
                    <span className="card-arrow" aria-hidden="true">↗</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footnote">
        <div className="footnote-left">
          <img src="/nmamit.png" alt="NMAMIT Emblem" className="footer-crest" />
          <p>
            <span className="footer-inst-name">NMAM Institute of Technology &middot; </span>
            <span>Nitte, Karkala</span>
          </p>
        </div>
        <div className="footnote-right">
          <p className="footnote-credit">
            Made with <span className="heart" aria-label="love">♥</span> by{' '}
            <button
              type="button"
              className="creator-link-btn"
              onClick={() => setActiveCreator('akshay')}
            >
              Akshay S Rai
            </button>{' '}
            &amp;{' '}
            <button
              type="button"
              className="creator-link-btn"
              onClick={() => setActiveCreator('shishir')}
            >
              Shishir G Karkera
            </button>
            <span className="footnote-divider" aria-hidden="true">&middot;</span>
            <button
              type="button"
              className="dev-notes-link-btn"
              onClick={() => setIsDevNotesOpen(true)}
            >
              Developers&apos; Notes
            </button>
          </p>
        </div>
      </footer>

      <CreatorsModal 
        activeCreator={activeCreator} 
        onSelectCreator={setActiveCreator} 
        onClose={() => setActiveCreator(null)} 
      />

      <DeveloperNotesModal
        isOpen={isDevNotesOpen}
        onClose={() => setIsDevNotesOpen(false)}
      />
    </main>
  );
}

export default App;
