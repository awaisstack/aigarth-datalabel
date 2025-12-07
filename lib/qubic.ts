/**
 * Qubic Integration - Using Official TypeScript Library
 * Full implementation with proper transaction signing
 * 
 * TESTNET CONFIGURATION:
 * Uses pre-funded testnet seed with 1 billion QU for treasury operations
 */

import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';
import { QubicTransaction } from '@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction';
import { PublicKey } from '@qubic-lib/qubic-ts-library/dist/qubic-types/PublicKey';
import { Long } from '@qubic-lib/qubic-ts-library/dist/qubic-types/Long';

export type Category = "Medical AI" | "Autonomous Driving" | "Content Moderation";

// =============================================================================
// TESTNET TREASURY CONFIGURATION
// Using pre-funded testnet seeds (each has ~1 billion QU)
// Source: https://docs.qubic.org/developers/testnet-resources
// =============================================================================

// Treasury seed for paying out worker rewards (pre-funded on qubicdev testnet)
// Source: Public testnet at https://testnet-rpc.qubicdev.com
const TREASURY_SEED = "wftskxhfzangclxlmwsuneqaimnwbtudzmthifvqiaywbsrgpkviztd";

// Derive treasury public ID from seed at runtime
let TREASURY_PUBLIC_ID: string | null = null;

async function getTreasuryPublicId(): Promise<string> {
    if (!TREASURY_PUBLIC_ID) {
        const helper = new QubicHelper();
        const idPackage = await helper.createIdPackage(TREASURY_SEED);
        TREASURY_PUBLIC_ID = idPackage.publicId;
        console.log("[QUBIC] Treasury ID derived:", TREASURY_PUBLIC_ID);
    }
    return TREASURY_PUBLIC_ID;
}

// Treasury wallets for different categories (all use same treasury for demo)
export const TREASURY_WALLETS: Record<Category, string> = {
    "Medical AI": "LOADING...",
    "Autonomous Driving": "LOADING...",
    "Content Moderation": "LOADING...",
};

// Initialize treasury wallets
(async () => {
    try {
        const treasuryId = await getTreasuryPublicId();
        TREASURY_WALLETS["Medical AI"] = treasuryId;
        TREASURY_WALLETS["Autonomous Driving"] = treasuryId;
        TREASURY_WALLETS["Content Moderation"] = treasuryId;
    } catch (e) {
        console.error("[QUBIC] Failed to derive treasury ID:", e);
    }
})();

// Create helper instance
let qubicHelper: QubicHelper | null = null;

async function getHelper(): Promise<QubicHelper> {
    if (!qubicHelper) {
        qubicHelper = new QubicHelper();
    }
    return qubicHelper;
}

