/**
 * Demo Mode Configuration
 * 
 * When NEXT_PUBLIC_DEMO_MODE=true (set in Vercel env vars):
 * - Simulates blockchain transactions with fake TxIDs
 * - No local RPC required
 * - Perfect for hosted demo
 * 
 * When false or unset:
 * - Uses real Qubic testnet RPC
 * - Real blockchain transactions
 */

export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const SIMULATED_DELAY_MS = 1500; // Realistic network delay for demo

/**
 * Generate a fake but realistic-looking transaction ID for demo mode
 */
export function generateDemoTxId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let txId = '';
    for (let i = 0; i < 60; i++) {
        txId += chars[Math.floor(Math.random() * chars.length)];
    }
    return txId;
}

/**
 * Generate demo blockchain proof object
 */
export function generateDemoProof(sourceId: string, destId: string, amount: number) {
    return {
        timestamp: new Date().toISOString(),
        sourceId: sourceId.substring(0, 20) + '...',
        destinationId: destId.substring(0, 20) + '...',
        amount: amount,
        targetTick: Math.floor(38650000 + Math.random() * 10000),
        transactionId: generateDemoTxId(),
        library: "@qubic-lib/qubic-ts-library",
        rpcSource: "DEMO_MODE",
        status: "BROADCAST_SUCCESS (SIMULATED)",
        qforgeUrl: "https://qforge.qubicdev.com",
        note: "This is a demo transaction. In production, this would be a real Qubic blockchain transaction."
    };
}
