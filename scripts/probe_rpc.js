const ENDPOINTS = [
    "https://testnet-rpc.qubic.org/v1/status",
    "https://rpc.qubic.org/v1/status",
    "https://api.qubic.org/v1/status",
    "https://api.qubic.org/v1/latest-tick" // API might have different routes
];

async function probe() {
    console.log("🔍 Probing Qubic Network Endpoints...");

    for (const url of ENDPOINTS) {
        try {
            console.log(`\nTARGET: ${url}`);
            const start = Date.now();
            const res = await fetch(url, { method: 'GET' });
            const diff = Date.now() - start;

            console.log(`STATUS: ${res.status} (${diff}ms)`);
            if (res.ok) {
                const text = await res.text();
                console.log(`RESPONSE: ${text.substring(0, 100)}...`);
                console.log("✅ SUCCESS! We can use this host.");
            }
        } catch (e) {
            console.log(`❌ FAILED: ${e.message}`);
        }
    }
}

probe();
