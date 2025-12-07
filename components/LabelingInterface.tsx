"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { ArrowLeftIcon, CheckIcon, ShieldIcon, ZapIcon, AlertTriangleIcon, ActivityIcon } from "lucide-react"
import { TASKS, Task } from "@/lib/data"
import { qubic } from "@/lib/qubic"
import Earnings from "./Earnings"


interface LabelingInterfaceProps {
    walletId: string
    onBack: () => void
}

function TiltTaskCard({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x, { stiffness: 200, damping: 30 })
    const mouseYSpring = useSpring(y, { stiffness: 200, damping: 30 })

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        x.set(mouseX / rect.width - 0.5)
        y.set(mouseY / rect.height - 0.5)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

function AnimatedButton({
    children,
    onClick,
    disabled,
    variant,
}: {
    children: React.ReactNode
    onClick: () => void
    disabled: boolean
    variant: "primary" | "secondary"
}) {
    const baseColors = variant === "primary"
        ? "bg-primary/10 border-primary/50 text-primary"
        : "bg-secondary/10 border-secondary/50 text-secondary"

    const hoverColors = variant === "primary"
        ? "hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
        : "hover:bg-secondary/20 hover:border-secondary hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"

    const glowClass = !disabled && variant === "primary" ? "animate-button-glow" : ""

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            className={`h-16 text-lg font-semibold border-2 rounded-xl disabled:opacity-50 transition-all ${baseColors} ${hoverColors} ${glowClass}`}
            whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -3 }}
            whileTap={{ scale: disabled ? 1 : 0.97 }}
        >
            {children}
        </motion.button>
    )
}

