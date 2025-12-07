"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0)
    const [phase, setPhase] = useState<"logo" | "loading" | "ready">("logo")

    useEffect(() => {
        // Phase 1: Logo reveal
        const logoTimer = setTimeout(() => setPhase("loading"), 800)

        // Phase 2: Progress animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    setPhase("ready")
                    return 100
                }
                return prev + Math.random() * 15 + 5
            })
        }, 150)

        // Phase 3: Complete and fade out
        const completeTimer = setTimeout(() => {
            onComplete()
        }, 2500)

        return () => {
            clearTimeout(logoTimer)
            clearInterval(progressInterval)
            clearTimeout(completeTimer)
        }
    }, [onComplete])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Scan line effect */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                        initial={{ top: "-2px" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`,
                        backgroundSize: "50px 50px"
                    }}
                />

                {/* Radial glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,transparent_70%)]" />

                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative mb-8"
                >
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary"
                        animate={{
                            textShadow: [
                                "0 0 20px rgba(34,211,238,0.5)",
                                "0 0 40px rgba(34,211,238,0.8)",
                                "0 0 20px rgba(34,211,238,0.5)"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        AIGARTH
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center text-primary/60 tracking-[0.5em] text-sm mt-2"
                    >
                        DATALABEL
                    </motion.p>
                </motion.div>

                {/* Loading indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase !== "logo" ? 1 : 0 }}
                    className="flex flex-col items-center gap-4 mt-8"
                >
                    {/* Progress bar container */}
                    <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>

                    {/* Status text */}
                    <motion.div
                        className="font-mono text-xs text-primary/50 tracking-wider"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {phase === "loading" && "INITIALIZING NEURAL NETWORK..."}
                        {phase === "ready" && "READY"}
                    </motion.div>

                    {/* Decorative elements */}
                    <div className="flex gap-2 mt-4">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-primary/30"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-primary/20" />
                <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-primary/20" />
                <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-primary/20" />
                <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-primary/20" />
            </motion.div>
        </AnimatePresence>
    )
}
