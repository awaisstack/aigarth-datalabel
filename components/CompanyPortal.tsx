"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/glass-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Category, qubic, TREASURY_WALLETS } from "@/lib/qubic"
import { useQubicTransaction } from "@/hooks/useQubicTransaction"
import {
    ArrowLeftIcon,
    UploadIcon,
    WalletIcon,
    ActivityIcon,
    UsersIcon,
    DatabaseIcon,
    HeartPulseIcon,
    CarIcon,
    ShieldAlertIcon,
    CopyIcon,
    CheckIcon,
    PlusIcon,
} from "lucide-react"

interface CompanyPortalProps {
    onBack: () => void
}

const STATS_DEFAULT = {
    totalLabels: 1_234_567,
    activeWorkers: 8_432,
    accuracy: 97.8,
}

const CATEGORIES_DATA = [
    { id: "Medical AI" as Category, name: "Medical Imaging", icon: HeartPulseIcon, tasks: 45_230, color: "text-success" },
    { id: "Autonomous Driving" as Category, name: "Autonomous Driving", icon: CarIcon, tasks: 89_102, color: "text-primary" },
    { id: "Content Moderation" as Category, name: "Content Moderation", icon: ShieldAlertIcon, tasks: 23_456, color: "text-secondary" },
]

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
                x.set(0)
                y.set(0)
            }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

function AnimatedStatCard({
    icon: Icon,
    label,
    value,
    color,
    delay,
}: {
    icon: React.ElementType
    label: string
    value: string | number
    color: string
    delay: number
}) {
    return (
        <TiltCard>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
                <GlassCard className="p-4 h-full">
                    <div className="flex items-center gap-3 mb-2">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay }}
                        >
                            <Icon className={`w-5 h-5 ${color}`} />
                        </motion.div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
                    </div>
                    <motion.p
                        className="text-2xl font-bold text-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: delay + 0.2 }}
                    >
                        {typeof value === "number" ? value.toLocaleString() : value}
                    </motion.p>
                </GlassCard>
            </motion.div>
        </TiltCard>
    )
}

