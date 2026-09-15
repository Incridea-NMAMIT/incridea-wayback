import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import FantasyButton from "../components/FantasyButton";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import TotemGlitch from "../components/effects/TotemGlitch";
import { logoutUser } from "../api/auth";
import MobileMenu from "../components/MobileMenu";
import LandingSidebar from "../components/LandingSidebar";

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    // 50ms delay to allow initial render, then trigger pop-in animation
    const timer1 = setTimeout(() => setIsLoading(false), 50);

    // Fade in the rest of the content after the totem has popped in
    const timer2 = setTimeout(() => setIsContentVisible(true), 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const [currentBiome, setCurrentBiome] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [glitchTotem, setGlitchTotem] = useState(false);
  const [periodicGlitch, setPeriodicGlitch] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [showFooterVariant, setShowFooterVariant] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  const biomeVideos = [
    "/landingpage/gen-01.webm",
    "/landingpage/gen-02.webm",
    "/landingpage/gen-03.webm",
    "/landingpage/gen-04.webm",
    "/landingpage/gen-05.webm",
    "/landingpage/gen-06.webm",
  ];

  const biomeVideosMobile = [
    "/landingpage/gen-01.webm",
    "/landingpage/gen-02.webm",
    "/landingpage/gen-03.webm",
    "/landingpage/gen-04.webm",
    "/landingpage/gen-05.webm",
    "/landingpage/gen-06.webm",
  ];

  const getVideoUrl = (index: number): string => {
    return isMobile ? biomeVideosMobile[index] : biomeVideos[index];
  };

  const totemImages = [
    "/landingpage/gen-01.webp",
    "/landingpage/gen-02.webp",
    "/landingpage/gen-03.webp",
    "/landingpage/gen-04.webp",
    "/landingpage/gen-05.webp",
    "/landingpage/gen-06.webp",
  ];

  const getTotemImage = (index: number): string => {
    return totemImages[index];
  };

  const posterImages = [
    "/landingpage/gen-1.webp",
    "/landingpage/gen-2.webp",
    "/landingpage/gen-3.webp",
    "/landingpage/gen-4.webp",
    "/landingpage/gen-5.webp",
    "/landingpage/gen-6.webp",
  ];

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      // Page ready to render
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    let startY = 0;

    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const previousHtmlOverscroll = htmlEl.style.overscrollBehaviorY;
    const previousBodyOverscroll = bodyEl.style.overscrollBehaviorY;
    const previousHtmlTouchAction = htmlEl.style.touchAction;
    const previousBodyTouchAction = bodyEl.style.touchAction;
    const previousHtmlOverflow = htmlEl.style.overflow;
    const previousBodyOverflow = bodyEl.style.overflow;

    if (isMobile) {
      // prevent rubber-band overscroll but do not block all scrolling
      htmlEl.style.touchAction = "pan-x pan-y";
      bodyEl.style.touchAction = "pan-x pan-y";
      htmlEl.style.overscrollBehaviorY = "contain";
      bodyEl.style.overscrollBehaviorY = "contain";
      // only set overflow hidden if some overlay needs it; avoid blocking page scroll
      // htmlEl.style.overflow = "hidden";
      // bodyEl.style.overflow = "hidden";
    } else {
      htmlEl.style.overscrollBehaviorY = "none";
      bodyEl.style.overscrollBehaviorY = "none";
    }

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      startY = event.touches[0].clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      const target = event.target as HTMLElement;
      if (target?.closest('.overflow-y-auto, .overflow-auto, [style*="overflow-y: auto"], [style*="overflow: auto"]')) {
        return;
      }

      if (event.touches.length !== 1) return;
      const currentY = event.touches[0].clientY;
      const isPullingDown = currentY > startY;
      const scrollTop = document.scrollingElement?.scrollTop ?? window.scrollY;

      // prevent overscroll pull-to-refresh only when at top and pulling down
      if (isPullingDown && scrollTop <= 0) {
        event.preventDefault();
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      htmlEl.style.overscrollBehaviorY = previousHtmlOverscroll;
      bodyEl.style.overscrollBehaviorY = previousBodyOverscroll;
      htmlEl.style.touchAction = previousHtmlTouchAction;
      bodyEl.style.touchAction = previousBodyTouchAction;
      htmlEl.style.overflow = previousHtmlOverflow;
      bodyEl.style.overflow = previousBodyOverflow;
    };
  }, [isMobile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFooterVariant((prev) => !prev);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning && !glitchTotem) {
        setPeriodicGlitch(true);
        setTimeout(() => {
          setPeriodicGlitch(false);
        }, 500);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isTransitioning, glitchTotem]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning && !glitchTotem) {
        setPeriodicGlitch(true);
        setTimeout(() => {
          setPeriodicGlitch(false);
        }, 500);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isTransitioning, glitchTotem]);

  useEffect(() => {
    const handleParallaxMove = (e: PointerEvent | TouchEvent) => {
      let clientX: number | undefined;

      if ("touches" in e) {
        clientX = e.touches[0]?.clientX;
      } else {
        clientX = e.clientX;
      }

      if (typeof clientX !== "number") return;

      const x = (clientX / window.innerWidth - 0.5) * 16;
      document.documentElement.style.setProperty("--parallax-x", `${x}px`);
    };

    document.documentElement.style.setProperty("--parallax-x", "0px");
    window.addEventListener("pointermove", handleParallaxMove, {
      passive: true,
    });
    window.addEventListener("touchmove", handleParallaxMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handleParallaxMove);
      window.removeEventListener("touchmove", handleParallaxMove);
    };
  }, []);

  const triggerTransition = () => {
    if (isTransitioning) return;

    const upcoming = (currentBiome + 1) % biomeVideos.length;

    setIsTransitioning(true);
    setPeriodicGlitch(false);
    setGlitchTotem(true);

    // Start preloading next video immediately during glitch
    prepareNextVideo(upcoming, playerRef.current);

    // After glitch ends, switch to the loaded video
    setTimeout(() => {
      setCurrentBiome(upcoming);
      setGlitchTotem(false);
      setIsTransitioning(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      triggerTransition();
    }, 8000);

    return () => clearInterval(interval);
  }, [isTransitioning, currentBiome]);

  const handleTotemClick = () => {
    triggerTransition();
  };

  const prepareNextVideo = (index: number, ref: HTMLVideoElement | null) => {
    if (!ref) return;
    ref.src = getVideoUrl(index);
    ref.load();
    ref.play().catch(() => { });
  };

  return (
    <>
      <SEO
        title="Home"
        description="Welcome to Incridea'26, the annual techno-cultural fest of NMAMIT, Nitte."
        url="/"
      />
      <main className="bg-black min-h-screen text-white overflow-hidden relative">
        <svg className="absolute inset-0 w-0 h-0 pointer-events-none">
          <defs>
            <filter id="biomeDistortion">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.02"
                numOctaves="4"
                result="noise"
              >
                <animate
                  attributeName="baseFrequency"
                  values="0.02;0.03;0.02"
                  dur="0.8s"
                  repeatCount="1"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="40"
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              >
                <animate
                  attributeName="scale"
                  values="40;60;40"
                  dur="0.8s"
                  repeatCount="1"
                />
              </feDisplacementMap>
            </filter>
          </defs>
        </svg>

        {/* Mobile Menu Trigger */}
        <div className="absolute top-4 right-4 z-[120] lg:hidden">
          <MobileMenu onLogout={handleLogout} isAuthenticated={isAuthenticated} />
        </div>

        {/* Desktop Sidebar */}
        <LandingSidebar biomeIndex={currentBiome} />

        <style>
          {`
        /* Hide iOS video controls */
        video::-webkit-media-controls-panel, 
        video::-webkit-media-controls-play-button, 
        video::-webkit-media-controls-start-playback-button {
          display: none !important;
          -webkit-appearance: none;
        }

        @keyframes microDrift {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.45;
          }
          50% {
            transform: translateY(2px);
            opacity: 0.6;
          }
        }

        .hover-hint {
          position: absolute;
          left: 24px;
          top: 50%;
          transform: translateY(-50%) rotate(-90deg);
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          z-index: 5;
          white-space: nowrap;
          pointer-events: none;
        }

        .hover-hint::before {
          content: "";
          position: absolute;
          inset: -28px -12px;
          background: radial-gradient(
            ellipse at center,
            rgba(0,0,0,0.55) 0%,
            rgba(0,0,0,0.35) 40%,
            rgba(0,0,0,0.15) 65%,
            transparent 80%
          );
          z-index: -1;
        }

        @keyframes radialPulse {
          0% {
            filter: brightness(1) drop-shadow(0 0 0px rgba(251, 191, 36, 0));
          }
          50% {
            filter: brightness(1.1) drop-shadow(0 0 40px rgba(251, 191, 36, 0.5));
          }
          100% {
            filter: brightness(1) drop-shadow(0 0 0px rgba(251, 191, 36, 0));
          }
        }

        .peek-video {
          filter: contrast(1.15) saturate(1.1);
        }

        .bg-corner-slice {
          position: absolute;
          width: 60%;
          height: 40%;
          overflow: hidden;
          mix-blend-mode: screen;
          opacity: 0.35;
          animation: bgSliceGlitch 0.18s steps(1, end) 1;
          will-change: transform, filter;
        }

        @keyframes bgSliceGlitch {
          0% {
            transform: translate(0, 0) scaleY(1);
            filter: none;
          }
          35% {
            transform: translate(-4px, -1px) scaleY(1.03);
            filter: drop-shadow(-2px 0 rgba(130, 70, 190, 0.45));
          }
          65% {
            transform: translate(3px, 1px) scaleY(0.97);
            filter: drop-shadow(2px 0 rgba(255, 255, 255, 0.35));
          }
          100% {
            transform: translate(0, 0) scaleY(1);
            filter: none;
          }
        }

        @keyframes glitchFlicker {
          0% {
            transform: translate3d(0, 0, 0);
            filter: none;
          }
          20% {
            transform: translate3d(-2px, 1px, 0);
            filter: contrast(1.1) saturate(1.2);
          }
          40% {
            transform: translate3d(2px, -1px, 0);
            filter: contrast(1.2) saturate(1.3);
          }
          60% {
            transform: translate3d(-1px, 2px, 0);
            filter: contrast(1.1) saturate(1.2);
          }
          80% {
            transform: translate3d(1px, -2px, 0);
            filter: contrast(1.2) saturate(1.3);
          }
          100% {
            transform: translate3d(0, 0, 0);
            filter: none;
          }
        }

        .glitch-layer--active {
          animation: glitchFlicker 0.5s steps(1, end) 1;
        }

        @keyframes glitchJitter {
          0% {
            transform: translate3d(0, 0, 0);
          }
          25% {
            transform: translate3d(-4px, 2px, 0);
          }
          50% {
            transform: translate3d(4px, -2px, 0);
          }
          75% {
            transform: translate3d(-2px, -3px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .glitch-video {
          mix-blend-mode: normal;
        }

        .glitch-layer--active .glitch-video {
          mix-blend-mode: screen;
          opacity: 0.85;
          animation: glitchJitter 0.5s steps(1, end) 1;
        }

        @keyframes flashFade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        `}
        </style>
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            zIndex: 10,
            transform: isMobile ? "scale(1)" : `translateX(var(--parallax-x)) scale(1.02)`,
            animation: isMobile
              ? "none"
              : "radialPulse 3s ease-in-out infinite",
            opacity: isContentVisible ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
        >
          {/* MAIN VIDEO PLAYER */}
          <video
            ref={playerRef}
            src={getVideoUrl(currentBiome)}
            poster={posterImages[currentBiome]}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disableRemotePlayback
            controls={false}
            aria-hidden
          />
        </div>

        {/* Glitch Overlay (Persistent, Not Mounted) - Shows during transitions */}
        <div
          className={`fixed inset-0 z-30 pointer-events-none transition-opacity duration-75 ${glitchTotem ? "opacity-100 glitch-layer--active" : "opacity-0"
            }`}
        >
          <video
            src={getVideoUrl(currentBiome)}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover glitch-video"
            style={{
              transform: isMobile ? "scale(1.1)" : `translateX(var(--parallax-x)) scale(1.02)`,
              filter:
                "url(#biomeDistortion) contrast(1.1) saturate(1.0) hue-rotate(8deg)",
            }}
            disableRemotePlayback
            controls={false}
            aria-hidden
          />
        </div>

        {/* Totem Flash Effect */}
        <div
          className="fixed inset-0 pointer-events-none bg-white"
          style={{
            zIndex: 49,
            opacity: 0,
            animation: !isLoading ? "flashFade 0.8s ease-out forwards" : "none",
          }}
        />

        <div
          className="absolute left-1/2 top-12 md:top-16
             -translate-x-1/2
             pointer-events-none flex flex-col items-center gap-2"
          style={{
            zIndex: 40,
            opacity: isContentVisible ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
        >
          <img
            src="/pronite/nmamit.svg"
            alt="NMAMIT Logo"
            className="h-14 md:h-16 w-auto invert brightness-0 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
            decoding="async"
          />
          <p className="text-white font-bold font-sans drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">presents</p>
          <img
            src="/landingpage/incridea.webp"
            alt="Incridea Logo"
            className="h-14 md:h-20 w-auto drop-shadow-xl"
            decoding="async"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        <div
          className="absolute left-1/2 top-1/2 
             -translate-x-1/2 -translate-y-1/2 
             pointer-events-none"
          style={{
            zIndex: 50,
            width: isMobile ? "80vw" : "75vw",
            height: isMobile ? "40vh" : "50vh",
            opacity: isLoading ? 0 : 1,
            transform: isLoading ? "scale(0)" : "scale(1)",
            transition:
              "opacity 0.5s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div
            className="h-full flex items-center justify-center"
            style={{
              transform: isMobile ? "none" : `translateX(var(--parallax-x))`,
              transition: "transform 0.25s ease-out",
            }}
          >
            <TotemGlitch
              src={
                glitchTotem
                  ? getTotemImage(currentBiome)
                  : periodicGlitch
                    ? "/landingpage/totem.webp"
                    : getTotemImage(currentBiome)
              }
              active={glitchTotem || periodicGlitch}
            />
          </div>
        </div>

        <button
          onClick={handleTotemClick}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent cursor-pointer hover:bg-white/5 transition-colors duration-300 rounded-lg"
          style={{
            zIndex: 100,
            width: isMobile ? "32vw" : "24vw",
            height: isMobile ? "16vh" : "20vh",
          }}
          aria-label="Click to swap biomes"
        />



        <div
          className="absolute left-1/2 bottom-[16%] md:bottom-[14%] -translate-x-1/2 flex flex-col items-center gap-4"
          style={{
            zIndex: 60,
            opacity: isContentVisible ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
        >
          <div className="flex items-center gap-6 sm:gap-6 md:gap-8 lg:gap-12">
            <FantasyButton to="/events" biomeIndex={currentBiome}>
              Events
            </FantasyButton>
            {!isAuthenticated ? (
              <FantasyButton to="/login" biomeIndex={currentBiome}>
                Login
              </FantasyButton>
            ) : !user?.pid ? (
              <FantasyButton to="/register" biomeIndex={currentBiome}>
                Register
              </FantasyButton>
            ) : (
              <FantasyButton to="/profile" biomeIndex={currentBiome}>
                Profile
              </FantasyButton>
            )}
          </div>

          {isAuthenticated && (
            <FantasyButton onClick={handleLogout} biomeIndex={currentBiome}>
              Logout
            </FantasyButton>
          )}
        </div>

        <footer
          className="absolute bottom-0 left-0 w-full px-4 py-8 text-center bg-gradient-to-t from-black/80 to-transparent"
          style={{ zIndex: 90 }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: showFooterVariant ? 0 : 1,
              transition: "opacity 0.5s ease-in-out",
              pointerEvents: showFooterVariant ? "none" : "auto",
            }}
          >
            <nav className="flex flex-wrap justify-center gap-2 sm:gap-3 text-sm sm:text-xs md:text-sm text-gray-300 font-medium">
              <Link
                to="/privacy-policy"
                className="text-gray-300 visited:text-gray-300 active:text-gray-300 no-underline hover:text-gray-100 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/terms-and-conditions"
                className="text-gray-300 visited:text-gray-300 active:text-gray-300 no-underline hover:text-gray-100 transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/guidelines-regulations"
                className="text-gray-300 visited:text-gray-300 active:text-gray-300 no-underline hover:text-gray-100 transition-colors duration-200"
              >
                Guidelines
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/refund-policy"
                className="text-gray-300 visited:text-gray-300 active:text-gray-300 no-underline hover:text-gray-100 transition-colors duration-200"
              >
                Refund Policy
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/contact-us"
                className="text-gray-300 visited:text-gray-300 active:text-gray-300 no-underline hover:text-gray-100 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          <Link
            to="/tech-team"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center bg-transparent  transition-colors duration-300 rounded-lg no-underline"
            style={{
              zIndex: 100,
              height: "70vh",
              maxHeight: "100px",
              width: "18%",
              opacity: showFooterVariant ? 1 : 0,
              pointerEvents: showFooterVariant ? "auto" : "none",
            }}
          >
            <div className="text-sm sm:text-xs md:text-sm text-gray-300 font-medium flex flex-col items-center justify-center gap-1 whitespace-nowrap">
              <p className="m-0">
                Made with <span className="text-gray-400">&hearts;</span> by
                Technical Team
              </p>
            </div>
          </Link>
        </footer>
        {/* Empty black strip at the bottom */}
        <div className="w-full absolute bottom-0 left-0 z-[150] bg-black border-t border-white/10 h-[14px] md:h-[18px]"></div>

        {/* Bottom Vignette */}
        <div
          className="fixed bottom-0 left-0 w-full pointer-events-none"
          style={{
            height: "50%",
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%)",
            zIndex: 50,
          }}
        />
      </main >
    </>
  );
}

export default HomePage;
