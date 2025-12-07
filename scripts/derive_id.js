const path = require('path');
const cryptoPath = path.resolve(__dirname, '../node_modules/@nouslabs/core/dist/crypto.js');
const identityPath = path.resolve(__dirname, '../node_modules/@nouslabs/core/dist/identity.js');
// K12 might be internal or part of crypto. Let's try to get it.

const TEST_SEED = "fwqatwliqyszxivzgtyyfllymopjimkyoreolgyflsnfpcytkhagqii";

async function main() {
    try {
        console.log("Loading crypto...");
        const { getCrypto } = require(cryptoPath);
        const { identityBytesToString } = require(identityPath);

        const crypto = await getCrypto();
        console.log("Crypto loaded.");

        // We need to convert 55-char seed to 32-byte secret key.
        // Qubic Standard: SecretKey = K12(seed, 32, 0)
        // We need to find the K12 function. 
        // 'crypto' object usually has it.
        // let's check keys of crypto object.
        console.log("Crypto methods:", Object.keys(crypto));

        if (crypto.k12) {
            console.log("Using crypto.k12...");

            // Convert seed string to bytes
            const seedBytes = new Uint8Array(TEST_SEED.length);
            for (let i = 0; i < TEST_SEED.length; i++) {
                seedBytes[i] = TEST_SEED.charCodeAt(i);
            }

            const secretKey = crypto.k12(seedBytes, 32);
            console.log("Secret Key derived.");

            const publicKey = crypto.generatePublicKey(secretKey);
            console.log("Public Key derived.");

            const id = identityBytesToString(publicKey);
            console.log("DERIVED IDENTITY:", id);
        } else {
            console.log("K12 not found in crypto object.");
        }

    } catch (e) {
        console.error("Derivation Error:", e);
    }
}

main();
