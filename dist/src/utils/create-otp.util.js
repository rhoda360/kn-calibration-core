"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
const crypto_1 = require("crypto");
function generateOTP() {
    const random = (0, crypto_1.randomInt)(100000, 999999);
    return `${random}`;
}
//# sourceMappingURL=create-otp.util.js.map