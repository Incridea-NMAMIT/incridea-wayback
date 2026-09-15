import React, { useEffect, useRef, type ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import gsap from "gsap";

type HomeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    children: React.ReactNode;
  };

const buttonVariants = cva(
  "flex w-full hover:scale-110 transition-all duration-300 items-center h-14 px-10 md:px-14 justify-center gap-2 rounded-full text-2xl tracking-wider relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[#186C16] to-[#186C16] via-primary-950 text-white",
        ghost: "bg-transparent/40 text-white backdrop-blur-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export default function HomeButton({
  className,
  children,
  variant,
  ...props
}: HomeButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shine = shineRef.current;

    const tl = gsap.timeline({ paused: true });
    tl.fromTo(
      shine,
      { x: "-100%" },
      { x: "100%", duration: 0.5, ease: "power1.inOut" },
    );

    const button = buttonRef.current;
    if (button) {
      button.addEventListener("mouseenter", () => {
        tl.play(0); // Ensuring it's not returning a Promise
      });

      return () => {
        button.removeEventListener("mouseenter", () => {
          tl.play(0);
        });
      };
    }
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        {...props}
        className={cn(buttonVariants({ variant }), className)}
        style={{
          clipPath:
            "polygon(0% 55%, 15% 0%, 85% 0%, 100% 55%, 85% 100%, 15% 100%)",
          userSelect: "none",
        }}
      >
        <span style={{ userSelect: "none" }}>{children}</span>
        <div
          ref={shineRef}
          className="absolute top-0 left-[-50%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent z-10"
          style={{ pointerEvents: "none", userSelect: "none" }}
        />
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 230 66"
          fill="none"
          style={{ transform: "scale(0.99)", userSelect: "none" }}
        >
          <defs>
            <style>{`
          .a {
            fill: rgba(0,0,0,0);
            backdrop-filter: blur(var(--blur-3xl));
            user-select: none; // Prevents selection
          }
        `}</style>
          </defs>
          <linearGradient
            id="strokeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#186C16" />
            <stop offset="50%" stopColor="primary-950" />
            <stop offset="100%" stopColor="#186C16" />
          </linearGradient>
          <path
            className="a"
            d="M31 0H196L230 36L196 66H31L0 36L31 0Z"
            fill="currentColor"
            stroke={
              variant == "ghost" ? "url(#strokeGradient)" : "rgba(0,0,0,0)"
            }
            strokeWidth="6"
            style={{ userSelect: "none" }}
          />
        </svg>
      </button>
    </>
  );
}
