const fetch = require('node-fetch'); // Or native fetch in newer node
async function test() {
    try {
        const res = await fetch("https://testnet-rpc.qubic.org/v1/broadcast-transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ encodedTransaction: "TEST" })
        });
        console.log("Status:", res.status);
        console.log("Body:", await res.text());
    } catch (e) { console.error(e); }
}
test();
