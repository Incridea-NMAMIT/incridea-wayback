import { IoClose } from "react-icons/io5";

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  variant?: "error" | "warning" | "info" | "success";
}

export default function AlertDialog({
  isOpen,
  title,
  message,
  buttonText = "OK",
  onClose,
  variant = "info",
}: AlertDialogProps) {
  if (!isOpen) return null;

  const glassCardStyle = {
    borderRadius: "1.75rem",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    background: "rgba(12, 12, 12, 0.96)",
    boxShadow: `
      inset 0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.22)
    `,
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  } as const;

  const getVariantColors = () => {
    switch (variant) {
      case "error":
        return {
          buttonBg: "bg-red-600",
          buttonHover: "hover:bg-red-700",
        };
      case "warning":
        return {
          buttonBg: "bg-amber-600",
          buttonHover: "hover:bg-amber-700",
        };
      case "success":
        return {
          buttonBg: "bg-green-600",
          buttonHover: "hover:bg-green-700",
        };
      case "info":
      default:
        return {
          buttonBg: "bg-[#5b21b6]",
          buttonHover: "hover:bg-[#4c1d95]",
        };
    }
  };

  const colors = getVariantColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(0,255,255,0.15)] p-6 sm:p-8 relative overflow-hidden"
        style={glassCardStyle}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/75 hover:text-white transition-colors z-10 cursor-target"
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-base sm:text-2xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-white/80 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm rounded-lg ${colors.buttonBg} ${colors.buttonHover} text-white transition-colors cursor-target`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
