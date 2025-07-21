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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const verify_secret_util_1 = require("../common/utils/verify-secret.util");
const jwt_1 = require("@nestjs/jwt");
const omit_util_1 = require("../common/utils/omit.util");
const refresh_jwt_config_1 = require("./config/refresh-jwt.config");
const hash_secret_util_1 = require("../common/utils/hash-secret.util");
const crypto_1 = require("crypto");
const token_service_1 = require("../token/token.service");
const mail_service_1 = require("../mail/mail.service");
const otp_service_1 = require("../otp/otp.service");
let AuthService = class AuthService {
    userService;
    mailService;
    jwtService;
    tokenService;
    otpService;
    refreshJwtConfiguration;
    constructor(userService, mailService, jwtService, tokenService, otpService, refreshJwtConfiguration) {
        this.userService = userService;
        this.mailService = mailService;
        this.jwtService = jwtService;
        this.tokenService = tokenService;
        this.otpService = otpService;
        this.refreshJwtConfiguration = refreshJwtConfiguration;
    }
    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const isPasswordValid = await (0, verify_secret_util_1.verifySecret)(user.password, password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return { id: user.id };
    }
    async validateJwtUser(userId) {
        const user = await this.userService.findOne(userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found!');
        const currentUser = { id: user.id, role: user.role };
        return currentUser;
    }
    async validateRefreshToken(userId, refreshToken) {
        const user = await this.userService.findOne(userId);
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const isRefreshTokenValid = await (0, verify_secret_util_1.verifySecret)(user.refreshToken, refreshToken);
        if (!isRefreshTokenValid) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return { id: user.id };
    }
    async validateGoogleUser(googleUser) {
        const existingUser = await this.userService.findByEmail(googleUser.email);
        if (existingUser) {
            return { id: existingUser.id };
        }
        const createdUser = await this.userService.create(googleUser);
        await this.mailService.sendWelcomeEmail(createdUser.email, createdUser.firstName, createdUser.role);
        return { id: createdUser.id };
    }
    async sendOTP(sendOtpDto) {
        return await this.otpService.createOTP(sendOtpDto);
    }
    async verifyOTP(verifyOtpDto) {
        return await this.otpService.validateOTP(verifyOtpDto);
    }
    async login(userId) {
        const { accessToken, refreshToken } = await this.generateToken(userId);
        const hashedRefreshToken = await (0, hash_secret_util_1.hashSecret)(refreshToken);
        await this.userService.updateRefreshToken(userId, hashedRefreshToken);
        return { id: userId, accessToken, refreshToken };
    }
    async logout(userId) {
        await this.userService.updateRefreshToken(userId, null);
        return { message: 'Logged out successfully' };
    }
    async refreshToken(userId) {
        const { accessToken, refreshToken } = await this.generateToken(userId);
        const hashedRefreshToken = await (0, hash_secret_util_1.hashSecret)(refreshToken);
        await this.userService.updateRefreshToken(userId, hashedRefreshToken);
        return { id: userId, accessToken, refreshToken };
    }
    async generateToken(userId) {
        const payload = { sub: userId };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshJwtConfiguration),
        ]);
        return { accessToken, refreshToken };
    }
    async findProfile(userId) {
        const user = await this.userService.findOne(userId);
        return (0, omit_util_1.omit)(user, ['id', 'password', 'refreshToken']);
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.userService.findOne(userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const isOldPasswordValid = await (0, verify_secret_util_1.verifySecret)(user.password, changePasswordDto.oldPassword);
        if (!isOldPasswordValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const hashedNewPassword = await (0, hash_secret_util_1.hashSecret)(changePasswordDto.newPassword);
        await this.userService.updatePassword(userId, hashedNewPassword);
        return { message: 'Password changed successfully' };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.userService.findByEmail(forgotPasswordDto.email);
        if (user) {
            const expiresIn = new Date();
            expiresIn.setHours(expiresIn.getHours() + 1);
            const resetToken = (0, crypto_1.randomInt)(100000, 1000000).toString();
            await this.tokenService.createToken({
                userId: user.id,
                token: resetToken,
                expiresIn,
            });
            await this.mailService.sendResetPasswordEmail(user.firstName, forgotPasswordDto.email, resetToken);
        }
        return { message: 'If this user exists, you will recieve and email.' };
    }
    async resetPassword(resetPasswordDto) {
        const { resetToken, newPassword } = resetPasswordDto;
        const token = await this.tokenService.validateToken(resetToken);
        const hashedNewPassword = await (0, hash_secret_util_1.hashSecret)(newPassword);
        const user = await this.userService.updatePassword(token.userId, hashedNewPassword);
        await this.tokenService.deleteToken(resetToken);
        await this.mailService.sendResetPasswordSuccessEmail(user.firstName, user.email);
        return { message: 'Password reset successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, common_1.Inject)(refresh_jwt_config_1.default.KEY)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        mail_service_1.MailService,
        jwt_1.JwtService,
        token_service_1.TokenService,
        otp_service_1.OtpService, void 0])
], AuthService);
//# sourceMappingURL=auth.service.js.map