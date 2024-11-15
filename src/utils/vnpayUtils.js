// /utils/vnpayUtils.js
const crypto = require('crypto');

exports.generateHash = (data) => {
    return crypto.createHmac('sha256', 'YOUR_HASH_SECRET').update(data).digest('hex');
};
