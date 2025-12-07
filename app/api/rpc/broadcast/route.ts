import { NextResponse } from 'next/server';

// RPC Endpoints - Priority order (QUBICDEV first for both local and hosted)
const RPC_ENDPOINTS = [
    { name: "QUBICDEV_TESTNET", url: "https://testnet-rpc.qubicdev.com" },
    { name: "NOSTROMO_TESTNET", url: "https://testnet-nostromo.qubicdev.com" },
    { name: "LOCAL_RPC", url: "http://localhost:8000" },  // Fallback for local dev
    { name: "QUBIC_TESTNET", url: "https://testnet-rpc.qubic.org" }
];

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { encodedTransaction } = body;

        if (!encodedTransaction) {
            return NextResponse.json({ error: "Missing encodedTransaction" }, { status: 400 });
        }

        console.log("[PROXY] Broadcasting transaction...");
        console.log("[PROXY] Transaction length:", encodedTransaction.length);

        // Try each endpoint in order
        for (const endpoint of RPC_ENDPOINTS) {
            try {
                console.log(`[PROXY] Trying ${endpoint.name} for broadcast...`);

                const response = await fetch(`${endpoint.url}/v1/broadcast-transaction`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ encodedTransaction }),
                    signal: AbortSignal.timeout(10000)
                });

                const data = await response.json();

                if (response.ok) {
                    console.log(`[PROXY] ${endpoint.name} broadcast SUCCESS`);
                    return NextResponse.json({
                        success: true,
                        transactionId: data.transactionId || data.result?.transactionId,
                        peersBroadcasted: data.peersBroadcasted || data.result?.peersBroadcasted,
                        rpcSource: endpoint.name,
                        rpcStatus: "LIVE",
                        ...data
                    });
                }

                console.warn(`[PROXY] ${endpoint.name} broadcast returned ${response.status}:`, data);
            } catch (error: any) {
                console.warn(`[PROXY] ${endpoint.name} broadcast failed:`, error.message);
            }
        }

        // All endpoints failed
        return NextResponse.json({
            error: "All RPC endpoints failed to broadcast",
            rpcSource: "NONE",
            rpcStatus: "OFFLINE"
        }, { status: 503 });

    } catch (error: any) {
        console.error("[PROXY ERROR] Broadcast:", error);
        return NextResponse.json({
            error: error.message || "Broadcast failed",
            rpcSource: "NONE",
            rpcStatus: "ERROR"
        }, { status: 500 });
    }
}
