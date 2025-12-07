try {
    const { k12, m14 } = require('@noble/hashes/sha3-addons');
    console.log("✅ K12 Found in sha3-addons:", !!k12);
} catch (e) {
    console.log("❌ K12 NOT Found in sha3-addons", e.message);
}
