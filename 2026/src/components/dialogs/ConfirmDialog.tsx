import { createPortal } from "react-dom";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { IoClose } from "react-icons/io5";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "warning",
}: ConfirmDialogProps) {
  useBodyScrollLock(isOpen);
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
      case "danger":
        return {
          confirmBg: "bg-red-600",
          confirmHover: "hover:bg-red-700",
        };
      case "warning":
        return {
          confirmBg: "bg-amber-600",
          confirmHover: "hover:bg-amber-700",
        };
      case "info":
      default:
        return {
          confirmBg: "bg-[#5b21b6]",
          confirmHover: "hover:bg-[#4c1d95]",
        };
    }
  };

  const colors = getVariantColors();

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(0,255,255,0.15)] p-6 sm:p-8 relative overflow-hidden"
        style={glassCardStyle}
      >
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-white/75 hover:text-white transition-colors z-10 cursor-target"
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-base sm:text-2xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-white/80 mb-6">{message}</p>
        <div className="flex gap-2 sm:gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors cursor-target"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm rounded-lg ${colors.confirmBg} ${colors.confirmHover} text-white transition-colors cursor-target`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