export function LabelingInterface({ walletId, onBack }: LabelingInterfaceProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // New State
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [reputation, setReputation] = useState(100)
    const [unclaimedEarnings, setUnclaimedEarnings] = useState(0) // Logic Change: Accumulate locally first
    const [feedback, setFeedback] = useState<"success" | "failure" | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [tasksCompleted, setTasksCompleted] = useState(0)

    // Load task ONLY if category is selected
    useEffect(() => {
        if (selectedCategory) {
            loadNewTask();
        }
    }, [selectedCategory]);

    const loadNewTask = () => {
        // Filter by category
        const categoryTasks = TASKS.filter(t => t.category === selectedCategory);
        if (categoryTasks.length > 0) {
            const random = categoryTasks[Math.floor(Math.random() * categoryTasks.length)];
            setCurrentTask(random);
            setIsScanning(true);
            setTimeout(() => setIsScanning(false), 2000);
        }
    }

    const handleAnswer = async (answer: string) => {
        if (!currentTask) return;

        // Reputation lockout - workers with < 20% reputation cannot earn
        const isLockedOut = reputation < 20;

        const isCorrect = answer === currentTask.correctOption;

        if (isCorrect) {
            setFeedback("success")
            setReputation((prev) => Math.min(100, prev + 2))
            // Only earn if not locked out
            if (!isLockedOut) {
                setUnclaimedEarnings((prev) => prev + 100)
            }
        } else {
            setFeedback("failure")
            setReputation((prev) => Math.max(0, prev - 20))
        }

        setTimeout(() => {
            setFeedback(null)
            setTasksCompleted(prev => prev + 1);
            loadNewTask();
        }, 1500)
    };

    const getReputationColor = () => {
        if (reputation >= 80) return "text-success"
        if (reputation >= 50) return "text-warning"
        return "text-destructive"
    }

    const getReputationBarColor = () => {
        if (reputation >= 80) return "bg-success"
        if (reputation >= 50) return "bg-warning"
        return "bg-destructive"
    }

    // --- VIEW: CATEGORY SELECTION ---
    if (!selectedCategory) {
        return (
            <div className="relative min-h-screen flex flex-col">
                <header className="relative z-10 flex items-center justify-between px-4 py-3 lg:px-8 border-b border-border/30 backdrop-blur-sm bg-background/30">
                    <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Exit System
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-primary font-mono tracking-widest">
                            <ShieldIcon className="w-4 h-4" />
                            <span>WORKER HUB</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex items-center justify-center p-6" style={{ perspective: "1000px" }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl place-items-center">
                        {[
                            { id: "Medical AI", icon: ActivityIcon, color: "text-success", desc: "Label X-Rays & MRIs" },
                            { id: "Autonomous Driving", icon: ZapIcon, color: "text-primary", desc: "Identify Traffic Signs" },
                            { id: "Content Moderation", icon: ShieldIcon, color: "text-secondary", desc: "Filter Harmful Content" }
                        ].map((cat) => (
                            <motion.div key={cat.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                                <GlassCard
                                    className="p-8 h-64 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors border-2 hover:border-primary/50 group"
                                    onClick={() => setSelectedCategory(cat.id)}
                                >
                                    <cat.icon className={`w-16 h-16 ${cat.color} mb-4 group-hover:animate-pulse`} />
                                    <h3 className="text-xl font-bold mb-2">{cat.id}</h3>
                                    <p className="text-sm text-muted-foreground">{cat.desc}</p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // --- VIEW: TASK INTERFACE ---
    if (!currentTask) return null;

    return (
        <div className="relative min-h-screen flex flex-col">
            <Earnings
                amount={unclaimedEarnings}
                workerWalletId={walletId}
                onClaimSuccess={() => {
                    setUnclaimedEarnings(0); // Reset after successful broadcast
                    setReputation(prev => Math.min(100, prev + 5)); // Bonus rep for claiming
                }}
            />
            {/* HUD Header */}
            <header className="relative z-10 flex items-center justify-between px-4 py-3 lg:px-8 border-b border-border/30 backdrop-blur-sm bg-background/30">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => setSelectedCategory(null)} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Categories
                    </Button>
                </div>

                <div className="flex items-center gap-6">
                    <motion.div
                        className="flex items-center gap-2"
                        key={unclaimedEarnings}
                        initial={{ scale: 1.2, color: "#22d3ee" }}
                        animate={{ scale: 1, color: "#ffffff" }}
                    >
                        <ZapIcon className="w-4 h-4 text-primary" />
                        <span className="font-mono text-sm text-foreground">{unclaimedEarnings.toLocaleString()} QU</span>
                    </motion.div>

                    {/* Reputation */}
                    <div className="flex items-center gap-3">
                        <ShieldIcon className={`w-4 h-4 ${getReputationColor()}`} />
                        <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                            <motion.div
                                className={`h-full ${getReputationBarColor()}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${reputation}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <span className={`font-mono text-sm ${getReputationColor()}`}>{reputation}%</span>
                    </div>
                </div>
            </header>

            {/* Session ID */}
            <div className="relative z-10 px-4 py-2 lg:px-8 flex justify-between">
                <p className="text-xs font-mono text-muted-foreground/40">
                    SESSION: {walletId.substring(0, 8)}...
                </p>
                <p className="text-xs font-mono text-primary/60 uppercase tracking-wider">
                    Active Protocol: {currentTask.category}
                </p>
            </div>

            {/* Main Content */}
            <div
                className="relative z-10 flex-1 flex items-center justify-center px-4 py-8"
                style={{ perspective: "1000px" }}
            >
                <TiltTaskCard className="w-full max-w-3xl">
                    <GlassCard className="p-6 lg:p-8">
                        {/* Task Counter */}
                        <div className="flex items-center justify-between mb-6">
                            <motion.span
                                className="text-sm font-mono text-muted-foreground"
                                key={tasksCompleted}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                TASK #{tasksCompleted + 1}
                            </motion.span>
                            <span className="flex items-center gap-2 text-xs font-mono text-success">
                                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                LIVE FEED
                            </span>
                        </div>

                        {/* Image Container with Scanning Effect */}
                        <motion.div
                            className="relative aspect-video rounded-lg overflow-hidden mb-6 border border-border/50 bg-black/50"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={currentTask.id}
                        >
                            <img
                                src={currentTask.imageUrl}
                                alt="Task image"
                                className="w-full h-full object-contain"
                            />

                            <AnimatePresence>
                                {isScanning && (
                                    <motion.div
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-background/80 flex items-center justify-center"
                                    >
                                        <div className="absolute inset-0 overflow-hidden">
                                            <motion.div
                                                className="absolute left-0 right-0 h-1 bg-primary/50 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                                                animate={{ top: ["0%", "100%"] }}
                                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                            />
                                        </div>
                                        <motion.span
                                            className="text-primary font-mono text-sm tracking-[0.2em]"
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                                        >
                                            VERIFYING CONSENSUS...
                                        </motion.span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Question */}
                        <motion.h2
                            className="text-xl lg:text-2xl font-semibold text-center mb-8 text-foreground"
                            key={currentTask.question}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {currentTask.question}
                        </motion.h2>

                        {/* Answer Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <AnimatedButton
                                onClick={() => handleAnswer(currentTask.options[0])}
                                disabled={feedback !== null || isScanning}
                                variant="primary"
                            >
                                {currentTask.options[0]}
                            </AnimatedButton>
                            <AnimatedButton
                                onClick={() => handleAnswer(currentTask.options[1])}
                                disabled={feedback !== null || isScanning}
                                variant="secondary"
                            >
                                {currentTask.options[1]}
                            </AnimatedButton>
                        </div>
                    </GlassCard>
                </TiltTaskCard>
            </div>

            <AnimatePresence>
                {feedback === "success" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                    >
                        {/* Particle burst */}
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="w-24 h-24 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mx-auto mb-4"
                            >
                                <CheckIcon className="w-12 h-12 text-success" />
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl font-bold text-success"
                            >
                                +100 QU
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-muted-foreground mt-2"
                            >
                                Consensus Secured
                            </motion.p>
                        </div>
                    </motion.div>
                )}

                {feedback === "failure" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-destructive/10 backdrop-blur-sm"
                    >
                        <motion.div className="text-center" animate={{ x: [-5, 5, -5, 5, 0] }} transition={{ duration: 0.4 }}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-24 h-24 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center mx-auto mb-4"
                            >
                                <AlertTriangleIcon className="w-12 h-12 text-destructive" />
                            </motion.div>
                            <motion.p
                                className="text-3xl font-bold text-destructive font-mono"
                                animate={{
                                    textShadow: [
                                        "2px 0 #ff0000, -2px 0 #00ff00",
                                        "-2px 0 #ff0000, 2px 0 #00ff00",
                                        "2px 0 #ff0000, -2px 0 #00ff00",
                                    ],
                                }}
                            >
                                QUALITY CHECK FAILED
                            </motion.p>
                            <p className="text-muted-foreground mt-2 text-sm">Incorrect answer • Reputation -20%</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
