
const Crown = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`relative ${className}`}>
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full scale-125" />

            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full relative z-10 drop-shadow-[0_2px_8px_rgba(234,179,8,0.6)]"
            >
                <defs>
                    <linearGradient id="goldGradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFF7ED" /> {/* Lightest gold/white highlight */}
                        <stop offset="30%" stopColor="#FCD34D" /> {/* amber-300 */}
                        <stop offset="60%" stopColor="#F59E0B" /> {/* amber-500 */}
                        <stop offset="100%" stopColor="#B45309" /> {/* amber-700 */}
                    </linearGradient>

                    <linearGradient id="innerGradient" x1="50" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FDE68A" />
                        <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>

                    <radialGradient id="gemShine" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="transparent" />
                    </radialGradient>
                </defs>

                {/* Back part of rim (for depth) */}
                <path d="M20 75 Q 50 85 80 75 L 80 70 Q 50 80 20 70 Z" fill="#92400E" />

                {/* Main Body */}
                <path
                    d="M15 75 L 10 35 L 30 55 L 50 15 L 70 55 L 90 35 L 85 75 Q 50 88 15 75 Z"
                    fill="url(#goldGradient)"
                    stroke="#B45309"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />

                {/* Inner detailed shading lines */}
                <path d="M50 15 L 50 55" stroke="#B45309" strokeWidth="0.5" strokeOpacity="0.5" />
                <path d="M30 55 L 30 78" stroke="#B45309" strokeWidth="0.5" strokeOpacity="0.5" />
                <path d="M70 55 L 70 78" stroke="#B45309" strokeWidth="0.5" strokeOpacity="0.5" />

                {/* Base Rim details */}
                <path
                    d="M15 75 Q 50 88 85 75 L 85 68 Q 50 81 15 68 Z"
                    fill="url(#innerGradient)"
                    stroke="#B45309"
                    strokeWidth="1"
                />

                {/* Jewels on Tips */}
                <circle cx="10" cy="35" r="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" /> {/* Blue gem */}
                <circle cx="90" cy="35" r="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />

                <circle cx="50" cy="15" r="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" className="animate-pulse" /> {/* Red Top gem */}
                <circle cx="50" cy="15" r="1.5" fill="white" fillOpacity="0.6" /> {/* Shine */}

                {/* Center Main Gem */}
                <path
                    d="M50 50 L 56 60 L 50 70 L 44 60 Z"
                    fill="#EC4899"
                    stroke="#BE185D"
                    strokeWidth="1"
                />
                <circle cx="50" cy="60" r="1.5" fill="white" fillOpacity="0.7" />

                {/* Side decorations */}
                <circle cx="30" cy="65" r="2.5" fill="#10B981" stroke="#047857" strokeWidth="0.5" />
                <circle cx="70" cy="65" r="2.5" fill="#10B981" stroke="#047857" strokeWidth="0.5" />

            </svg>
        </div>
    );
};

export default Crown;
