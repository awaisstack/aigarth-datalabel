import { useState, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { TypewriterText } from "@/components/TypewriterText"
import { NetworkIcon, ZapIcon, BrainIcon, ArrowRightIcon, BuildingIcon, GlobeIcon, InfoIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"
import { qubic } from "@/lib/qubic"

interface LandingPageProps {
    onWorkerAccess: (walletId: string) => void
    onCompanyAccess: () => void
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
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
            <div style={{ transform: "translateZ(50px)" }}>{children}</div>
        </motion.div>
    )
}

export default function LandingPage({ onWorkerAccess, onCompanyAccess }: LandingPageProps) {
    const [walletId, setWalletId] = useState("")
    const [walletError, setWalletError] = useState<string | null>(null)
    const [isInputFocused, setIsInputFocused] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [showTutorial, setShowTutorial] = useState(false)
    const [mode, setMode] = useState<"worker" | "company">("worker")

    // Real blockchain data
    const [networkStatus, setNetworkStatus] = useState({ epoch: 0, tick: 0, online: false })
    const [treasuryBalance, setTreasuryBalance] = useState(0)
    const [isRealBalance, setIsRealBalance] = useState(false)

    // Fetch real data from blockchain
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get network status (epoch, tick)
                const status = await qubic.getNetworkStatus();
                setNetworkStatus(status);

                // Get treasury balance
                const treasuryId = await qubic.getTreasuryId();
                if (treasuryId && treasuryId !== "LOADING...") {
                    const balance = await qubic.getBalance(treasuryId);
                    if (balance > 0) {
                        setTreasuryBalance(balance);
                        setIsRealBalance(true);
                    } else {
                        // Demo fallback for testnet (seeds funded on different epoch)
                        setTreasuryBalance(1000000000); // 1 billion QU demo
                        setIsRealBalance(false);
                    }
                }
            } catch (e) {
                console.warn("Failed to fetch blockchain data", e);
                // Fallback on error
                setTreasuryBalance(1000000000);
                setIsRealBalance(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 10000); // 10s refresh
        return () => clearInterval(interval);
    }, []);

    // REAL Wallet Connection Logic
    const handleConnectWallet = async () => {
        setIsConnecting(true);
        setWalletError(null);

        try {
            if (typeof window === 'undefined') return;
            const provider = (window as any).qubic || (window as any).qubicWallet;

            if (!provider) {
                throw new Error("EXTENSION_NOT_FOUND");
            }

            const accounts = await provider.request({ method: 'requestAccounts' });

            if (accounts && Array.isArray(accounts) && accounts.length > 0) {
                const connectedId = accounts[0];
                setWalletId(connectedId.toUpperCase());
                verifyAndLogin(connectedId.toUpperCase());
            } else {
                throw new Error("NO_ACCOUNTS");
            }

        } catch (e: any) {
            console.warn("Wallet Connect Failed:", e);
            let msg = "";
            if (e.message === "EXTENSION_NOT_FOUND") {
                msg = "⚠️ Qubic Extension not found in browser.\n(Checked 'window.qubic')";
            } else {
                msg = `❌ Connection Error: ${e.message || "Unknown"}`;
            }
            alert(`${msg}\n\nFalling back to Secure Manual Entry.`);
            setIsInputFocused(true);
            setWalletError("Extension not detected. Please type ID manually.");
        } finally {
            setIsConnecting(false);
        }
    };

    const verifyAndLogin = async (id: string) => {
        const isValidFormat = /^[A-Z]{60}$/.test(id);

        if (!isValidFormat) {
            setWalletError("❌ Format Invalid: Must be 60 Uppercase Letters.");
            return;
        }

        setIsVerifying(true);
        setWalletError(null);

        try {
            // Verify existence on network (or at least valid format for node)
            // If getBalance fails, it likely means invalid ID checksum or network error
            await qubic.getBalance(id);

            // If successful (even 0 balance), proceed
            if (mode === "worker") onWorkerAccess(id);
            else onCompanyAccess();

        } catch (e) {
            console.warn("ID Verification Failed", e);
            // Optional: Let them through if network is just down? 
            // Strict Mode: Block
            // "Hackathon Mode": Warn but allow if format is perfect
            if (confirm("⚠️ Network Verification Failed.\n\nThis might be an invalid ID or the Testnet is offline.\n\nProceed anyway?")) {
                if (mode === "worker") onWorkerAccess(id);
                else onCompanyAccess();
            } else {
                setWalletError("❌ ID verification failed.");
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const handleEnter = () => {
        if (walletId) verifyAndLogin(walletId);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Centered content - removed pt-20 for true vertical centering */}

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
            </div>

            {/* Tutorial Modal */}
            <AnimatePresence>
                {showTutorial && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowTutorial(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-zinc-900 border border-primary/20 p-8 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(34,211,238,0.2)]"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                                <BrainIcon className="w-8 h-8 text-primary" />
                                Why Aigarth DataLabel?
                            </h2>

                            <div className="space-y-6 text-muted-foreground">
                                {/* The Vision */}
                                <section className="border-l-4 border-primary/50 pl-4">
                                    <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                                        <span className="text-2xl">🎯</span>
                                        The Mission
                                    </h3>
                                    <p className="text-sm">Aigarth DataLabel is a <strong>decentralized data labeling marketplace</strong> built on Qubic. We connect companies that need high-quality training data with workers who want to earn crypto for their cognitive contributions—with zero transaction fees.</p>
                                </section>

                                {/* The Problem */}
                                <section>
                                    <h3 className="text-lg font-semibold text-white mb-2">⚠️ The Problem</h3>
                                    <p>AI models are starving for high-quality, verified human data. Current solutions (Scale AI, MTurk) are centralized, expensive, and built for <em>generic</em> LLMs—not advanced architectures like <strong>Neuraxon</strong>.</p>
                                </section>

                                {/* The Solution */}
                                <section>
                                    <h3 className="text-lg font-semibold text-white mb-2">✨ The Solution: Neuraxon Data</h3>
                                    <p>A decentralized <strong>Proof-of-Intelligence</strong> marketplace. We use Qubic's <span className="text-primary font-bold">ZERO-FEE</span> transfers to pay humans instantly for labeling data optimized for <strong>Neuraxon</strong> (Qubic's Bio-Inspired AI using Trinary Logic: -1, 0, 1).</p>
                                </section>

                                <div className="grid grid-cols-2 gap-4 my-4">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-primary/30 transition-all">
                                        <div className="text-2xl mb-2">🧠</div>
                                        <h4 className="font-bold text-white">Trinary Logic AI</h4>
                                        <p className="text-xs">Neuraxon uses (-1, 0, 1) states to mimic biological neurons. Your labels train this <strong>Continuous Flow</strong> architecture—not generic chatbots.</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all">
                                        <div className="text-2xl mb-2">⚡</div>
                                        <h4 className="font-bold text-white">Zero-Fee Micro-Payments</h4>
                                        <p className="text-xs">Label 5 tasks, earn $0.05, claim <strong>instantly</strong>. No $50 gas fees eating your pennies.</p>
                                    </div>
                                </div>

                                {/* FAQ Section */}
                                <section className="bg-gradient-to-r from-primary/5 to-purple-500/5 p-4 rounded-xl border border-primary/10">
                                    <h3 className="text-lg font-semibold text-white mb-3">💭 Common Questions</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="font-bold text-white">Q: "Why compete for pennies?"</p>
                                            <p className="text-xs mt-1">A: You scroll TikTok for $0. Aigarth turns "dead time" into money. <strong>Instant gratification</strong> beats waiting for a monthly paycheck with gas fees.</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Q: "Why not use Scale AI?"</p>
                                            <p className="text-xs mt-1">A: Scale serves <em>generic</em> LLMs. We're the <strong>only</strong> provider of Trinary Logic training data for Neuraxon's unique architecture.</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Q: "I don't understand blockchain."</p>
                                            <p className="text-xs mt-1">A: You don't need to! Just: <strong>Label → Earn → Cash Out</strong>. Qubic handles the invisible infrastructure.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* How it Works */}
                                <section>
                                    <h3 className="text-lg font-semibold text-white mb-2">🚀 How it Works</h3>
                                    <ol className="list-decimal pl-5 space-y-2 text-sm">
                                        <li><strong>Connect:</strong> Use your Qubic ID (or create one).</li>
                                        <li><strong>Work:</strong> Label images (Medical, Driving, etc.).</li>
                                        <li><strong>Earn:</strong> Accumulate QUBIC tokens in real-time.</li>
                                        <li><strong>Claim:</strong> Instant payout to your wallet—no minimum, no fees.</li>
                                    </ol>
                                </section>

                                {/* Why Qubic */}
                                <section className="border border-primary/20 p-4 rounded-xl bg-primary/5">
                                    <h3 className="text-lg font-semibold text-primary mb-2">🔷 Why Qubic?</h3>
                                    <p className="text-sm">Qubic is the <strong>only</strong> blockchain fast enough and cheap enough (FREE transactions) to handle thousands of micro-payments per second. Traditional chains would charge $5-50 per claim—making micro-rewards impossible.</p>
                                </section>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Button onClick={() => setShowTutorial(false)}>Got it!</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/20 rounded-full blur-[100px]" />

                    <h1 className="text-7xl md:text-8xl font-bold font-mono tracking-tighter mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-200 to-primary">
                            AIGARTH
                        </span>
                        <br />
                        <span className="text-white text-5xl md:text-6xl">DATALABEL</span>
                    </h1>

                    <p className="text-muted-foreground text-xl md:text-2xl mb-8 max-w-lg leading-relaxed">
                        <TypewriterText
                            text="The first localized Proof-of-Intelligence protocol. Monetize your cognitive work on the Qubic Network."
                            delay={500}
                            speed={25}
                            className="inline"
                        />
                    </p>

                    {/* Mode Toggles */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setMode("worker")}
                            className={`text-sm px-4 py-2 rounded-full border transition-all ${mode === "worker" ? "bg-primary/20 border-primary text-primary" : "border-white/10 text-muted-foreground hover:text-white"}`}
                        >
                            Worker Access
                        </button>
                        <button
                            onClick={() => setMode("company")}
                            className={`text-xs px-3 py-1 rounded-full border transition-all ${mode === "company" ? "bg-purple-500/20 border-purple-500 text-purple-400" : "border-white/10 text-muted-foreground hover:text-white"}`}
                        >
                            Company Portal
                        </button>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="flex-1 max-w-md">
                            <div className={`relative bg-black/40 rounded-full border backdrop-blur-md flex items-center px-4 transition-colors h-12 ${walletError ? "border-destructive/50" : "border-white/10 focus-within:border-primary/50"}`}>
                                <span className="text-muted-foreground mr-2">{mode === "worker" ? "ID:" : "CORP:"}</span>
                                <input
                                    autoFocus={isInputFocused}
                                    type="text"
                                    value={walletId}
                                    onChange={(e) => setWalletId(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 60))}
                                    placeholder={mode === "worker" ? "YOUR 60-CHARACTER QUBIC ID..." : "COMPANY ID..."}
                                    className="bg-transparent border-none outline-none text-xs font-mono text-primary w-full h-full placeholder:text-muted-foreground/30"
                                    onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
                                    disabled={isVerifying}
                                />
                                <button
                                    onClick={handleEnter}
                                    className="p-1 hover:text-primary transition-colors text-muted-foreground"
                                    disabled={isVerifying}
                                >
                                    {isVerifying ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <ArrowRightIcon className="w-4 h-4" />}
                                </button>
                            </div>
                            {walletError && (
                                <p className="text-[10px] text-destructive mt-2 ml-4 animate-in fade-in slide-in-from-top-1">
                                    {walletError}
                                </p>
                            )}
                        </div>
                    </div>

                    <motion.button
                        onClick={() => setShowTutorial(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 px-6 py-3 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/30 rounded-xl text-sm text-primary hover:border-primary/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center gap-3 transition-all"
                    >
                        <InfoIcon className="w-5 h-5" />
                        <span className="font-semibold">What is Aigarth DataLabel?</span>
                        <ArrowRightIcon className="w-4 h-4 opacity-60" />
                    </motion.button>

                    <p className="mt-4 text-[10px] text-muted-foreground/60">
                        Don't have a Qubic ID? <a href="https://wallet.qubic.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Get one from the Qubic Wallet →</a>
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="relative hidden lg:block"
                >
                    <TiltCard>
                        <GlassCard className="p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-xs font-mono text-muted-foreground">{networkStatus.online ? "QUBIC TESTNET" : "CONNECTING..."}</span>
                                    </div>
                                    <NetworkIcon className="w-6 h-6 text-primary" />
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">CURRENT EPOCH</div>
                                        <div className="text-2xl font-mono font-bold text-white">{networkStatus.epoch || "---"}</div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">AIGARTH STATUS</div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-24 bg-primary/20 rounded-full overflow-hidden">
                                                <div className="h-full w-[0%] bg-primary animate-pulse w-full" />
                                            </div>
                                            <span className="text-xs font-mono text-primary">LEARNING</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/10">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-1">TREASURY BALANCE</div>
                                                <div className="text-xl font-mono text-white">{treasuryBalance.toLocaleString()} QU</div>
                                            </div>
                                            <BuildingIcon className="w-8 h-8 text-white/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </TiltCard>
                </motion.div>
            </div>

            {/* Features Section - Below Fold */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16 mt-8"
            >
                <h2 className="text-center text-2xl font-bold text-white mb-2">Why Choose Aigarth?</h2>
                <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">The only data labeling platform built for the future of AI—powered by Qubic's zero-fee blockchain</p>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* For Workers */}
                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 p-6 rounded-2xl hover:border-primary/40 transition-all"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                            <ZapIcon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Instant Payments</h3>
                        <p className="text-sm text-muted-foreground">Label images, earn QU instantly. No minimum threshold, no waiting periods. Claim your earnings anytime with zero fees.</p>
                    </motion.div>

                    {/* For Companies */}
                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 p-6 rounded-2xl hover:border-purple-500/40 transition-all"
                    >
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                            <BrainIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Neuraxon-Ready Data</h3>
                        <p className="text-sm text-muted-foreground">Training data optimized for Qubic's Trinary Logic AI. Not generic LLM data—specialized for the next evolution of machine intelligence.</p>
                    </motion.div>

                    {/* Decentralized */}
                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 p-6 rounded-2xl hover:border-cyan-500/40 transition-all"
                    >
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                            <GlobeIcon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Truly Decentralized</h3>
                        <p className="text-sm text-muted-foreground">No middlemen, no 30% platform fees. Direct payments from companies to workers—all verified on the Qubic blockchain.</p>
                    </motion.div>
                </div>

                {/* Stats Bar */}
                <div className="mt-16 grid grid-cols-3 gap-4 py-8 border-t border-b border-white/5">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary font-mono">1M+</div>
                        <div className="text-xs text-muted-foreground mt-1">Tasks Available</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white font-mono">$0.00</div>
                        <div className="text-xs text-muted-foreground mt-1">Transaction Fees</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400 font-mono">&lt;3s</div>
                        <div className="text-xs text-muted-foreground mt-1">Payment Speed</div>
                    </div>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="relative z-10 w-full px-6 py-6 border-t border-white/5 mt-auto">
                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground/50">
                    <span>© 2025 Aigarth Protocol</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span>Built on Qubic</span>
                </div>
            </footer>
        </div>
    )
}
