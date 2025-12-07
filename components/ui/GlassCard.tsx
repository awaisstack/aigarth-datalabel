"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={hoverEffect ? { scale: 1.02, boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)" } : undefined}
            className={cn(
                "glass-panel rounded-2xl p-6 relative overflow-hidden",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/10 before:to-transparent before:pointer-events-none",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
