// [DEPRECATED]
// We now use Real Qubic Chain via @nouslabs/sdk for "Company Pools" state.
// Payouts are simulated client-side/server-side for now but don't rely on this store.

export const TreasuryStore = {
    getBalance: () => 0,
    addFunds: () => 0,
    deductFunds: () => true
};
