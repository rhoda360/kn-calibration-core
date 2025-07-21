"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserName = generateUserName;
const crypto_1 = require("crypto");
function generateUserName(prefix) {
    const random = (0, crypto_1.randomInt)(10000000, 99999999);
    return `${prefix}-${random}`;
}
//# sourceMappingURL=create-username.util.js.map