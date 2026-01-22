const crypto = require("crypto");
//encryption key must be 32 bytes for aes-256 algorithm
console.log(crypto.randomBytes(32).toString("hex"));
//initialization vector must be 16 bytes for aes-256 algorithm
console.log(crypto.randomBytes(16).toString("hex"));
