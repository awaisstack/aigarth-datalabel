"use client";

import { useState } from "react";
import { GlassCard } from "./ui/GlassCard";
import { motion } from "framer-motion";

interface Props {
    onConnect: (id: string) => void;
}

export default function WalletConnect({ onConnect }: Props) {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");

    const handleConnect = () => {
        if (input.length !== 60) {
            setError("Invalid Format: ID must be 60 characters [A-Z].");
            return;
        }
        setError("");
        onConnect(input.toUpperCase());
    };

    return (
        <GlassCard className="max-w-md mx-auto mt-20 border-t border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full mx-auto mb-4 blur-sm opacity-50 absolute top-10 left-1/2 -translate-x-1/2 -z-10 animate-pulse" />
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500 text-glow">
                    Aigarth DataLabel
                </h2>
                <p className="text-cyan-200/60 text-sm mt-2 font-light">Train the Qubic AI Network & Earn Rewards</p>
            </div>

            <div className="space-y-4">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value.toUpperCase())}
                        placeholder="Enter 60-char Qubic ID"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 focus:bg-black/60 transition-all placeholder:text-gray-600 font-mono text-xs"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>

                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs text-center">{error}</motion.p>}

                <div className="flex flex-col gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConnect}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/30 uppercase tracking-widest text-sm"
                    >
                        Initialize Aigarth Uplink
                    </motion.button>

                    <button
                        onClick={() => setInput("SXLVVEYKPWCWECCPDAHVKBAEVRFCHPCZEDWSUMMGCEASYUSIKYLNJNYAQJKK")}
                        className="text-xs text-cyan-500/60 hover:text-cyan-400 underline underline-offset-4 decoration-dashed transition-colors"
                    >
                        Use Demo Identity (Testnet)
                    </button>
                </div>
            </div>
        </GlassCard>
    );
}
