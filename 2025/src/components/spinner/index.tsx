import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { BiLoaderAlt } from "react-icons/bi";

const spinnerStyles = cva(
  "flex h-full w-full items-center justify-center mx-auto my-auto",
  {
    variants: {
      size: {
        small: "text-2xl",
        medium: "text-4xl ",
        large: "text-6xl",
      },
      intent: {
        primary: "text-primary-500",
        secondary: "text-secondary-500",
        black: "text-black",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "medium",
      intent: "primary",
    },
  },
);

export type Props = {
  className?: string;
} & VariantProps<typeof spinnerStyles>;

const Spinner = ({ size, intent, className }: Props) => {
  return (
    <div className={`${className} ${spinnerStyles({ size, intent })}`}>
      <BiLoaderAlt className="animate-spin" />
    </div>
  );
};

export default Spinner;
