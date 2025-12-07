import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    className?: string
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative rounded-xl border border-border/50 bg-card/30 backdrop-blur-xl",
                "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-foreground/[0.03] before:to-transparent before:pointer-events-none",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    )
}
