const crypto = require('crypto');
const jwtPrivateKey = crypto.randomBytes(64).toString('hex');
console.log(jwtPrivateKey);
