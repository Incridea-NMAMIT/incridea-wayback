import { MapPin, Calendar, Users } from "lucide-react";
import type { PublicEvent } from "../../api/public";
import { formatDate, formatDateWithTime } from "../../utils/date";
import LazyImage from "../LazyImage";

const CATEGORY_THEMES = {
  TECHNICAL: {
    color: "#e8ebf7",
    label: "TECH",
  },
  NON_TECHNICAL: {
    color: "#ffc857",
    label: "NON-TECH",
  },
  CORE: { color: "#3bc4ba", label: "CORE" },
  SPECIAL: {
    color: "#f0544f",
    label: "SPECIAL",
  },
  DEFAULT: {
    color: "#400f4c",
    label: "EVENT",
  },
};

interface EventCardProps {
  event: PublicEvent;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const firstRoundWithDate = event.rounds.find((round) => round.date);
  const sortedSchedules = event.Schedule?.filter(s => s.startTime).sort((a, b) =>
    new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime()
  );
  const scheduleDate = sortedSchedules?.[0]?.startTime;
  const theme =
    CATEGORY_THEMES[event.category as keyof typeof CATEGORY_THEMES] ||
    CATEGORY_THEMES.DEFAULT;

  const teamSizeText =
    event.minTeamSize === event.maxTeamSize
      ? event.minTeamSize === 1
        ? "Solo"
        : `${event.minTeamSize} per team`
      : `${event.minTeamSize}-${event.maxTeamSize} per team`;

  const maskImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1452 2447'%3E%3Cpath d='M80 0h1292c44 0 80 36 80 80v2050c0 44-36 80-80 80h-480c-40 0-70 30-90 65-30 55-50 172-110 172H80c-44 0-80-36-80-80V80C0 36 36 0 80 0z'/%3E%3C/svg%3E")`;

  return (
    <div
      className={`event-card-float flex items-center justify-center p-4 font-sans transition-transform duration-500 md:hover:-translate-y-4 md:hover:z-50 ${index % 2 !== 0 ? "lg:mt-24" : "mt-0"
        }`}
      style={{
        animationName: `floating${(index % 3) + 1}`,
        animationDuration: `${4 + (index % 3)}s`,
        animationDelay: `${(index * 0.5) % 3}s`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        willChange: "transform",
      }}
    >
      <div
        className="event-card-jitter relative w-[240px] aspect-[1452/2447.19] group"
        style={{
          animationDuration: `${3 + (index % 3)}s`,
          animationDelay: `${(index * 0.2) % 2}s`,
          willChange: "transform",
        }}
      >
        <div
          className="absolute inset-0 z-10"
          style={{
            WebkitMaskImage: maskImage,
            maskImage: maskImage,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          }}
        >
          <div className="flex h-full w-full flex-col border border-white/10 p-[16px_14px_8px] backdrop-blur-2xl transition-all duration-500 group-hover:border-white/30 bg-zinc-950/50 overflow-hidden">
            <div
              className="pointer-events-none absolute -inset-y-0 animate-shine bg-[linear-gradient(120deg,transparent_35%,rgba(255,255,255,0.10)_50%,transparent_65%)]"
              style={{
                width: "200%",
                animationDuration: `${12 + (index % 6)}s`,
                animationDelay: `${(index * 2) % 8}s`,
              }}
            />

            <div className="relative mx-auto w-[94%] aspect-[1080/1350] rounded-xl overflow-hidden  border border-white/10 shrink-0">
              <LazyImage
                src={
                  event.image ||
                  "https://www.shutterstock.com/image-vector/girl-holding-open-book-reading-600nw-1470580109.jpg"
                }
                alt={event.name}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                containerClassName="absolute inset-0 w-full h-full"
              />
            </div>

            <div className="ml-1 mt-3 mb-1 text-[13px] font-bold uppercase tracking-[1.2px] text-white/90 truncate shrink-0">
              {event.name}
            </div>

            <div className="mt-auto space-y-1.5 pb-8 px-1">
              <div className="flex h-7 w-full items-center gap-2 rounded-md border border-white/5  px-3 backdrop-blur-sm text-white shrink-0">
                <Calendar size={12} className="opacity-70 shrink-0" />
                <span className="text-[10px] font-medium tracking-wide truncate">
                  {scheduleDate
                    ? formatDateWithTime(scheduleDate)
                    : firstRoundWithDate
                      ? formatDate(firstRoundWithDate.date)
                      : "TBD"}
                </span>
              </div>

              <div className="flex h-7 w-full items-center gap-2 rounded-md border border-white/5  px-3 backdrop-blur-sm text-white shrink-0">
                <Users size={12} className="opacity-70 shrink-0" />
                <span className="text-[10px] font-medium tracking-wide truncate">
                  {teamSizeText}
                </span>
              </div>

              <div className="flex h-7 w-fit min-w-[90px] items-center gap-2 rounded-md border border-white/5  px-3 backdrop-blur-sm text-white shrink-0">
                <MapPin size={12} className="opacity-70 shrink-0" />
                <span className="text-[10px] font-medium tracking-wide truncate">
                  {event.venue || "NITTE"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-[2.5%] right-[5%] text-[10px] tracking-[0.3em] font-black select-none pointer-events-none z-20 transition-all duration-700 uppercase text-white"
        >
          {theme.label}
        </div>
      </div>

      <style>{`
        @keyframes shine { 
          0% { transform: translateX(-100%); } 
          100% { transform: translateX(100%); } 
        }
        .animate-shine { 
          animation-name: shine;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        .event-card-float,
        .event-card-jitter {
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .event-card-jitter {
          animation-name: jitter;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        /* High Intensity Chaos / Jitter Effect */
        @keyframes jitter {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-4px, 3px) rotate(-1deg); }
          40% { transform: translate(4px, -2px) rotate(1deg); }
          60% { transform: translate(-3px, -4px) rotate(-0.5deg); }
          80% { transform: translate(3px, 4px) rotate(0.5deg); }
        }

        @keyframes floating1 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes floating2 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes floating3 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }

        @media (hover: none), (pointer: coarse) {
          .event-card-jitter {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EventCard;