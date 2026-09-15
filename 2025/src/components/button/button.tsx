import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br font-semibold from-secondary-500 to-secondary-700 text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-gradient-to-br from-red-500 via-red-700 to-red-600  text-destructive-foreground shadow-sm",
        outline:
          "border border-input bg-transparent text-white border-secondary-500 shadow-sm hover:bg-accent-7+00 hover:text-accent-foreground",
        secondary:
          "bg-accent-700/80 text-secondary-foreground shadow-sm hover:bg-accent-600/80 border-2 border-primary-500",
        ghost: "hover:bg-accent-500/10 bg-transparent border-2 border-secondary-500 backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto px-6 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          "hover:scale-[105%] transition-all duration-300",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
