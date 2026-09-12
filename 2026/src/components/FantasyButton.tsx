import { useEffect } from "react";
import { Link } from "react-router-dom";

type FantasyButtonVariant = "teal" | "amber" | "neon";

interface FantasyButtonProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: FantasyButtonVariant;
  className?: string;
  biomeIndex?: number;
}

const STYLE_ID = "fantasy-button-styles";

// Biome themes matching the 6 background videos
const biomeThemes = [
  // 0: Dimensional Rift (Purple Galaxy Portal)
  {
    gradient: "linear-gradient(180deg, #5B3DB8, #5B3DB899)",
    text: "#EDE9FE",
    border: "#A78BFA",
    shadow:
      "0 0 20px rgba(167, 139, 250, 0.35), inset 0 0 6px rgba(167, 139, 250, 0.2)",
    hoverShadow:
      "0 0 30px rgba(167, 139, 250, 0.55), inset 0 0 8px rgba(167, 139, 250, 0.35)",
  },
  // 1: Electromagnetic Storm (Lightning + Aurora)
  {
    gradient: "linear-gradient(180deg, #2E4B8F, #2E4B8F99)",
    text: "#E0F2FE",
    border: "#60A5FA",
    shadow:
      "0 0 20px rgba(96, 165, 250, 0.35), inset 0 0 6px rgba(96, 165, 250, 0.2)",
    hoverShadow:
      "0 0 30px rgba(34, 211, 238, 0.55), inset 0 0 8px rgba(34, 211, 238, 0.35)",
  },
  // 2: Gravity Anomaly (Floating City, Blue Void)
  {
    gradient: "linear-gradient(180deg, #3B82F6, #3B82F699)",
    text: "#F8FAFC",
    border: "#93C5FD",
    shadow:
      "0 0 20px rgba(147, 197, 253, 0.35), inset 0 0 6px rgba(147, 197, 253, 0.2)",
    hoverShadow:
      "0 0 30px rgba(147, 197, 253, 0.55), inset 0 0 8px rgba(255, 255, 255, 0.35)",
  },
  // 3: Reclaimed Nature City (Green Overgrown)
  {
    gradient: "linear-gradient(180deg, #15803D, #15803D99)",
    text: "#ECFDF5",
    border: "#4ADE80",
    shadow:
      "0 0 20px rgba(74, 222, 128, 0.35), inset 0 0 6px rgba(74, 222, 128, 0.2)",
    hoverShadow:
      "0 0 30px rgba(74, 222, 128, 0.55), inset 0 0 8px rgba(74, 222, 128, 0.35)",
  },
  // 4: Time Collapse (Sand, Ruins, Gears)
  {
    gradient: "linear-gradient(180deg, #B45309, #B4530999)",
    text: "#FFF7ED",
    border: "#FBBF24",
    shadow:
      "0 0 20px rgba(251, 191, 36, 0.35), inset 0 0 6px rgba(251, 191, 36, 0.2)",
    hoverShadow:
      "0 0 30px rgba(251, 191, 36, 0.55), inset 0 0 8px rgba(251, 191, 36, 0.35)",
  },
  // 5: Volcanic Rift (Lava + Magma Storm)
  {
    gradient: "linear-gradient(180deg, #9A3412, #9A341299)",
    text: "#FFF7ED",
    border: "#FB923C",
    shadow:
      "0 0 20px rgba(251, 146, 60, 0.35), inset 0 0 6px rgba(251, 146, 60, 0.2)",
    hoverShadow:
      "0 0 30px rgba(251, 146, 60, 0.55), inset 0 0 8px rgba(251, 146, 60, 0.35)",
  },
];

