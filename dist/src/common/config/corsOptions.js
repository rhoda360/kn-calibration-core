"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const allowed_origins_config_1 = require("./allowed-origins.config");
exports.corsOptions = {
    origin: (origin, callback) => {
        if (allowed_origins_config_1.allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
};
//# sourceMappingURL=corsOptions.js.map