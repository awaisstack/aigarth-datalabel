"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { qubic } from "../lib/qubic";

interface Props {
    amount: number;
    workerWalletId: string;
    onClaimSuccess: () => void;
}

export default function Earnings({ amount, workerWalletId, onClaimSuccess }: Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [txResult, setTxResult] = useState<{ txId?: string; debug?: any } | null>(null);

    const handleClaim = async () => {
        if (amount <= 0 || !workerWalletId) return;

        setIsProcessing(true);

        try {
            // Pay worker from treasury (pre-funded testnet seed with 1B QU)
            const result = await qubic.payWorker(workerWalletId, amount);

            if (result.success && result.txId) {
                setTxResult({ txId: result.txId, debug: result.debug });
                onClaimSuccess(); // Reset the counter
                setTimeout(() => setTxResult(null), 15000); // Extended visibility for proof
            } else {
                console.error("Claim Failed:", result);
                alert(`Claim Failed: ${result.error || "Unknown Error"}\nCheck Console for details.`);
            }
        } catch (e: any) {
            alert(`Error: ${e.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
        >
            <div className="bg-black/90 backdrop-blur-xl border border-yellow-500/30 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(234,179,8,0.2)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-50 pointer-events-none" />

                <div className="flex flex-col items-end leading-none">
                    <span className="text-yellow-100/60 text-[10px] font-bold uppercase tracking-widest mb-1.5">Accumulated Rewards</span>
                    <motion.span
                        key={amount}
                        initial={{ scale: 1.2, color: "#fff" }}
                        animate={{ scale: 1, color: "#facc15" }}
                        className="text-yellow-400 font-bold font-mono text-2xl drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                    >
                        {amount.toLocaleString()} QU
                    </motion.span>
                </div>

                <div className="h-10 w-px bg-yellow-500/20 mx-2" />

                <button
                    onClick={handleClaim}
                    disabled={isProcessing || amount === 0}
                    className={`bg-yellow-500 text-black hover:bg-yellow-400 text-xs font-black py-3 px-6 rounded-xl transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(234,179,8,0.6)] active:scale-95 ${amount > 0 && !isProcessing ? 'animate-glow-pulse' : ''}`}
                >
                    {isProcessing ? "Broadcasting..." : "Claim Now"}
                </button>
            </div>

            <AnimatePresence>
                {txResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-black/90 backdrop-blur-md border border-green-500/30 px-4 py-3 rounded-xl text-xs text-green-300 shadow-2xl max-w-sm font-mono mb-4"
                    >
                        <span className="font-bold block mb-2 text-green-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            ✅ TRANSACTION BROADCAST
                        </span>
                        <div className="space-y-1 text-[10px] opacity-90">
                            <p>From: Treasury (Pre-funded Testnet)</p>
                            <p>To: {workerWalletId.substring(0, 12)}...{workerWalletId.substring(52)}</p>
                            <p>Amount: {amount} QU</p>
                            <p>TX ID: <span className="text-primary">{txResult.txId}</span></p>
                            {txResult.debug?.rpcSource && (
                                <p>RPC: <span className="text-blue-400">{txResult.debug.rpcSource}</span></p>
                            )}
                            <div className="h-px bg-green-500/20 my-2" />

                            {txResult.debug?.qforgeUrl && (
                                <a
                                    href={txResult.debug.qforgeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center bg-green-500/20 hover:bg-green-500/30 text-green-400 py-1 rounded transition-colors text-[9px]"
                                >
                                    🔗 Verify on QForge (Testnet Explorer)
                                </a>
                            )}

                            <button
                                onClick={() => {
                                    const log = txResult.debug || { txId: txResult.txId };
                                    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
                                    alert("📋 Blockchain Proof Copied!\n\nThis JSON contains proof of the on-chain transaction.");
                                }}
                                className="block w-full mt-2 text-center bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-1 rounded transition-colors uppercase tracking-wider text-[9px]"
                            >
                                📋 Copy Blockchain Proof
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
