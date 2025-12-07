const path = require('path');
const cryptoPath = path.resolve(__dirname, '../node_modules/@nouslabs/core/dist/crypto.js');
const k12Path = path.resolve(__dirname, '../node_modules/@nouslabs/core/dist/libFourQ_K12.js');

try {
    const crypto = require(cryptoPath);
    console.log("Crypto Exports:", Object.keys(crypto));
} catch (e) {
    console.log("Crypto Load Failed:", e.message);
}

try {
    const k12 = require(k12Path);
    console.log("K12 Module Exports:", Object.keys(k12));
} catch (e) {
    console.log("K12 Module Load Failed:", e.message);
}
