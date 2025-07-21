"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySecret = void 0;
const argon2 = require("argon2");
const verifySecret = async (hashedPassword, password) => {
    return await argon2.verify(hashedPassword, password);
};
exports.verifySecret = verifySecret;
//# sourceMappingURL=verify-secret.util.js.map