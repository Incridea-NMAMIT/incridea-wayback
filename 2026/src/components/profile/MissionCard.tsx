import { MapPin, Clock } from "lucide-react";

interface Mission {
    title: string;
    code: string;
    image: string | null;
}

interface MissionCardProps {
    mission: Mission;
    index: number;
}

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

const MissionCard = ({ mission, index }: MissionCardProps) => {
    const maskImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1452 2447'%3E%3Cpath d='M80 0h1292c44 0 80 36 80 80v2050c0 44-36 80-80 80h-480c-40 0-70 30-90 65-30 55-50 172-110 172H80c-44 0-80-36-80-80V80C0 36 36 0 80 0z'/%3E%3C/svg%3E")`;

    // Cycle through different themes based on index
    const themeKeys = Object.keys(CATEGORY_THEMES).filter(k => k !== "DEFAULT") as Array<keyof typeof CATEGORY_THEMES>;
    const theme = CATEGORY_THEMES[themeKeys[index % themeKeys.length]];

    return (
        <div
            className="flex items-center justify-center p-2 font-sans transition-all duration-500 hover:-translate-y-0 hover:z-50"
        >
           <div className="relative w-[210px] aspect-[1452/2447.19] group">
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        WebkitMaskImage: maskImage,
                       WebkitMaskSize: "100% 100%",
                        maskSize: "100% 100%",
                    }}
                >
                    <div className="flex h-full w-full flex-col border border-white/10 p-[16px_14px_8px] backdrop-blur-2xl transition-all duration-500 group-hover:border-white/30 bg-slate-900/40 overflow-hidden">


                        {/* Image Container */}
                        <div className="relative mx-auto w-[94%] aspect-[1080/1350] rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                            {mission.image ? (
                                <img
                                    src={mission.image}
                                    alt={mission.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                    draggable={false}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-linear-to-b from-white/60 via-white/25 to-black/70 flex items-center justify-center text-black/40">
                                    <div className="text-center text-sm">
                                        <div className="font-semibold">Portrait</div>
                                        <div>1080 × 1350 px (4:5)</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <div className="ml-1 mt-3 mb-1 text-[13px] font-bold uppercase tracking-[1.2px] text-white/90 truncate shrink-0">
                            {mission.title}
                        </div>

                        {/* Info Slots */}
                        <div className="mt-auto space-y-1.5 pb-8 px-1">

                            {/* Venue */}
                            <div className="flex h-5 w-full items-center justify-between gap-2 rounded-md border border-white/5 bg-white/5 px-3 backdrop-blur-sm text-white shrink-0">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <MapPin size={12} className="opacity-70 shrink-0 text-teal-400" />
                                    <span className="text-[10px] font-medium tracking-wide truncate text-teal-400">
                                        VENUE
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-amber-300">TBA</span>
                            </div>

                            {/* Time */}
                           <div className="flex h-5 w-full items-center justify-between gap-2 rounded-md border border-white/5 bg-white/5 px-3 backdrop-blur-sm text-white shrink-0">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <Clock size={12} className="opacity-70 shrink-0 text-pink-400" />
                                    <span className="text-[10px] font-medium tracking-wide truncate text-pink-400">
                                        TIME
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-amber-300">TBA</span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Label */}
                <div
                    className="absolute bottom-[2.5%] right-[3%] text-[10px] tracking-[0.3em] font-black select-none pointer-events-none z-20 transition-all duration-700 uppercase"
                    style={{
                        color: theme.color,
                        textShadow: `0 0 10px ${theme}`,
                        filter: `drop-shadow(0 0 2px ${theme})`,
                    }}
                >
                    {theme.label}
                </div>
            </div>

            <style>{`
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
      `}</style>
        </div >
    );
};

export default MissionCard;