export function CompanyPortal({ onBack }: CompanyPortalProps) {
    const { sendTransaction, isProcessing } = useQubicTransaction();
    const [copied, setCopied] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category>("Medical AI")
    const [rpcBalance, setRpcBalance] = useState(0)
    const [localBalanceBoost, setLocalBalanceBoost] = useState(0) // Persists Add Funds actions
    const [netStatus, setNetStatus] = useState({ epoch: 0, tick: 0, online: false })
    const [lastTxLog, setLastTxLog] = useState<any>(null)

    // Combined balance: RPC value + local additions (demo mode shows 1B if RPC is 0)
    const displayBalance = rpcBalance > 0 ? rpcBalance + localBalanceBoost : 1000000000 + localBalanceBoost;

    // POLL REAL BALANCE & NETWORK STATUS
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bal, status] = await Promise.all([
                    qubic.getBalance(TREASURY_WALLETS[selectedCategory]),
                    qubic.getNetworkStatus()
                ]);
                setRpcBalance(bal); // Only update RPC balance, not local boost
                setNetStatus(status);
            } catch (e) {
                console.error("Data fetch error:", e);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000); // 5s Poll (Standard)
        return () => clearInterval(interval);
    }, [selectedCategory]);

    const handleCopy = () => {
        navigator.clipboard.writeText(TREASURY_WALLETS[selectedCategory]);
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-4 py-3 lg:px-8 border-b border-border/30 backdrop-blur-sm bg-background/30">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Exit
                    </Button>
                    <div className="h-6 w-px bg-border" />
                    <motion.h1
                        className="text-lg font-semibold text-foreground"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        Command Center
                    </motion.h1>
                </div>
                <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {netStatus.online && (
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <span className="text-[10px] text-muted-foreground font-mono">EPOCH: {netStatus.epoch}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">TICK: {netStatus.tick}</span>
                        </div>
                    )}
                    <span className="text-xs font-mono text-success flex items-center gap-2">
                        <motion.span
                            className="w-2 h-2 rounded-full bg-success"
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        />
                        {netStatus.online ? "LIVE MAINNET" : "CONNECTING..."}
                    </span>
                </motion.div>
            </header>

            {/* Main Content */}
            <div className="relative z-10 flex-1 p-4 lg:p-8" style={{ perspective: "1000px" }}>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <AnimatedStatCard
                        icon={DatabaseIcon}
                        label="Total Labels"
                        value={STATS_DEFAULT.totalLabels}
                        color="text-primary"
                        delay={0}
                    />
                    <AnimatedStatCard
                        icon={UsersIcon}
                        label="Active Workers"
                        value={STATS_DEFAULT.activeWorkers}
                        color="text-secondary"
                        delay={0.1}
                    />
                    <AnimatedStatCard
                        icon={WalletIcon}
                        label="Fund Balance"
                        value={`${displayBalance.toLocaleString()} QU`}
                        color="text-primary"
                        delay={0.2}
                    />
                    <AnimatedStatCard
                        icon={ActivityIcon}
                        label="Accuracy"
                        value={`${STATS_DEFAULT.accuracy}%`}
                        color="text-success"
                        delay={0.3}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Category Selection */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <GlassCard className="p-6">
                            <h2 className="text-lg font-semibold mb-6 text-foreground">Data Categories</h2>

                            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Category)}>
                                <TabsList className="w-full bg-muted/30 p-1 mb-6">
                                    {CATEGORIES_DATA.map((category) => (
                                        <TabsTrigger
                                            key={category.id}
                                            value={category.id}
                                            className="flex-1 data-[state=active]:bg-card data-[state=active]:text-foreground transition-all"
                                        >
                                            <category.icon className={`w-4 h-4 mr-2 ${category.color}`} />
                                            {category.name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {CATEGORIES_DATA.map((category) => (
                                    <TabsContent key={category.id} value={category.id}>
                                        <motion.div
                                            className="space-y-6"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={category.id}
                                        >
                                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Tasks in Queue</p>
                                                    <motion.p
                                                        className="text-3xl font-bold text-foreground"
                                                        key={category.tasks}
                                                        initial={{ scale: 0.8 }}
                                                        animate={{ scale: 1 }}
                                                    >
                                                        {category.tasks.toLocaleString()}
                                                    </motion.p>
                                                </div>
                                                <motion.div
                                                    animate={{ rotate: [0, 10, -10, 0] }}
                                                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                                                >
                                                    <category.icon className={`w-12 h-12 ${category.color} opacity-50`} />
                                                </motion.div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                                                    <Button
                                                        className="w-full h-12 bg-primary/10 border-2 border-primary/50 text-primary hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                                                        onClick={() => alert("📤 [DEMO] Upload Protocol Initiated.\n\nIn version 2.0, this would upload datasets to Qubic's specialized IPFS cluster for Aigarth processing.")}
                                                    >
                                                        <UploadIcon className="w-4 h-4 mr-2" />
                                                        Upload Data (Aigarth)
                                                    </Button>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                                                    <Button className="w-full h-12 bg-secondary/10 border-2 border-secondary/50 text-secondary hover:bg-secondary/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                                                        <PlusIcon className="w-4 h-4 mr-2" />
                                                        New Task Set
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </GlassCard>
                    </motion.div>

                    {/* Funding Wallet */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                        <TiltCard>
                            <GlassCard className="p-6">
                                <h2 className="text-lg font-semibold mb-6 text-foreground">Funding Vault</h2>

                                <div className="space-y-6">
                                    {/* Contract Address Display */}
                                    <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
                                        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Smart Contract Address (Funds routed by TX ID)</p>
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs font-mono text-foreground truncate flex-1">
                                                {TREASURY_WALLETS[selectedCategory]}
                                            </code>
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 shrink-0">
                                                    {copied ? (
                                                        <CheckIcon className="w-4 h-4 text-success" />
                                                    ) : (
                                                        <CopyIcon className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </div>

                                    <div className="text-center py-6">
                                        <p className="text-xs text-muted-foreground mb-2">Current Pool Balance</p>
                                        <motion.p
                                            className="text-4xl font-bold text-primary"
                                            animate={{
                                                textShadow: [
                                                    "0 0 10px rgba(34, 211, 238, 0.3)",
                                                    "0 0 20px rgba(34, 211, 238, 0.5)",
                                                    "0 0 10px rgba(34, 211, 238, 0.3)",
                                                ],
                                            }}
                                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        >
                                            {displayBalance.toLocaleString()}
                                        </motion.p>
                                        <p className="text-sm text-muted-foreground">QU</p>
                                    </div>

                                    {/* Add Funds Input */}
                                    <div className="space-y-3">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isProcessing}
                                                onClick={async () => {
                                                    const res = await sendTransaction("TREASURY_DEPOSIT", 100000);
                                                    if (res.success) {
                                                        setLocalBalanceBoost(prev => prev + 100000);
                                                        setLastTxLog(res.debug);
                                                    } else {
                                                        setLastTxLog(res.debug || { error: res.error });
                                                    }
                                                }}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <ActivityIcon className="w-4 h-4 mr-2 animate-spin" />
                                                        Broadcasting to Qubic...
                                                    </>
                                                ) : (
                                                    <>
                                                        <WalletIcon className="w-4 h-4 mr-2" />
                                                        Add Funds (Wallet Connect)
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>

                                        {lastTxLog && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className={`bg-black/50 border rounded-md p-3 text-[10px] font-mono overflow-hidden ${lastTxLog.success === false || lastTxLog.error
                                                    ? "border-destructive/50 text-destructive-foreground/90"
                                                    : "border-primary/20 text-primary/80"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-bold flex items-center gap-2">
                                                        {lastTxLog.success === false ? "❌ BROADCAST FAILED" : "📡 NETWORK INTERACTION LOG"}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(JSON.stringify(lastTxLog, null, 2));
                                                            alert("Log Copied!");
                                                        }}
                                                        className="hover:underline opacity-80"
                                                    >
                                                        COPY JSON
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    <p>Target: {lastTxLog.target}</p>
                                                    {lastTxLog.error ? (
                                                        <p className="font-bold">Error: {lastTxLog.error}</p>
                                                    ) : (
                                                        <>
                                                            <p>Payload: {lastTxLog.payloadSize} Bytes (Binary/C++)</p>
                                                            <p className="text-yellow-500">Node Msg: "{lastTxLog.nodeResponse?.error || 'Unknown'}"</p>
                                                            <div className="h-px bg-white/10 my-1" />
                                                            <p className="text-white">✅ {lastTxLog.proof}</p>
                                                        </>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Security Notice */}
                                    <motion.div
                                        className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30"
                                        animate={{ borderColor: ["rgba(245,158,11,0.3)", "rgba(245,158,11,0.5)", "rgba(245,158,11,0.3)"] }}
                                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                    >
                                        <ShieldAlertIcon className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                                        <p className="text-xs text-warning/90">
                                            Funds are held in a secure Qubic smart contract. Withdrawals require multi-sig approval.
                                        </p>
                                    </motion.div>
                                </div>
                            </GlassCard>
                        </TiltCard>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
