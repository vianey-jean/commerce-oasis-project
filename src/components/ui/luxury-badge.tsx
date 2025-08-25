import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const luxuryBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm hover:shadow-glow",
        secondary: "border-transparent bg-secondary text-secondary-foreground shadow-sm hover:shadow-glow",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:shadow-lg",
        success: "border-transparent bg-success text-success-foreground shadow-sm hover:shadow-lg",
        warning: "border-transparent bg-warning text-warning-foreground shadow-sm hover:shadow-lg",
        outline: "border-border text-foreground hover:bg-accent hover:text-accent-foreground",
        luxury: "bg-gradient-luxury text-white shadow-lg hover:shadow-luxury animate-shimmer",
        sale: "bg-gradient-primary text-white shadow-lg animate-pulse-luxury",
        new: "bg-gradient-secondary text-secondary-foreground shadow-lg",
        hot: "bg-destructive text-destructive-foreground shadow-lg animate-bounce-subtle",
        premium: "border-primary bg-primary-muted text-primary shadow-sm hover:bg-primary hover:text-primary-foreground",
        glass: "glass backdrop-blur-md text-foreground border-white/20",
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface LuxuryBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof luxuryBadgeVariants> {}

function LuxuryBadge({ className, variant, size, ...props }: LuxuryBadgeProps) {
  return (
    <div className={cn(luxuryBadgeVariants({ variant, size }), className)} {...props} />
  )
}

export { LuxuryBadge, luxuryBadgeVariants }