// Test script to find a funded testnet seed
// Run with: node test_seeds.js

const TESTNET_SEEDS = [
    "fwqatwliqyszxivzgtyyfllymopjimkyoreolgyflsnfpcytkhagqii",
    "xpsxzzfqvaohzzwlbofvqkqeemzhnrscpeeokoumekfodtgzmwghtqm",
    "ukzbkszgzpipmxrrqcxcppumxoxzerrvbjgthinzodrlyblkedutmsy",
    "wgfqazfmgucrluchpuivdkguaijrowcnuclfsjrthfezqapnjelkgll",
    "jbrourvjgffbcyjqoqwdkzxzyebcdkxfxptdorvppqomdhhrrybtvtk",
    "cxoawfycrrjejknfwmuwcxqptoxufkliqxmqvdflxplfhwavqpvmhtw",
    "gnxzmuvhffrpwqsucoxwzknjjxjrqrhfqdxhrghnoxuhlnhkbkbutkv",
    "kbdlubjszyolujwhgxdvxbkdnldplqsoyepfvbmzodncchqwlttynfl",
    "xzckfjqlimwpntbextvhlffdkaopcoxppfkvkpewuywfvbckdxutcyy",
    "mcplrmzyzefbjqhwkxxilqxrloaegjmqwgjqwxtzhsbrrxdkqxpvqft"
];

async function testSeeds() {
    console.log("Testing 10 testnet seeds for balance...\n");

    for (const seed of TESTNET_SEEDS) {
        try {
            // First derive the public ID from seed using a simple hash-based approach
            // Note: This is simplified - real derivation uses the Qubic library
            const seedShort = seed.substring(0, 8);

            // For now, we'll test by querying the local RPC balance endpoint
            // This requires the app to be running

            console.log(`Testing seed: ${seedShort}...`);

            const response = await fetch(`http://localhost:3000/api/rpc/balance?id=TEST_${seedShort}`);
            const data = await response.json();

            console.log(`  Balance result:`, data.balance?.amount || 0);

        } catch (e) {
            console.log(`  Error: ${e.message}`);
        }
    }
}

// We can't run this directly since we need the Qubic library to derive IDs
// Instead, let's just list known funded addresses from docs
console.log(`
Known testnet funded addresses (from docs):
Each should have ~1 billion QU on testnet

The issue is these are from a different testnet epoch/instance.
For the hackathon demo, we should add a fallback display.
`);
