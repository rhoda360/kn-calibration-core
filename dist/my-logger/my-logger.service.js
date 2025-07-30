"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyLoggerService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const fs_1 = require("fs");
const path = require("path");
let MyLoggerService = class MyLoggerService extends common_1.ConsoleLogger {
    async logToFile(entry) {
        const formattedEntry = `${Intl.DateTimeFormat('en-US', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'africa/lagos',
        }).format(new Date())}\t${entry}\n`;
        try {
            if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
                await fs_1.promises.mkdir(path.join(__dirname, '..', '..', 'logs'));
            }
            await fs_1.promises.appendFile(path.join(__dirname, '..', '..', 'logs', 'app.log'), formattedEntry);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }
    log(message, context) {
        const entry = `${context}\t${message}`;
        super.log(entry, context);
    }
    error(message, stackOrContext) {
        const formattedMessage = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
        const entry = `${stackOrContext}\t${formattedMessage}`;
        super.error(entry, stackOrContext);
    }
};
exports.MyLoggerService = MyLoggerService;
exports.MyLoggerService = MyLoggerService = __decorate([
    (0, common_1.Injectable)()
], MyLoggerService);
//# sourceMappingURL=my-logger.service.js.map