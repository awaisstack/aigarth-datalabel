// Test ESM imports with extensions
import { k12 } from '@noble/hashes/sha3-addons.js';

console.log("K12 imported:", typeof k12);

try {
    const hash = k12(new Uint8Array([1, 2, 3]));
    console.log("K12 Hash Length:", hash.length);
} catch (e) {
    console.error("K12 Hash failed:", e);
}
