import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import {
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, type Variants, AnimatePresence } from "framer-motion";

interface ProniteCardProps {
  artistName: string;
  artistDate: string;
  artistImage: string;
  accentColor?: string;
  songUrl: string;
  onNext: () => void;
  onPrev: () => void;
  // ADD THESE:
  isMuted: boolean;
  onMuteToggle: () => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

const HEART_RED = "#FF4B4B";

/* ─── Inline <style> for responsive rules (injected once) ─── */
const RESPONSIVE_CSS = `
  /* ── Desktop (default) ── */
  .pronite-card-container {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    z-index: 9999;
    pointer-events: none;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
  }

  .pronite-card-shell {
    width: 380px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 16px 48px rgba(0,0,0,0.35);
    overflow: hidden;
    position: relative;
  }

  /* Desktop: info row */
  .pronite-card-info {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px 12px 16px;
  }

  /* Desktop: album art */
  .pronite-card-art {
    width: 100px;
    height: 100px;
    border-radius: 16px;
    object-fit: cover;
    flex-shrink: 0;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }

  /* Desktop: progress bar wrapper */
  .pronite-card-progress {
    padding: 0 20px;
  }

  /* Desktop: controls row */
  .pronite-card-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px 16px;
  }

  /* Desktop: centre transport */
  .pronite-card-transport {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  /* Play/Pause button */
  .pronite-card-play-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0c0c0e;
    box-shadow: 0 4px 16px rgba(255,255,255,0.15);
    transition: transform 0.15s, box-shadow 0.15s;
    flex-shrink: 0;
  }
  .pronite-card-play-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 24px rgba(255,255,255,0.25);
  }

  /* Artist name */
  .pronite-card-name {
    color: #fff;
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.15;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: 'mocoSans', sans-serif;
    letter-spacing: -0.01em;
  }

  /* Artist date */
  .pronite-card-date {
    color: rgba(255,255,255,0.45);
    font-size: 0.7rem;
    font-weight: 300;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    margin: 6px 0 0;
    font-family: 'Outfit', sans-serif;
  }

  /* Mobile: top row with name + heart */
  .pronite-card-mobile-top {
    display: none;
  }

  /* ── Mobile (≤1024px) ── */
  @media (max-width: 1024px) {
    .pronite-card-container {
      bottom: 1.5rem;
      left: 1rem;
      right: 1rem;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding: 0;
      /* Ensure it sits above other layers */
      z-index: 9999;
    }

    .pronite-card-shell {
      width: 100%;
      max-width: none; /* Allow full stretch */
      border-radius: 20px; /* Rounded corners all around since it's floating */
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      background: rgba(20, 20, 24, 0.4);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    /* Hide desktop info row on mobile */
    .pronite-card-info {
      display: none;
    }

    /* Show mobile top row */
    .pronite-card-mobile-top {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px 6px;
    }

    /* Mobile album art — smaller */
    .pronite-card-art-mobile {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .pronite-card-name {
      font-size: 1rem;
      letter-spacing: 0.01em;
      margin-bottom: 2px;
    }

    .pronite-card-date {
      font-size: 0.65rem;
      margin: 0;
      letter-spacing: 0.1em;
      opacity: 0.6;
    }

    /* Mobile progress */
    .pronite-card-progress {
      padding: 0 16px;
      margin-top: 8px;
    }

    /* Mobile controls */
    .pronite-card-controls {
      padding: 6px 16px 14px;
      margin-top: 2px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .pronite-card-transport {
      gap: 24px;
      justify-content: center;
      flex: 1;
    }

    .pronite-card-play-btn {
      width: 40px;
      height: 40px;
      box-shadow: 0 4px 12px rgba(255,255,255,0.2);
    }
  }
`;

const ProniteCard: React.FC<ProniteCardProps> = ({
  artistName,
  artistDate,
  artistImage,
  accentColor = "#D84D7D",
  songUrl,
  onNext,
  onPrev,
  isMuted, // Destructure this
  onMuteToggle, // Destructure this
  isPlaying, // Destructure this
  onPlayToggle, // Destructure this
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const heartBtnRef = useRef<HTMLButtonElement>(null);
  const mobileHeartRef = useRef<HTMLButtonElement>(null);

  const [hearts, setHearts] = useState<
    {
      id: number;
      x: number;
      y: number;
      s: number;
      startX: number;
      startY: number;
    }[]
  >([]);

  const triggerBurst = (btnRef: React.RefObject<HTMLButtonElement | null>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    const newHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      startX,
      startY,
      x: (Math.random() - 0.5) * 600,
      y: -300 - Math.random() * 400,
      s: Math.random() * 1.2 + 0.6,
    }));

    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)),
      );
    }, 2000);
  };

  const handleLikeClick = (
    btnRef: React.RefObject<HTMLButtonElement | null>,
  ) => {
    if (!isLiked) triggerBurst(btnRef);
    setIsLiked(!isLiked);
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 1. SILENCE IMMEDIATELY
    // We force the volume to 0.001 (nearly silent) before the browser even thinks about playing.
    audio.volume = 0;
    audio.muted = isMuted;

    const handlePlay = () => {
      if (isPlaying) {
        audio
          .play()
          .then(() => {
            // 2. LONG CINEMATIC SWELL (4 Seconds)
            // We use 'expo.out' which starts the volume very low and builds smoothly.
            gsap.to(audio, {
              volume: 1,
              duration: 4,
              ease: "sine.inOut",
              overwrite: "auto",
            });
          })
          .catch(() => console.log("Awaiting interaction..."));
      } else {
        // 3. SMOOTH PAUSE (2 Seconds)
        gsap.to(audio, {
          volume: 0,
          duration: 2,
          ease: "sine.inOut",
          onComplete: () => {
            if (!isPlaying) audio.pause();
          },
        });
      }
    };

    handlePlay();

    // 4. THE LONG SCROLL EXIT (3 Seconds)
    return () => {
      const currentAudio = audio;
      // We kill existing swell tweens so they don't fight the fade-out
      gsap.killTweensOf(currentAudio);

      gsap.to(currentAudio, {
        volume: 0,
        duration: 3,
        ease: "power1.in", // Power1.in is perfect for trailing off sound
        onComplete: () => {
          currentAudio.pause();
          currentAudio.src = "";
        },
      });
    };
  }, [isPlaying, isMuted, songUrl]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 280, damping: 22 },
    },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
  };

  const controlBtnStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgba(255,255,255,0.5)",
    display: "flex",
    alignItems: "center",
    padding: "4px",
    transition: "all 0.2s",
  };

  return (
    <>
      {/* Inject responsive CSS */}
      <style>{RESPONSIVE_CSS}</style>

      {/* Floating heart burst particles */}
      {createPortal(
        <div className="fixed inset-0 pointer-events-none z-[10000]">
          <AnimatePresence>
            {hearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{
                  opacity: 1,
                  scale: 0,
                  x: heart.startX,
                  y: heart.startY,
                }}
                animate={{
                  opacity: 0,
                  scale: heart.s,
                  x: heart.startX + heart.x,
                  y: heart.startY + heart.y,
                  rotate: heart.x > 0 ? 45 : -45,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
                className="absolute"
                style={{ left: 0, top: 0 }}
              >
                <Heart size={28} fill={HEART_RED} color={HEART_RED} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}

      {/* ─── Card ─── */}
      <div className="pronite-card-container">
        <audio ref={audioRef} src={songUrl} loop playsInline preload="auto" />

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="pointer-events-auto"
          style={{ width: "100%" }}
        >
          <div className="pronite-card-shell">
            {/* Accent glow */}
            <div
              style={{
                position: "absolute",
                bottom: "-60px",
                right: "-40px",
                width: "200px",
                height: "200px",
                background: accentColor,
                borderRadius: "50%",
                filter: "blur(100px)",
                opacity: 0.15,
                pointerEvents: "none",
              }}
            />

            {/* ─── Desktop: Image + Info row ─── */}
            <div className="pronite-card-info">
              <img
                src={artistImage}
                alt={artistName}
                className="pronite-card-art"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 className="pronite-card-name">{artistName}</h3>
                <p className="pronite-card-date">{artistDate}</p>
              </div>
            </div>

            {/* ─── Mobile: Compact top row ─── */}
            <div className="pronite-card-mobile-top">
              <img
                src={artistImage}
                alt={artistName}
                className="pronite-card-art-mobile"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 className="pronite-card-name">{artistName}</h3>
                <p className="pronite-card-date">{artistDate}</p>
              </div>
              <button
                ref={mobileHeartRef}
                onClick={() => handleLikeClick(mobileHeartRef)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Heart
                  size={18}
                  fill={isLiked ? HEART_RED : "none"}
                  stroke={isLiked ? HEART_RED : "rgba(255,255,255,0.45)"}
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* ─── Progress bar ─── */}
            <div className="pronite-card-progress">
              <div
                style={{
                  height: "3px",
                  width: "100%",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    background: "#fff",
                    borderRadius: "2px",
                    boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                  }}
                  animate={{ width: isPlaying ? "100%" : "35%" }}
                  transition={{
                    duration: isPlaying ? 30 : 0.5,
                    ease: "linear",
                  }}
                />
              </div>
            </div>

            {/* ─── Controls row ─── */}
            <div className="pronite-card-controls">
              {/* Volume — far left */}
              <button
                onClick={onMuteToggle} // Correct prop name from parent
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px",
                  color: isMuted ? "#f87171" : "rgba(255,255,255,0.35)",
                }}
              >
                {/* Switch icon based on the isMuted prop */}
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              {/* Centre transport */}
              <div className="pronite-card-transport">
                <button onClick={onPrev} style={controlBtnStyle}>
                  <SkipBack size={20} fill="currentColor" />
                </button>

                <button
                  onClick={onPlayToggle}
                  className="pronite-card-play-btn"
                >
                  {isPlaying ? (
                    <Pause size={18} fill="currentColor" />
                  ) : (
                    <Play
                      size={18}
                      fill="currentColor"
                      style={{ marginLeft: "2px" }}
                    />
                  )}
                </button>

                <button onClick={onNext} style={controlBtnStyle}>
                  <SkipForward size={20} fill="currentColor" />
                </button>
              </div>

              {/* Heart — far right (desktop only, mobile heart is in top row) */}
              <button
                ref={heartBtnRef}
                onClick={() => handleLikeClick(heartBtnRef)}
                className="pronite-card-heart-desktop"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.15s",
                }}
              >
                <Heart
                  size={20}
                  fill={isLiked ? HEART_RED : "none"}
                  stroke={isLiked ? HEART_RED : "rgba(255,255,255,0.45)"}
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProniteCard;
