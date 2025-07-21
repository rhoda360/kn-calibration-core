"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashSecret = void 0;
const argon2 = require("argon2");
const hashSecret = async (password) => {
    return await argon2.hash(password);
};
exports.hashSecret = hashSecret;
//# sourceMappingURL=hash-secret.util.js.map