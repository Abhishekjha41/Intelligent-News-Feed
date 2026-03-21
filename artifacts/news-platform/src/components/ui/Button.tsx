import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "default" | "outline" | "ghost" | "glow" | "glass"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,240,255,0.3)]": variant === "default",
            "border border-white/10 bg-white/5 hover:bg-white/10 text-foreground backdrop-blur-md": variant === "glass",
            "border border-primary/50 text-primary hover:bg-primary/10": variant === "outline",
            "hover:bg-white/10 text-foreground": variant === "ghost",
            "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] border-0": variant === "glow",
            "h-10 py-2 px-4": size === "default",
            "h-9 px-3 text-sm": size === "sm",
            "h-12 px-8 text-lg": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
