import * as ed from '@noble/ed25519';
import { sha256 } from '@noble/hashes/sha2.js';

const DEMO_SEED = "fwqatwliqyszxivzgtyyfllymopjimkyoreolgyflsnfpcytkhagqii";

async function testSigning() {
    console.log("🧪 STARTING HEADLESS SIGNING TEST");

    try {
        console.log("1. Hashing Seed...");
        const seedBytes = new TextEncoder().encode(DEMO_SEED);
        const privateKey = sha256(seedBytes);
        console.log("   Private Key Length:", privateKey.length);

        console.log("2. Deriving Public Key...");
        const publicKey = await ed.getPublicKeyAsync(privateKey);
        console.log("   Public Key:", publicKey ? "Generated" : "FAILED");
        // Hex representation
        console.log("   Public Key (Hex):", Buffer.from(publicKey).toString('hex'));

        console.log("3. Signing Dummy Payload...");
        const payload = new Uint8Array(32).fill(1);
        const digest = sha256(payload);
        const signature = await ed.signAsync(digest, privateKey);

        console.log("   Signature Length:", signature.length);
        console.log("✅ SUCCESS: Crypto logic is valid.");

    } catch (e) {
        console.error("❌ CRITICAL FAILURE:", e);
    }
}

testSigning();
