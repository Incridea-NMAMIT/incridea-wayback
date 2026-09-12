import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import gsap from "gsap";
import "./FinalReveal.css";
import CosmicBackground from "./CosmicBackground";
import ArtistCard from "./ArtistCard";

interface Artist {
  name: React.ReactNode;
  role: string;

  image: string;
  isHeadliner?: boolean;
  className?: string;
  animationStyle?: React.CSSProperties;
}

interface FinalRevealProps {
  artists: Artist[];
}

export interface FinalRevealRef {
  playAnimation: () => void;
  resetAnimation: () => void;
}

const FinalReveal = forwardRef<FinalRevealRef, FinalRevealProps>(
  ({ artists }, ref) => {
    const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const hasPlayedRef = useRef(false);

    const resetAnimation = () => {
      const card0 = cardRefs.current[0];
      const card1 = cardRefs.current[1];
      const card2 = cardRefs.current[2];

      // Kill existing timeline if any
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      // Reset to initial hidden state
      if (card0 && card1 && card2) {
        gsap.set(card0, { opacity: 0, x: 200, y: 20, scale: 0.8 });
        gsap.set(card1, { opacity: 0, y: 20 });
        gsap.set(card2, { opacity: 0, x: -200, y: 20, scale: 0.8 });
      }

      hasPlayedRef.current = false;
    };

    const playAnimation = () => {
      // Ensure all 3 cards are available
      const card0 = cardRefs.current[0];
      const card1 = cardRefs.current[1];
      const card2 = cardRefs.current[2];

      if (!card0 || !card1 || !card2) {
        return;
      }

      if (
        !(card0 instanceof HTMLElement) ||
        !(card1 instanceof HTMLElement) ||
        !(card2 instanceof HTMLElement)
      ) {
        return;
      }

      // Only play once per scroll-in
      if (hasPlayedRef.current) {
        return;
      }

      hasPlayedRef.current = true;

      // Kill existing timeline if any
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Set initial states for each card individually
      gsap.set(card0, { opacity: 0, x: 200, y: 20, scale: 0.8 }); // Left card (Nikitha)
      gsap.set(card1, { opacity: 0, y: 20 }); // Center card (Armaan)
      gsap.set(card2, { opacity: 0, x: -200, y: 20, scale: 0.8 }); // Right card (ALO)

      // Create timeline
      const tl = gsap.timeline({ delay: 0.2 });
      timelineRef.current = tl;

      // Armaan appears first (center)
      tl.to(card1, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      // Side cards slide out from behind simultaneously
      tl.to(
        card0,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.2",
      ); // Start slightly before center animation finishes

      tl.to(
        card2,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=1",
      ); // Start at the same time as card0
    };

    // Expose playAnimation and resetAnimation to parent component
    useImperativeHandle(ref, () => ({
      playAnimation,
      resetAnimation,
    }));

    // Set initial hidden state on mount
    useEffect(() => {
      const card0 = cardRefs.current[0];
      const card1 = cardRefs.current[1];
      const card2 = cardRefs.current[2];

      if (card0 && card1 && card2) {
        gsap.set(card0, { opacity: 0, x: 200, y: 20, scale: 0.8 });
        gsap.set(card1, { opacity: 0, y: 20 });
        gsap.set(card2, { opacity: 0, x: -200, y: 20, scale: 0.8 });
      }
    }, []);

    return (
      <div className="w-full h-[100dvh] font-display text-slate-100 relative flex flex-col justify-center items-center overflow-hidden pointer-events-auto">
        <CosmicBackground />
        <main className="relative z-10 max-w-7xl mx-auto px-3 md:px-4 w-full flex flex-col items-center justify-between h-full py-2">
          <header className="text-center animate-fade-up shrink-0 h-[12%] flex flex-col justify-center max-w-5xl mx-auto w-full">
            <div className="flex justify-center items-center gap-3 mb-1">
              <img
                src="/incridea.png"
                alt="Incridea"
                className="h-5 md:h-10 animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="h-5 w-[1px] bg-white/30"></div>
              <img
                src="pronite/pronite_1.png"
                alt="Pronite"
                className="h-7 md:h-16 animate-pulse-slow drop-shadow-[0_0_20px_rgba(238,43,111,0.5)]"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </header>

          <div
            ref={containerRef}
            className="flex flex-col md:grid md:grid-cols-12 md:justify-center gap-1 md:gap-6 w-full flex-1 min-h-0 h-[78%] relative"
          >
            {/* Nikitha - Slides from left */}
            <div
              ref={(el) => {
                cardRefs.current[0] = el;
              }}
              className="md:col-start-2 md:col-span-3 flex-1 min-h-0"
              style={{ willChange: "transform, opacity", opacity: 0 }}
            >
              <ArtistCard
                name={artists[0].name}

                image={artists[0].image}
                isHeadliner={artists[0].isHeadliner}
                className="h-full"
              />
            </div>
            {/* Armaan - Appears first in center */}
            <div
              ref={(el) => {
                cardRefs.current[1] = el;
              }}
              className="md:col-span-4 flex-1 min-h-0 md:z-10"
              style={{ willChange: "transform, opacity", opacity: 0 }}
            >
              <ArtistCard
                name={artists[1].name}

                image={artists[1].image}
                isHeadliner={artists[1].isHeadliner}
                className="h-full"
              />
            </div>
            {/* Alo - Slides from right */}
            <div
              ref={(el) => {
                cardRefs.current[2] = el;
              }}
              className="md:col-span-3 flex-1 min-h-0"
            >
              <ArtistCard
                name={artists[2].name}

                image={artists[2].image}
                isHeadliner={artists[2].isHeadliner}
                className="h-full"
                imageClassName="alo-band-img"
              />
            </div>
          </div>

          <div className="w-full flex flex-col items-center animate-fade-up [animation-delay:800ms] h-[10%] justify-center shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-primary opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_15px_#ee2b6f]"></span>
              </div>
              <h2 className="text-lg md:text-5xl font-black hashtag-gradient tracking-tighter drop-shadow-xl">
                #INCRIDEA26
              </h2>
            </div>
          </div>
        </main>
      </div>
    );
  },
);

FinalReveal.displayName = "FinalReveal";

export default FinalReveal;
