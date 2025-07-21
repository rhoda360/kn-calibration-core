"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let TokenService = class TokenService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async createToken(createTokenDto) {
        const { userId, token, expiresIn } = createTokenDto;
        await this.deleteTokens(userId);
        return await this.databaseService.token.create({
            data: {
                userId,
                token,
                expiresIn,
            },
        });
    }
    async findToken(token) {
        return await this.databaseService.token.findFirst({
            where: {
                token,
            },
        });
    }
    async validateToken(resetToken) {
        const token = await this.findToken(resetToken);
        if (!token)
            throw new common_1.UnauthorizedException('Invalid token');
        const currentTime = new Date();
        if (currentTime > token.expiresIn) {
            await this.deleteToken(resetToken);
            throw new common_1.UnauthorizedException('Token expired');
        }
        return token;
    }
    async deleteToken(token) {
        return await this.databaseService.token.delete({
            where: {
                token,
            },
        });
    }
    async deleteTokens(userId) {
        return await this.databaseService.token.deleteMany({
            where: {
                userId,
            },
        });
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], TokenService);
//# sourceMappingURL=token.service.js.map