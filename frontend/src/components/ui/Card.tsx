import * as React from "react";
import { cn } from "@/utils/cn";

import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-[40px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
  {
    variants: {
      variant: {
        default: "border border-border-strong bg-[#F8F8F8] hover:bg-surface hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]",
        glass: "border border-white/50 bg-white/70 backdrop-blur-3xl hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]",
        elevated: "border border-border-strong bg-surface shadow-[0_20px_40px_rgba(0,0,0,0.08)]",
        ai: "border-none bg-[#F4F4F6]",
      }
    },
    defaultVariants: {
      variant: "default",
    }
  }
);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  elevated?: boolean; // legacy
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, elevated, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant: elevated ? "elevated" : variant }),
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 p-6 md:p-8 pb-4", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-display font-semibold leading-none tracking-tight text-neutral-900", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 md:p-8 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";
