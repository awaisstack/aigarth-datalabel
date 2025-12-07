import { NextResponse } from 'next/server';

// RPC Endpoints - Priority order (local first, then remote fallbacks)
const RPC_ENDPOINTS = [
    { name: "LOCAL_RPC", url: "http://localhost:8000" },
    { name: "NOSTROMO_TESTNET", url: "https://testnet-nostromo.qubicdev.com" },
    { name: "QUBIC_TESTNET", url: "https://testnet-rpc.qubic.org" }
];

export async function GET() {
    // Try each endpoint in order
    for (const endpoint of RPC_ENDPOINTS) {
        try {
            console.log(`[PROXY] Trying ${endpoint.name} for tick-info...`);

            const response = await fetch(`${endpoint.url}/v1/tick-info`, {
                headers: { "Accept": "application/json" },
                signal: AbortSignal.timeout(5000)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`[PROXY] ${endpoint.name} SUCCESS - Tick: ${data.tickInfo?.tick || data.tick}`);
                return NextResponse.json({
                    ...data,
                    rpcSource: endpoint.name,
                    rpcStatus: "LIVE"
                });
            }

            console.warn(`[PROXY] ${endpoint.name} returned ${response.status}`);
        } catch (error: any) {
            console.warn(`[PROXY] ${endpoint.name} failed:`, error.message);
        }
    }

    // All endpoints failed - return estimated fallback
    const estimatedTick = Math.floor(Date.now() / 1000) % 1000000;
    console.log(`[PROXY] All RPCs failed, using demo fallback`);
    return NextResponse.json({
        tickInfo: { tick: estimatedTick, epoch: 116 },
        rpcSource: "DEMO_FALLBACK",
        rpcStatus: "OFFLINE"
    });
}
