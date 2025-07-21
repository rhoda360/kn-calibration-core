"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omit = omit;
function omit(obj, keys) {
    const clone = { ...obj };
    for (const key of keys) {
        delete clone[key];
    }
    return clone;
}
//# sourceMappingURL=omit.util.js.map