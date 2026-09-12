import { type ReactNode, type MouseEventHandler } from "react";

interface NavActionButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  title?: string;
  disabled?: boolean;
  width?: string;
  height?: string;
  bgColor?: string;
  hoverBgColor?: string;
  size?: "default" | "compact" | "mini" | "micro";
}

export default function NavActionButton({
  onClick,
  children,
  title,
  disabled = false,
  width = "w-full md:w-auto",
  height = "",
  bgColor = "bg-[#5b21b6]",
  hoverBgColor = "hover:bg-[#4c1d95]",
  size = "default",
}: NavActionButtonProps) {
  const paddingClasses =
    size === "micro"
      ? "px-[2vw] py-[0.3vh] sm:px-[1.5vw] sm:py-[0.4vh] md:px-4 md:py-1 lg:px-6 lg:py-1.5"
      : size === "mini"
        ? "px-[2.5vw] py-[0.5vh] sm:px-[2vw] sm:py-[0.6vh] md:px-6 md:py-1.5 lg:px-8 lg:py-2"
        : size === "compact"
          ? "px-[3vw] py-[0.8vh] sm:px-[2.5vw] sm:py-[1vh] md:px-12 md:py-2 lg:px-16 lg:py-3"
          : "px-[4vw] py-[1vh] sm:px-[3vw] sm:py-[1.2vh] md:px-16 md:py-3 lg:px-20 lg:py-4";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${width} ${height || paddingClasses} inline-flex items-center justify-center
        ${!height ? "" : paddingClasses}
        ${bgColor} ${hoverBgColor}
        text-white font-moco font-bold tracking-wider text-base sm:text-lg
        uppercase whitespace-nowrap
        transition-all duration-300
        skew-x-[-10deg]
        cursor-target
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={title}
    >
      <span className="block skew-x-10 whitespace-nowrap">{children}</span>
    </button>
  );
}
