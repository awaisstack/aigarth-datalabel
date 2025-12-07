try {
    const hashes = require('@noble/hashes');
    console.log("Root exports:", Object.keys(hashes));
} catch (e) {
    console.log("Root import failed");
}

try {
    const sha3 = require('@noble/hashes/sha3');
    console.log("SHA3 exports:", Object.keys(sha3));
} catch (e) {
    console.log("SHA3 import failed");
}
