import { NextResponse } from "next/server";
import { TreasuryStore } from "@/lib/store";

export async function POST(request: Request) {
    try {
        const { category, amount } = await request.json();

        if (!category || !amount) {
            return NextResponse.json({ error: "Missing category or amount" }, { status: 400 });
        }

        const newBalance = TreasuryStore.addFunds(category, Number(amount));

        return NextResponse.json({
            success: true,
            category,
            newBalance,
            message: `Successfully funded ${amount} QU to ${category}`
        });

    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    // Helper to get all balances
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    if (category) {
        return NextResponse.json({ balance: TreasuryStore.getBalance(category) });
    }

    return NextResponse.json({ error: "Category required" }, { status: 400 });
}
