import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "~/lib/utils";

type Variant = "solid" | "ghost" | "outlined";

const MetallicButton = ({
  variant = "solid",
  children,
  className,
  ...props
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shine = shineRef.current;

    const tl = gsap.timeline({ paused: true });
    tl.fromTo(
      shine,
      {
        x: "-100%",
      },
      {
        x: "100%",
        duration: 0.5,
        ease: "power1.inOut",
      },
    );

    const button = buttonRef.current;
    if (button) {
      button.addEventListener("mouseenter", () => {
        tl.play(0);
      });
    }
    if (button) {
      button.removeEventListener("mouseenter", function () {
        tl.play(0);
      });
    }
    return () => {
      button?.removeEventListener("mouseenter", function () {
        tl.play(0);
      });
    };
  }, []);

  const baseStyles =
    "relative overflow-hidden md:px-16 md:py-4 px-8 py-2 rounded-3xl text-lg font-medium transition-all duration-100 ease-in-out transform";

  const variants = {
    solid: `
      ${baseStyles}
      bg-gradient-to-b from-[#E3A567] via-[#B87333] to-[#965A1F]
      shadow-[0_1px_2px_rgba(255,255,255,0.4)_inset,0_-1px_2px_rgba(0,0,0,0.2)_inset,0_1px_0px_#C68E4F,0_3px_0px_rgba(0,0,0,0.2),0_4px_2px_rgba(0,0,0,0.1),0_6px_4px_rgba(0,0,0,0.1)]
      active:translate-y-0.5
      active:shadow-[0_1px_2px_rgba(255,255,255,0.4)_inset,0_-1px_2px_rgba(0,0,0,0.2)_inset,0_1px_0px_#C68E4F,0_1px_0px_rgba(0,0,0,0.2),0_2px_2px_rgba(0,0,0,0.1),0_3px_4px_rgba(0,0,0,0.1)]
    `,
    ghost: `
      ${baseStyles}
      bg-transparent
      border-2 border-[#B87333]
      shadow-[0_0_10px_rgba(184,115,51,0.2),0_0_20px_rgba(184,115,51,0.1)]
      hover:bg-gradient-to-b hover:from-[rgba(227,165,103,0.1)] hover:via-[rgba(184,115,51,0.1)] hover:to-[rgba(150,90,31,0.1)]
      hover:shadow-[0_0_15px_rgba(184,115,51,0.3),0_0_30px_rgba(184,115,51,0.2)]
      active:translate-y-0.5
      active:shadow-[0_0_8px_rgba(184,115,51,0.2),0_0_16px_rgba(184,115,51,0.1)]
    `,
    outlined: `
      ${baseStyles}
      bg-gradient-to-b from-[rgba(227,165,103,0.1)] via-[rgba(184,115,51,0.1)] to-[rgba(150,90,31,0.1)]
      border-2 border-[#B87333]
      shadow-[0_1px_2px_rgba(255,255,255,0.1)_inset,0_-1px_2px_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.2)]
      active:translate-y-0.5
      active:shadow-[0_1px_2px_rgba(255,255,255,0.1)_inset,0_-1px_2px_rgba(0,0,0,0.1)_inset,0_1px_2px_rgba(0,0,0,0.2)]
    `,
  };

  const textVariants = {
    solid:
      "bg-gradient-to-b from-[#FFF8F0] to-[#FFE5CC] bg-clip-text text-transparent",
    ghost:
      "bg-gradient-to-b from-[#E3A567] to-[#B87333] bg-clip-text text-transparent",
    outlined:
      "bg-gradient-to-b from-[#E3A567] to-[#B87333] bg-clip-text text-transparent",
  };

  return (
    <button
      ref={buttonRef}
      className={cn(variants[variant as keyof typeof variants], className)}
      {...props}
    >
      <span
        className={cn(
          `relative z-10 select-none ${textVariants[variant]}`,
          className,
        )}
      >
        {children}
      </span>
      <div
        ref={shineRef}
        className="absolute top-0 left-[-50%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ pointerEvents: "none" }}
      />
    </button>
  );
};

export default MetallicButton;
