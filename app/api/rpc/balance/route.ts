import { NextResponse } from 'next/server';

// RPC Endpoints - Priority order (qubicdev with funded seeds first)
const RPC_ENDPOINTS = [
    { name: "QUBICDEV_TESTNET", url: "https://testnet-rpc.qubicdev.com" },
    { name: "LOCAL_RPC", url: "http://localhost:8000" },
    { name: "NOSTROMO_TESTNET", url: "https://testnet-nostromo.qubicdev.com" },
    { name: "QUBIC_TESTNET", url: "https://testnet-rpc.qubic.org" }
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "Missing 'id' parameter" }, { status: 400 });
    }

    // Validate Qubic ID format (60 uppercase letters)
    if (!/^[A-Z]{60}$/.test(id)) {
        return NextResponse.json({ error: "Invalid Qubic ID format" }, { status: 400 });
    }

    // Try each endpoint in order
    for (const endpoint of RPC_ENDPOINTS) {
        try {
            console.log(`[PROXY] Trying ${endpoint.name} for balance...`);

            const response = await fetch(`${endpoint.url}/v1/balances/${id}`, {
                headers: { "Accept": "application/json" },
                signal: AbortSignal.timeout(5000)
            });

            if (response.status === 404) {
                // 404 = account empty/new but valid
                return NextResponse.json({
                    balance: { id, amount: "0" },
                    rpcSource: endpoint.name,
                    rpcStatus: "LIVE"
                });
            }

            if (response.ok) {
                const data = await response.json();
                console.log(`[PROXY] ${endpoint.name} SUCCESS for ${id.substring(0, 8)}...`);
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

    // All endpoints failed - return demo fallback
    console.log(`[PROXY] All RPCs failed, using demo fallback for ${id.substring(0, 8)}...`);
    return NextResponse.json({
        balance: { id, amount: "1000000000" },
        rpcSource: "DEMO_FALLBACK",
        rpcStatus: "OFFLINE"
    });
}
