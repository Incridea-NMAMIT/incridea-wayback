import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type PropsWithChildren,
} from "react";
import "./LiquidGlassCard.css";

type ColorScheme = "dark" | "orange" | "purple" | "light";

type LiquidGlassCardProps<T extends ElementType> = PropsWithChildren<{
  className?: string;
  contentClassName?: string;
  colorScheme?: ColorScheme;
  as?: T;
}> &
  ComponentPropsWithoutRef<T>;

export default function LiquidGlassCard<T extends ElementType = "div">({
  children,
  className = "",
  contentClassName = "",
  colorScheme = "dark",
  as,
  ...rest
}: LiquidGlassCardProps<T>) {
  const Component = as || (rest.onClick ? "button" : "div");

  return (
    <>
      <Component
        className={`card card--${colorScheme} ${className}`}
        {...(rest as any)}
      >
        <div className={`card__content ${contentClassName}`}>{children}</div>
      </Component>

      <svg style={{ display: "none" }}>
        <filter id="displacementFilter">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.01"
            numOctaves="2"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </>
  );
}