function FantasyButton({
  to,
  onClick,
  children,
  variant = "teal",
  className = "",
  biomeIndex,
}: FantasyButtonProps) {
  const theme =
    typeof biomeIndex === "number"
      ? biomeThemes[biomeIndex % biomeThemes.length]
      : null;
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes breathe {
        0% { filter: brightness(1) drop-shadow(0 0 2px var(--btn-border, rgba(90, 255, 220, 0.3))); }
        100% { filter: brightness(1.2) drop-shadow(0 0 8px var(--btn-border, rgba(90, 255, 220, 0.6))); }
      }

      @keyframes scan {
        0% { background-position: -100% 0; }
        100% { background-position: 200% 0; }
      }

      .ui-btn {
        --btn-bg: 
          radial-gradient(circle at 50% 40%, rgba(120, 255, 200, 0.7), transparent 50%),
          linear-gradient(135deg, #0d5c45, #0a3f31);
        --btn-text: #eafff6;
        --btn-border: rgba(90, 255, 220, 0.7);
        --btn-shadow: 
          inset 0 2px 3px rgba(255, 255, 255, 0.35),
          inset 0 -3px 6px rgba(0, 0, 0, 0.6),
          inset 0 0 0 2px rgba(7, 66, 70, 0.7),
          inset 0 8px 16px rgba(255, 255, 255, 0.18),
          0 6px 16px rgba(0, 0, 0, 0.35);
        --btn-hover-shadow: 
          inset 0 2px 3px rgba(255, 255, 255, 0.4),
          inset 0 -3px 6px rgba(0, 0, 0, 0.7),
          inset 0 0 0 2px rgba(7, 66, 70, 0.8),
          inset 0 10px 18px rgba(255, 255, 255, 0.2),
          0 10px 20px rgba(0, 0, 0, 0.4);
        --btn-hover-border: rgba(90, 255, 220, 0.8);
        
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--btn-text);
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        border: 1px solid var(--btn-border);
        background: 
          linear-gradient(105deg, transparent 20%, var(--btn-border) 25%, transparent 30%) -100% 0 / 200% 100% no-repeat,
          var(--btn-bg);
        box-shadow: var(--btn-shadow);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        backdrop-filter: blur(4px);
      }

      /* Corner accents */
      .ui-btn::before {
        content: "";
        position: absolute;
        top: 0; left: 0;
        width: 10px; height: 10px;
        border-top: 2px solid var(--btn-border);
        border-left: 2px solid var(--btn-border);
        transition: all 0.3s ease;
      }

      .ui-btn::after {
        content: "";
        position: absolute;
        bottom: 0; right: 0;
        width: 10px; height: 10px;
        border-bottom: 2px solid var(--btn-border);
        border-right: 2px solid var(--btn-border);
        transition: all 0.3s ease;
      }

      .ui-btn:hover {
        background-position: 200% 0;
        border-color: var(--btn-hover-border);
        box-shadow: var(--btn-hover-shadow);
        transform: translateY(-2px) scale(1.02) skewX(-20deg);
        text-shadow: 0 0 8px var(--btn-border);
      }

      .ui-btn:hover::before,
      .ui-btn:hover::after {
        width: 100%;
        height: 100%;
        border-color: var(--btn-border);
        opacity: 0.5;
        mix-blend-mode: screen;
      }

      /* Amber Variant defaults */
      .ui-btn--amber {
        --btn-bg: 
          radial-gradient(circle at 50% 40%, rgba(255, 235, 150, 0.6), transparent 50%),
          linear-gradient(135deg, #c57a15, #8a5a0a);
        --btn-text: #2a1c00;
        --btn-border: rgba(255, 220, 120, 0.9);
        --btn-shadow: 
          inset 0 2px 3px rgba(255, 255, 255, 0.35),
          inset 0 -3px 6px rgba(0, 0, 0, 0.6),
          inset 0 0 0 2px rgba(120, 65, 0, 0.5),
          inset 0 8px 16px rgba(255, 255, 255, 0.2),
          0 6px 16px rgba(0, 0, 0, 0.35);
        --btn-hover-shadow: 
          inset 0 2px 3px rgba(255, 255, 255, 0.4),
          inset 0 -3px 6px rgba(0, 0, 0, 0.7),
          inset 0 0 0 2px rgba(120, 65, 0, 0.6),
          inset 0 10px 18px rgba(255, 255, 255, 0.25),
          0 10px 20px rgba(0, 0, 0, 0.4);
        --btn-hover-border: rgba(255, 220, 120, 1);
      }

      /* Neon Variant defaults */
      .ui-btn--neon {
        --btn-bg: linear-gradient(135deg, rgba(0, 20, 40, 0.9), rgba(0, 10, 30, 0.95));
        --btn-text: #00ffff;
        --btn-border: rgba(0, 255, 255, 0.8);
        --btn-shadow: 
          inset 0 0 10px rgba(0, 255, 255, 0.1),
          0 0 10px rgba(0, 255, 255, 0.4),
          0 0 20px rgba(0, 255, 255, 0.2);
        --btn-hover-shadow: 
          inset 0 0 15px rgba(0, 255, 255, 0.2),
          0 0 20px rgba(0, 255, 255, 0.6),
          0 0 40px rgba(0, 255, 255, 0.4);
        --btn-hover-border: rgba(0, 255, 255, 1);
        animation: neonGlow 3s ease-in-out infinite;
      }

      @keyframes neonGlow {
        0%, 100% { box-shadow: 0 0 10px var(--btn-border), inset 0 0 20px rgba(0, 0, 0, 0.8); }
        50% { box-shadow: 0 0 20px var(--btn-border), inset 0 0 10px var(--btn-border); }
      }
    `;

    document.head.appendChild(style);
  }, []);

  // Biome theme styling
  const biomeStyle = theme
    ? ({
      "--btn-bg": theme.gradient,
      "--btn-text": theme.text,
      "--btn-border": theme.border,
      "--btn-shadow": theme.shadow,
      "--btn-hover-shadow": theme.hoverShadow,
      "--btn-hover-border": theme.border,
    } as React.CSSProperties)
    : undefined;

  if (to) {
    return (
      <Link
        to={to}
        className={`ui-btn ${!theme && variant === "amber" ? "ui-btn--amber" : ""} ${!theme && variant === "neon" ? "ui-btn--neon" : ""} 
           hidden lg:block
                          px-6 py-1.5 md:px-8 md:py-2
                          text-white font-moco font-bold tracking-wider text-base md:text-lg
                          uppercase
                          transition-all duration-300
                          skew-x-[-20deg]
                          cursor-target
                          text-center
          ${className}`}
        style={biomeStyle}
      >
        <span className="block skew-x-20">{children}</span>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`ui-btn ${!theme && variant === "amber" ? "ui-btn--amber" : ""} ${!theme && variant === "neon" ? "ui-btn--neon" : ""} 
           hidden lg:block
                          px-6 py-1.5 md:px-8 md:py-2
                          text-white font-moco font-bold tracking-wider text-base md:text-lg
                          uppercase
                          transition-all duration-300
                          skew-x-[-20deg]
                          cursor-target
                          text-center
          ${className}`}
      style={biomeStyle}
    >
      <span className="block skew-x-20">{children}</span>
    </button>
  );
}

export default FantasyButton;
