// [DEPRECATED]
// We now use Real Qubic Chain via @nouslabs/sdk for "Company Pools" state.
// Payouts are simulated client-side/server-side for now but don't rely on this store.

export const TreasuryStore = {
    getBalance: (_category?: string) => 0,
    addFunds: (_category?: string, _amount?: number) => 0,
    deductFunds: (_category?: string, _amount?: number) => true
};
