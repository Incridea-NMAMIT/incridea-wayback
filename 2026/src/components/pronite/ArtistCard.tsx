import React from "react";
import "./FinalReveal.css";

interface ArtistCardProps {
  name: React.ReactNode;

  image: string;
  isHeadliner?: boolean;
  className?: string; // For grid col span and animations
  animationStyle?: React.CSSProperties; // For inline delays
  imageClassName?: string; // For custom image styling
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  name,

  image,
  isHeadliner = false,
  className = "",
  animationStyle = {},
  imageClassName = "",
}) => {
  if (isHeadliner) {
    return (
      <div
        className={`${className} animate-fade-up h-full`}
        style={animationStyle}
      >
        <div className="w-full h-full animate-float">
          <div className="h-full glass-card headliner-card focal-card breathing-glow rounded-3xl overflow-hidden relative group z-20 flex flex-col justify-end">
            <div className="absolute inset-0 z-0">
              <img
                alt="Main Headliner"
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-all duration-700"
                src={image}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
            </div>
            <div className="relative z-10 w-full p-4 md:p-8 text-center">
              <h3 className="text-3xl md:text-6xl font-black text-white mb-1 md:mb-3 tracking-tighter text-glow drop-shadow-lg leading-none">
                {name}
              </h3>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${className} animate-fade-up h-full`}
      style={animationStyle}
    >
      <div className="w-full h-full animate-float">
        <div className="h-full glass-card rounded-2xl overflow-hidden relative group flex flex-col justify-end">
          <div className="absolute inset-0 z-0">
            <img
              className={`w-full h-full grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700 ${imageClassName ? imageClassName : "object-cover"}`}
              src={image}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/10 to-transparent"></div>
          </div>
          <div className="relative z-10 w-full p-3 md:p-6 text-center">
            <h3 className="text-lg md:text-2xl font-bold text-white leading-tight drop-shadow-lg">
              {name}
            </h3>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
