try {
    const { k12 } = require('@noble/hashes/k12');
    console.log("✅ K12 Found");
} catch (e) {
    console.log("❌ K12 NOT Found in @noble/hashes/k12");
    try {
        const { k12 } = require('@noble/hashes');
        if (k12) console.log("✅ K12 Found in root");
        else console.log("❌ K12 NOT Found in root");
    } catch (e2) {
        console.log("❌ K12 Import Failed completely");
    }
}
