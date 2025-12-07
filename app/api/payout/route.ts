import { NextResponse } from "next/server";
import { TreasuryStore } from "@/lib/store";

export async function POST(request: Request) {
    try {
        const { category, userQubicId, amount } = await request.json();

        if (!category || !userQubicId || !amount) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // 1. Check if Treasury has enough funds
        const success = TreasuryStore.deductFunds(category, Number(amount));

        if (!success) {
            return NextResponse.json({
                success: false,
                error: "Insufficient Funds in Category Pool. Ask a Company to deposit!"
            }, { status: 402 }); // 402 Payment Required
        }

        // 2. In a real app, here we would sign and broadcast the Qubic Transaction
        // const txHash = await QubicSDK.transfer(...)

        // For demo, we simulate the Tx ID
        const mockTxId = "tx_" + Math.random().toString(36).substring(2, 15);

        return NextResponse.json({
            success: true,
            txId: mockTxId,
            amount,
            message: `Sent ${amount} QU to ${userQubicId}`
        });

    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
