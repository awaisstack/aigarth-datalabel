try {
    const { k12, m14 } = require('@noble/hashes/sha3-addons.js'); // Explicit Extension
    console.log("✅ K12 Found:", typeof k12);
    const hash = k12(new Uint8Array([1, 2, 3]));
    console.log("K12 Hash Length:", hash.length);
} catch (e) {
    console.log("❌ K12 Import Failed:", e.message);
}
