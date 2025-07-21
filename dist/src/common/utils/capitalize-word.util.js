"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeWords = void 0;
const capitalizeWords = (str) => {
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
exports.capitalizeWords = capitalizeWords;
//# sourceMappingURL=capitalize-word.util.js.map