import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "secondary" | "outline" | "new" | "in_analysis" | "waiting" | "reopened";
  children?: React.ReactNode;
  className?: string;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold select-none transition-colors",
        {
          "bg-primary text-white": variant === "default",
          "bg-success/10 text-success": variant === "success",
          "bg-warning/10 text-warning": variant === "warning",
          "bg-danger/10 text-danger": variant === "danger",
          "bg-secondary/10 text-secondary": variant === "secondary",
          "text-muted border border-border": variant === "outline",
          "bg-blue-600 text-white": variant === "new",
          "bg-yellow-500 text-white": variant === "in_analysis",
          "bg-orange-500 text-white": variant === "waiting",
          "bg-purple-600 text-white": variant === "reopened",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
