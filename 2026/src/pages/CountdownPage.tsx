import { useMemo, useState, useEffect, useRef } from "react";
import mocoSans from "../assets/mocoSans-Regular.ttf";
import { TARGET_DATE, START_DATE } from "../config";
import { fetchNetworkTime } from "../utils/time";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

// ──────────────────────────────────────────────────────────────────────────────

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(now: number): TimeLeft {
  const diff = Math.max(TARGET_DATE.getTime() - now, 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function getProgress(now: number): number {
  const total = TARGET_DATE.getTime() - START_DATE.getTime();
  const elapsed = now - START_DATE.getTime();
  return Math.min(Math.max((elapsed / total) * 100, 0), 100);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// ─── Component ────────────────────────────────────────────────────────────────

const POLL_INTERVAL = 2 * 60 * 1000; // Re-sync every 2 minutes

export default function CountdownPage() {
  const [now, setNow] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const offsetRef = useRef<number>(0);
  const navigate = useNavigate();

  // Server time sync with polling
  useEffect(() => {
    let tickIntervalId: ReturnType<typeof setInterval>;
    let pollIntervalId: ReturnType<typeof setInterval>;

    const syncTime = async () => {
      try {
        const serverDate = await fetchNetworkTime();
        const serverTime = serverDate.getTime();
        const localTimeAtFetch = Date.now();
        offsetRef.current = serverTime - localTimeAtFetch;

        // Update time immediately
        setNow(Date.now() + offsetRef.current);
        setLoading(false);
      } catch (e) {
        console.error("Failed to sync time", e);
        // Fallback to local time if sync fails
        offsetRef.current = 0;
        setNow(Date.now());
        setLoading(false);
      }
    };

    // Initial sync
    syncTime();

    // Update time every second
    tickIntervalId = setInterval(() => {
      setNow(Date.now() + offsetRef.current);
    }, 1000);

    // Re-sync with server periodically
    pollIntervalId = setInterval(() => {
      syncTime();
    }, POLL_INTERVAL);

    return () => {
      if (tickIntervalId) clearInterval(tickIntervalId);
      if (pollIntervalId) clearInterval(pollIntervalId);
    };
  }, []);

  const currentNow = now ?? Date.now(); // Fallback to local time for immediate render



  // Redirect to home if target date is reached
  useEffect(() => {
    if (!loading && now && now >= TARGET_DATE.getTime()) {
      navigate("/");
    }
  }, [now, loading, navigate]);

  // Audio Sync Logic
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/incridea-anthem.mp3");
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!currentNow || !audioRef.current) return;

    const timeRemaining = TARGET_DATE.getTime() - currentNow;
    const audioDuration = 123 * 1000; // 2m 3s in ms

    // If within the audio window (and not finished)
    if (timeRemaining <= audioDuration && timeRemaining > 0) {
      const expectedCurrentTime = (audioDuration - timeRemaining) / 1000;

      if (audioRef.current.paused) {
        audioRef.current.currentTime = expectedCurrentTime;
        audioRef.current.play().catch((e) => {
          console.warn("Autoplay prevented:", e);
          // Optional: You could show a UI element here asking the user to click to enable audio
        });
      } else {
        // Sync check: if drift is > 0.5s, correct it
        if (Math.abs(audioRef.current.currentTime - expectedCurrentTime) > 0.5) {
          audioRef.current.currentTime = expectedCurrentTime;
        }
      }
    } else if (timeRemaining <= 0) {
      // Stop audio when countdown finishes
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [currentNow]);

  const timeLeft = useMemo(
    () =>
      currentNow ? getTimeLeft(currentNow) : { days: 0, hours: 0, minutes: 0, seconds: 0 },
    [currentNow],
  );
  const progress = useMemo(() => (currentNow ? getProgress(currentNow) : 0), [currentNow]);

  // Spinning nebula background (reuses the same pattern as App.tsx)
  const backgroundStyle = useMemo(() => {
    const blobs = Array.from({ length: 5 })
      .map(() => {
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        const size = 20 + Math.floor(Math.random() * 40);
        const colors = ["#0a0010", "#120020", "#1e0b24", "#0d0015", "#000000"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, transparent ${size}%)`;
      })
      .join(", ");
    return { backgroundColor: "#000000", backgroundImage: blobs };
  }, []);

  const isFinished =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <>
      <SEO
        title="Countdown"
        description="Countdown to Incridea'26."
        url="/countdown"
      />
      {/* ── Inline Styles ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        @font-face {
          font-family: 'MocoSans';
          src: url(${mocoSans}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        .cd-root {
          font-family: 'MocoSans', 'Outfit', system-ui, sans-serif;
        }

        /* Very faint full-card glitch */
        @keyframes faintGlitch {
          0%, 92%  { transform: translate(0, 0); }
          93%      { transform: translate(-1px, 1px); }
          94%      { transform: translate(1px, -1px); }
          95%      { transform: translate(0, 0); }
          97%      { transform: translate(1px, 0); }
          98%      { transform: translate(-1px, 0); }
          100%     { transform: translate(0, 0); }
        }

        .faint-glitch {
          animation: faintGlitch 6s infinite;
        }

        /* Glitch on hover for heading */
        @keyframes glitch {
          0%   { transform: translate(0); text-shadow: none; }
          20%  { transform: translate(-2px, 2px); text-shadow: 2px 2px 0 #9d4edd, -2px -2px 0 #e0aaff; }
          40%  { transform: translate(2px, -2px); text-shadow: -2px 2px 0 #9d4edd, 2px -2px 0 #e0aaff; }
          60%  { transform: translate(0); text-shadow: none; }
          80%  { transform: translate(2px, 2px); text-shadow: 0 0 5px rgba(255,255,255,0.5); }
          100% { transform: translate(0); text-shadow: none; }
        }
        .glitch-hover:hover {
          animation: glitch 0.3s cubic-bezier(0.25,0.46,0.45,0.94) both infinite;
        }

        /* Shimmer for progress bar */
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Digit pulse on change */
        @keyframes digitPop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        /* Floating particles */
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10%      { opacity: 1; }
          90%      { opacity: 1; }
          100%     { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(192, 132, 252, 0.6);
          border-radius: 50%;
          animation: float linear infinite;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(192, 132, 252, 0.6);
          border-radius: 50%;
          animation: float linear infinite;
          pointer-events: none;
        }

        /* Float Up/Down Animation */
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(192, 132, 252, 0.6);
          border-radius: 50%;
          animation: float linear infinite;
          pointer-events: none;
        }

        /* Float Up/Down Animation */
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>

      {/* ── Page Root ─────────────────────────────────────────────────── */}
      <div className="cd-root relative flex h-dvh w-full select-none overflow-hidden overscroll-none">
        {/* Spinning nebula bg */}
        <div
          style={{ ...backgroundStyle, animationDuration: "240s" }}
          className="fixed top-1/2 left-1/2 w-[200vmax] h-[200vmax] -translate-x-1/2 -translate-y-1/2 -z-50 pointer-events-none animate-spin"
        />

        {/* Background image layer */}
        <div
          className="fixed inset-0 -z-40 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/countdown/ryoko_changed.webp')",
          }}
        />

        {/* Dark overlay for legibility */}
        <div className="fixed inset-0 -z-30 pointer-events-none bg-black/30" />

        {/* Floating particles */}
        <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: "-4px",
                animationDuration: `${6 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 8}s`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
              }}
            />
          ))}
        </div>

        {/* ── Logo Centered on Screen ──────────────────────────────────── */}
        <div className="fixed top-[45%] lg:top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 animate-[floatUpDown_3s_ease-in-out_infinite] pointer-events-none">
          <div className="relative group">
            <div className="absolute inset-0 bg-amber-500/20 blur-[40px] rounded-full scale-150 animate-pulse" />
            <img
              src="/incridea-logo.png"
              alt="Incridea Logo"
              className="relative z-10 w-32 sm:w-40 md:w-48 object-contain drop-shadow-[0_0_35px_rgba(245,158,11,1)] brightness-125 transition-transform duration-500"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>

        {/* ── Center Card ──────────────────────────────────────────────── */}
        <div className="relative z-50 flex h-full w-full items-center justify-center px-4 sm:px-6">
          <div className="faint-glitch flex flex-col items-center w-full max-w-[700px]">
            {/* Heading */}
            <div className="relative mb-6 sm:mb-10 group cursor-default text-center">
              <h1 className="glitch-hover text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold italic leading-tight tracking-wide text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] transition-all duration-300">
                {isFinished ? "Portal Opened!" : "Portal Awakening..."}
              </h1>
            </div>

            {/* Timer */}
            <div className="glitch-hover flex items-baseline justify-center gap-1 sm:gap-2 md:gap-3 mb-2 sm:mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]">
              {(
                [
                  { value: timeLeft.days, label: "days" },
                  { value: timeLeft.hours, label: "hours" },
                  { value: timeLeft.minutes, label: "minutes" },
                  { value: timeLeft.seconds, label: "seconds" },
                ] as const
              ).map((seg, idx) => (
                <div key={seg.label} className="flex items-baseline">
                  {/* Separator colon (skip before first) */}
                  {idx > 0 && (
                    <span className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white opacity-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] mx-0.5 sm:mx-1 md:mx-2 select-none">
                      :
                    </span>
                  )}
                  <div className="flex flex-col items-center">
                    <span
                      className="tabular-nums font-extrabold text-white opacity-100 text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
                      style={{
                        animation: "digitPop 0.35s ease-out",
                        opacity: 1,
                      }}
                      key={
                        seg.value
                      } /* triggers re-mount animation on change */
                    >
                      {pad(seg.value)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.25em] text-purple-300 opacity-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] font-medium mt-0.5 sm:mt-1">
                      {seg.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[520px] mt-2 sm:mt-4 space-y-2">
              <div className="h-[2px] sm:h-[3px] w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-fuchsia-400 shadow-[0_0_12px_rgba(192,132,252,0.8)] relative transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/40 animate-[shimmer_2s_infinite]" />
                </div>
              </div>
              <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.4em] text-white-300 opacity-100 font-mono text-center uppercase">
                {isFinished ? "Portal is live" : "Initializing portal..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
