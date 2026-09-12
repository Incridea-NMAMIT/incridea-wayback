import LiquidGlassCard from './liquidglass/LiquidGlassCard';
import LazyImage from './LazyImage';

interface CoreTeamCardProps {
    imageSrc?: string;
    title?: string;
    subtitle?: string;
    className?: string;
    eager?: boolean;
    rootMargin?: string;
}

const CoreTeamCard: React.FC<CoreTeamCardProps> = ({
    imageSrc,
    title = "Card Title",
    subtitle = "Card Subtitle",
    className = "",
    eager = false,
    rootMargin = '200px',
}) => {
    return (
        <div className={`relative group w-full max-w-[18rem] ${className}`}>
            <div
                className="w-full min-h-[24rem] h-auto rounded-[40px] overflow-visible flex flex-col items-center pt-8 pb-6 px-4 relative z-10 gap-6"
            >
                { }
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center shrink-0">
                    <LiquidGlassCard className="w-full h-full !rounded-full !p-1 flex items-center justify-center overflow-hidden">
                        {imageSrc ? (
                            <LazyImage
                                src={imageSrc}
                                alt={title}
                                className="w-full h-full rounded-full object-cover transition-transform duration-500 ease-out scale-110 group-hover:scale-100"
                                containerClassName="w-full h-full rounded-full overflow-hidden"
                                draggable={false}
                                onContextMenu={(e) => e.preventDefault()}
                                eager={eager}
                                rootMargin={rootMargin}
                                threshold={0.01}
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-white/10 to-transparent" />
                        )}
                    </LiquidGlassCard>
                </div>

                { }
                <div className="w-full shrink-0 flex flex-col items-center gap-3">
                    <div className="
                        w-full
                        px-4 py-3
                        bg-[#5b21b6]
                        rounded-md
                        skew-x-[-10deg]
                        shadow-lg
                        group-hover:bg-[#4c1d95]
                        transition-all duration-300
                        flex items-center justify-center
                    ">
                        <h3 className="text-white font-bold tracking-wider text-xl leading-tight text-center font-moco uppercase skew-x-[10deg]">
                            {title}
                        </h3>
                    </div>

                    { }
                    <p
                        className="text-white/80 text-[10px] font-semibold uppercase tracking-widest text-center font-moco"

                    >
                        {subtitle}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default CoreTeamCard;
