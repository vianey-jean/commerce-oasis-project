import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const luxuryButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-gradient-primary text-primary-foreground shadow-lg hover:shadow-luxury hover:-translate-y-0.5 btn-luxury",
        secondary: "bg-gradient-secondary text-secondary-foreground shadow-lg hover:shadow-glow hover:-translate-y-0.5",
        luxury: "bg-gradient-luxury text-white shadow-xl hover:shadow-luxury hover:-translate-y-1 animate-luxury-glow",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-glow",
        ghost: "text-primary hover:bg-primary-muted hover:text-primary-dark",
        destructive: "bg-destructive text-destructive-foreground shadow-lg hover:shadow-lg hover:-translate-y-0.5",
        success: "bg-success text-success-foreground shadow-lg hover:shadow-lg hover:-translate-y-0.5",
        glass: "glass backdrop-blur-md text-foreground hover:bg-white/30 dark:hover:bg-black/30 border border-white/20",
      },
      size: {
        sm: "h-9 rounded-md px-3",
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface LuxuryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof luxuryButtonVariants> {
  asChild?: boolean
  loading?: boolean
}

const LuxuryButton = React.forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(luxuryButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </Comp>
    )
  }
)
LuxuryButton.displayName = "LuxuryButton"

export { LuxuryButton, luxuryButtonVariants }