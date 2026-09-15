import React, { useState, useEffect } from "react";

interface HorizontalTimelineProps {
  items: string[];
  activeIndex: number;
  onItemClick: (index: number) => void;
  scrollProgress: number; // 0 to 1
}

const THEME_COLORS = [
  "#a78bfa", // 2022 - Violet (Nebula)
  "#c084fc", // 2023 - Purple (Cosmic)
  "#e879f9", // 2024 - Fuchsia (Plasma)
  "#22d3ee", // 2025 - Electric Blue (Energy)
];

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  items,
  activeIndex,
  onItemClick,
  scrollProgress,
}) => {
  const [indicatorPosition, setIndicatorPosition] = useState(0);

  useEffect(() => {
    // Map scroll progress 0..1 to percentage 0..100
    const p = Math.min(Math.max(scrollProgress, 0), 1);
    setIndicatorPosition(p * 100);
  }, [scrollProgress]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-12 py-0 md:py-1 flex flex-col justify-center relative">
      {/* 1. Nebula/Dark Matter Stream Background (Visibility Layer) */}
      <div className="absolute top-[-3rem] bottom-[-2rem] -inset-x-20 bg-gradient-to-r from-transparent via-[#030712]/40 to-transparent blur-[4px] -z-20" />

      {/* 2. Twinkling Background Stars (Pure CSS) */}
      <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none -z-10 opacity-60">
        <div className="absolute top-[20%] left-[10%] w-[2px] h-[2px] bg-white rounded-full animate-pulse shadow-[0_0_4px_white]" />
        <div
          className="absolute top-[70%] left-[25%] w-[3px] h-[3px] bg-cyan-300 rounded-full animate-pulse shadow-[0_0_8px_cyan]"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-[40%] left-[60%] w-[2px] h-[2px] bg-purple-300 rounded-full animate-pulse shadow-[0_0_5px_magenta]"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-[80%] left-[85%] w-[2px] h-[2px] bg-white rounded-full animate-pulse shadow-[0_0_6px_white]"
          style={{ animationDelay: "2.5s" }}
        />
      </div>

      {/* Items Container - Fits Screen Width */}
      <div className="relative w-full pb-8 md:pb-0">
        <div className="w-full flex justify-between items-center z-10 px-2 md:px-0 relative h-24 md:h-auto">
          {/* TRACK CONTAINER: Spans from center of first node to center of last node */}
          {/* Mobile: px-2 (0.5rem) + w-10/2 (1.25rem) = 1.75rem (left-7) */}
          {/* Desktop: px-0 + w-20/2 (2.5rem) = 2.5rem (left-10) */}
          <div className="absolute top-1/2 left-7 right-7 md:left-10 md:right-10 h-[2px] -translate-y-1/2 -z-10">
            {/* 3. Base Line (Deep Space Trace) */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />

            {/* 4. Active Progress Line (Starlight Beam) */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-cyan-500 to-white transition-all duration-300 ease-out shadow-[0_0_4px_cyan]"
              style={{ width: `${indicatorPosition}%` }}
            >
              {/* Leading Comet Head */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[6px] h-[6px] bg-white rotate-45 shadow-[0_0_4px_white,0_0_8px_cyan]" />
            </div>
          </div>

          {items.map((item, index) => {
            const color =
              THEME_COLORS[index] || THEME_COLORS[THEME_COLORS.length - 1];
            const isActive = index === activeIndex;

            return (
              <button
                key={item}
                onClick={() => onItemClick(index)}
                className="group relative flex flex-col items-center justify-center outline-none"
              >
                {/* Node Container */}
                <div className="relative flex items-center justify-center w-10 h-10 md:w-20 md:h-20">
                  {" "}
                  {/* Smaller on mobile */}
                  {/* Active: Compact Star Node */}
                  {isActive && (
                    <>
                      {/* 1. Subtle Background Glow - Tighter */}
                      <div
                        className="absolute inset-[30%] rotate-45 opacity-30 blur-md"
                        style={{ backgroundColor: color }}
                      />

                      {/* 2. Delicate Crosshair - Shortened */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-60">
                        <div className="absolute w-[1px] h-[50%] bg-white/50" />
                        <div className="absolute h-[1px] w-[50%] bg-white/50" />
                      </div>

                      {/* 3. Thin Accent Border - Tight Fit */}
                      <div className="absolute inset-[35%] md:inset-[38%] border border-white/20 rotate-45" />
                    </>
                  )}
                  {/* The Core: Radiant Diamond / Inactive Gem */}
                  <div
                    className={`
                    relative z-10 transition-all duration-500 ease-out flex items-center justify-center rotate-45
                    ${isActive ? "w-3 h-3 md:w-4 md:h-4 ring-1 ring-white/30" : "w-2.5 h-2.5 md:w-4 md:h-4 bg-gray-950 border group-hover:scale-125"}
                  `}
                    style={{
                      borderColor: isActive ? "transparent" : color,
                      boxShadow: !isActive ? `0 0 4px ${color}40` : undefined,
                      backgroundColor: isActive ? "white" : undefined,
                    }}
                  >
                    {isActive ? (
                      // Active: Bright Core
                      <div className="absolute inset-0 bg-white blur-[2px] rounded-sm" />
                    ) : null}
                  </div>
                </div>

                {/* Year Label */}
                <span
                  className={`
                  absolute -bottom-8 md:-bottom-2
                  text-[10px] md:text-base font-bold tracking-[0.05em] md:tracking-[0.15em] font-sans
                  transition-all duration-300
                  ${isActive ? "opacity-100 translate-y-0 text-white scale-110 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" : "opacity-90 translate-y-1 text-gray-200 group-hover:opacity-100 group-hover:text-white group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]"}
                `}
                  style={{
                    color: isActive ? color : undefined,
                    textShadow: isActive
                      ? `0 0 8px ${color}`
                      : "0 2px 2px rgba(0,0,0,0.6)",
                  }}
                >
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
