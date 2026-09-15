import React, { useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InfiniteScrollProps {
  items: ReactNode[];
  speed?: "slow" | "normal" | "fast";
  gap?: string;
  itemWidth?: string;
  direction?: "left" | "right";
  onItemClick?: (index: number) => void;
  pauseOnHover?: boolean;
  autoScroll?: boolean;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  items,
  speed = "normal",
  gap = "gap-6",
  itemWidth = "w-64",
  direction = "left",
  onItemClick,
  pauseOnHover = true,
  autoScroll = true,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const duplicatedItems = [...items, ...items, ...items];

  const speedClass =
    speed === "slow"
      ? "animate-scroll-slow"
      : speed === "fast"
        ? "animate-scroll-fast"
        : "animate-scroll";

  const directionClass = direction === "right" ? "animate-scroll-reverse" : "";

  const scrollManual = (direction: "left" | "right") => {
    if (scrollRef.current) {
      let scrollAmount = 400;

      // Only dynamically calculate for smaller screens (mobile/tablet)
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        const firstChild = scrollRef.current.firstElementChild as HTMLElement;
        scrollAmount = firstChild ? firstChild.offsetWidth + 24 : 400;
      }

      const currentScroll = scrollRef.current.scrollLeft;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, []);

  return (
    <>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes scroll-reverse {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .infinite-scroll-container .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .infinite-scroll-container .animate-scroll-slow {
          animation: scroll 50s linear infinite;
        }

        .infinite-scroll-container .animate-scroll-fast {
          animation: scroll 20s linear infinite;
        }

        .infinite-scroll-container .animate-scroll-reverse {
          animation: scroll-reverse 30s linear infinite;
        }

        .infinite-scroll-container:hover .animate-scroll,
        .infinite-scroll-container:hover .animate-scroll-slow,
        .infinite-scroll-container:hover .animate-scroll-fast,
        .infinite-scroll-container:hover .animate-scroll-reverse {
          animation-play-state: paused;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {autoScroll ? (
        <div
          className={`infinite-scroll-container overflow-hidden w-full max-w-full ${pauseOnHover ? "" : ""
            }`}
        >
          <div
            className={`flex ${gap} flex-nowrap whitespace-nowrap ${speedClass} ${directionClass}`}
          >
            {duplicatedItems.map((item, index) => (
              <div
                key={index}
                className={`flex-none shrink-0 ${itemWidth} cursor-pointer transition-transform hover:scale-105 duration-300`}
                onClick={() => onItemClick?.(index % items.length)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex items-center overflow-x-hidden w-full px-2 sm:px-8">
          { }
          <button
            onClick={() => scrollManual("left")}
            disabled={!canScrollLeft}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 group"
            title="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-200 group-hover:text-white" />
          </button>

          { }
          <div className="relative w-[80vw] sm:w-full mx-auto sm:mx-0 max-w-full sm:max-w-[520px] md:max-w-[720px] lg:max-w-[900px] overflow-hidden">
            { }
            <div
              ref={scrollRef}
              className={`overflow-x-auto scrollbar-hide w-full touch-pan-y overscroll-x-contain flex ${gap} pb-4 snap-x snap-mandatory sm:snap-none px-0 sm:px-0`}
              onScroll={updateScrollButtons}
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`flex-none shrink-0 ${itemWidth} snap-center sm:snap-align-none cursor-pointer transition-transform hover:scale-105 duration-300`}
                  onClick={() => onItemClick?.(index)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          { }
          <button
            onClick={() => scrollManual("right")}
            disabled={!canScrollRight}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 group"
            title="Scroll right"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-200 group-hover:text-white" />
          </button>
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