export const qubic = {
    /**
     * Get the treasury public ID
     */
    getTreasuryId: async (): Promise<string> => {
        return await getTreasuryPublicId();
    },

    /**
     * Get balance from Qubic Testnet RPC
     */
    getBalance: async (walletId: string): Promise<number> => {
        try {
            // Handle loading state
            if (walletId === "LOADING...") {
                return 0;
            }

            const response = await fetch(`/api/rpc/balance?id=${walletId}`);
            if (!response.ok) {
                throw new Error(`RPC Proxy Error: ${response.status}`);
            }
            const data = await response.json();
            // Handle both formats: balance.balance (qubicdev) and balance.amount (other RPCs)
            const amount = data.balance?.balance || data.balance?.amount || "0";
            return Number(amount);
        } catch (e) {
            console.warn(`[RPC] Balance Fetch Failed for ${walletId.substring(0, 8)}...`, e);
            throw e;
        }
    },

    /**
     * Get current tick from network (for transaction scheduling)
     */
    getCurrentTick: async (): Promise<number> => {
        try {
            const response = await fetch("/api/rpc/tick-info");
            if (!response.ok) throw new Error("Failed to fetch tick");
            const data = await response.json();
            return data.tickInfo?.tick || data.tick || 0;
        } catch (e) {
            console.error("[RPC] Tick fetch failed:", e);
            return 0;
        }
    },

    /**
     * Pay a worker from treasury
     * This is the MAIN function for paying workers when they claim rewards
     */
    payWorker: async (
        workerPublicId: string,
        amount: number
    ): Promise<{ success: boolean; txId?: string; error?: string; debug?: any }> => {
        console.log(`[TX] Paying worker: ${amount} QU -> ${workerPublicId}`);

        // Validate inputs
        if (!workerPublicId || !/^[A-Z]{60}$/.test(workerPublicId)) {
            return { success: false, error: "Invalid worker public ID" };
        }
        if (!amount || isNaN(amount) || amount <= 0) {
            return { success: false, error: "Invalid amount" };
        }

        return await qubic.sendTransaction(workerPublicId, amount, TREASURY_SEED);
    },

    /**
     * Send QU from treasury to a destination
     * Used for company deposits and worker payouts
     */
    sendTransaction: async (
        destinationId: string,
        amount: number,
        seed: string = TREASURY_SEED
    ): Promise<{ success: boolean; txId?: string; error?: string; debug?: any }> => {

        console.log(`[TX] Initiating Qubic Transaction: ${amount} QU -> ${destinationId}`);

        // Input validation
        if (!destinationId || destinationId === "LOADING...") {
            return { success: false, error: "Destination ID not ready" };
        }
        if (!/^[A-Z]{60}$/.test(destinationId)) {
            return { success: false, error: `Invalid destination ID format: ${destinationId}` };
        }
        if (!amount || isNaN(amount) || amount <= 0) {
            return { success: false, error: `Invalid amount: ${amount}` };
        }

        try {
            const helper = await getHelper();

            // 1. Create ID package from seed (derives public key)
            const idPackage = await helper.createIdPackage(seed);
            console.log("[TX] Source ID:", idPackage.publicId);

            // 2. Get current tick and add offset for scheduling
            const currentTick = await qubic.getCurrentTick();
            const targetTick = currentTick + 10; // 10 tick offset for safety
            console.log(`[TX] Scheduling for tick: ${targetTick} (current: ${currentTick})`);

            // 3. Build transaction using official library
            const amountBigInt = BigInt(Math.floor(amount));
            const transaction = new QubicTransaction()
                .setSourcePublicKey(new PublicKey(idPackage.publicKey))
                .setDestinationPublicKey(new PublicKey(destinationId))
                .setAmount(new Long(amountBigInt))
                .setTick(targetTick)
                .setInputType(0)
                .setInputSize(0);

            // 4. Sign the transaction
            await transaction.build(seed);

            // 5. Encode to base64 for broadcast
            const encodedTransaction = transaction.encodeTransactionToBase64(
                transaction.getPackageData()
            );

            console.log("[TX] Transaction built and signed. Broadcasting...");

            // 6. Broadcast via RPC proxy
            const response = await fetch("/api/rpc/broadcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ encodedTransaction })
            });

            const result = await response.json();

            if (response.ok) {
                const txId = result.transactionId || `tx-${Date.now()}`;
                return {
                    success: true,
                    txId: txId,
                    debug: {
                        timestamp: new Date().toISOString(),
                        sourceId: idPackage.publicId,
                        destinationId: destinationId,
                        amount: amount,
                        targetTick: targetTick,
                        transactionId: txId,
                        library: "@qubic-lib/qubic-ts-library",
                        rpcSource: result.rpcSource || "LOCAL_RPC",
                        status: "BROADCAST_SUCCESS",
                        // Note: qubicdev testnet may not have public explorer yet - use QForge to verify
                        explorerUrl: `https://explorer.qubic.org/network/tx/${txId}`,
                        qforgeUrl: `https://qforge.qubicdev.com`,
                        response: result
                    }
                };
            } else {
                console.warn("[TX] Broadcast response:", result);
                return {
                    success: false,
                    error: result.message || result.error || "Broadcast Failed",
                    debug: {
                        timestamp: new Date().toISOString(),
                        targetTick: targetTick,
                        response: result
                    }
                };
            }

        } catch (e: any) {
            console.error("[TX] Transaction Error:", e);
            return {
                success: false,
                error: e.message || "Transaction Failed",
                debug: {
                    error: e.message,
                    stack: e.stack
                }
            };
        }
    },

    /**
     * Legacy sendPayout - redirects to sendTransaction
     */
    sendPayout: async (
        category: Category,
        destinationId: string,
        amount: number
    ): Promise<{ success: boolean; txId?: string; error?: string; debug?: any }> => {
        return await qubic.sendTransaction(destinationId, amount, TREASURY_SEED);
    },

    /**
     * Get network status from testnet
     */
    getNetworkStatus: async (): Promise<{ epoch: number; tick: number; online: boolean; rpcSource?: string }> => {
        try {
            const response = await fetch("/api/rpc/tick-info");
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            return {
                epoch: data.tickInfo?.epoch || data.epoch || 116,
                tick: data.tickInfo?.tick || data.tick || 0,
                online: data.rpcStatus === "LIVE",
                rpcSource: data.rpcSource || "UNKNOWN"
            };
        } catch (e) {
            console.warn("RPC Fetch Failed", e);
            return { epoch: 116, tick: Math.floor(Date.now() / 1000 % 100000), online: false };
        }
    },

    /**
     * Validate a Qubic ID format
     */
    validateId: (id: string): boolean => {
        return /^[A-Z]{60}$/.test(id);
    },

    /**
     * Get treasury seed (for debugging - NEVER expose in production!)
     */
    getTreasurySeed: (): string => {
        return TREASURY_SEED;
    }
};
