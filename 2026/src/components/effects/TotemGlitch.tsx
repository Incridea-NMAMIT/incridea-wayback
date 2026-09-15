import "./totem-glitch.css";

interface TotemGlitchProps {
  src: string;
  active: boolean;
}

export default function TotemGlitch({ src, active }: TotemGlitchProps) {
  return (
    <div className={`totem ${active ? "glitch-active" : ""}`}>
      {/* Base */}
      <img src={src} className="totem-img base" draggable={false} onContextMenu={(e) => e.preventDefault()} />

      {/* Red slice */}
      <img src={src} className="totem-img red" draggable={false} onContextMenu={(e) => e.preventDefault()} />

      {/* Blue slice */}
      <img src={src} className="totem-img blue" draggable={false} onContextMenu={(e) => e.preventDefault()} />
    </div>
  );
}
