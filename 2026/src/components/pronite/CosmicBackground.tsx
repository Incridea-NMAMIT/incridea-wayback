import React from "react";
import "./FinalReveal.css";

const CosmicBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            {/* Central Spotlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-radial-gradient from-primary/20 to-transparent blur-[100px] spotlight-pulse rounded-full opacity-50"></div>

            <div className="cosmic-dust animate-drift top-1/4 left-[-10%] opacity-20"></div>
            <div className="cosmic-dust animate-drift top-2/3 left-[-5%] opacity-40 [animation-delay:4s]"></div>
            <div className="cosmic-dust animate-drift top-1/2 left-[-15%] opacity-30 [animation-delay:8s]"></div>
            <div className="cosmic-dust animate-drift top-1/3 left-[-20%] opacity-10 [animation-delay:12s]"></div>
            <div className="star-particle w-1 h-1 top-10 left-[10%] animate-pulse"></div>
            <div className="star-particle w-0.5 h-0.5 top-40 left-[25%] opacity-20 animate-pulse [animation-delay:1s]"></div>
            <div className="star-particle w-1.5 h-1.5 top-60 left-[80%] opacity-40 animate-pulse [animation-delay:2s]"></div>
            <div className="star-particle w-1 h-1 top-20 left-[60%] animate-pulse [animation-delay:0.5s]"></div>
            <div className="star-particle w-0.5 h-0.5 top-[80%] left-[45%] opacity-10 animate-pulse [animation-delay:1.5s]"></div>
            <div className="star-particle w-1 h-1 top-[70%] left-[15%] animate-pulse [animation-delay:2.5s]"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow [animation-delay:2s]"></div>
        </div>
    );
};

export default CosmicBackground;
