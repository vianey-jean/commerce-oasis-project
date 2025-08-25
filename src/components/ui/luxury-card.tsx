import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const luxuryCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "shadow-md hover:shadow-lg hover:-translate-y-1",
        elevated: "shadow-lg hover:shadow-xl hover:-translate-y-2",
        luxury: "shadow-xl hover:shadow-luxury hover:-translate-y-2 bg-gradient-surface border-primary/20",
        glass: "glass backdrop-blur-md border-white/20 hover:bg-white/30 dark:hover:bg-black/30",
        glow: "shadow-glow hover:shadow-luxury hover:-translate-y-1 animate-luxury-glow",
        interactive: "hover-lift cursor-pointer hover:shadow-luxury",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6", 
        lg: "p-8",
        xl: "p-10",
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface LuxuryCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof luxuryCardVariants> {}

const LuxuryCard = React.forwardRef<HTMLDivElement, LuxuryCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(luxuryCardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
LuxuryCard.displayName = "LuxuryCard"

const LuxuryCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
LuxuryCardHeader.displayName = "LuxuryCardHeader"

const LuxuryCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-heading font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
LuxuryCardTitle.displayName = "LuxuryCardTitle"

const LuxuryCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
LuxuryCardDescription.displayName = "LuxuryCardDescription"

const LuxuryCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
LuxuryCardContent.displayName = "LuxuryCardContent"

const LuxuryCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
LuxuryCardFooter.displayName = "LuxuryCardFooter"

export { 
  LuxuryCard, 
  LuxuryCardHeader, 
  LuxuryCardFooter, 
  LuxuryCardTitle, 
  LuxuryCardDescription, 
  LuxuryCardContent,
  luxuryCardVariants 
}