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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const create_otp_util_1 = require("../utils/create-otp.util");
const mail_service_1 = require("../mail/mail.service");
let OtpService = class OtpService {
    databaseService;
    mailService;
    constructor(databaseService, mailService) {
        this.databaseService = databaseService;
        this.mailService = mailService;
    }
    async createOTP(createOtpDto) {
        const { email, firstName } = createOtpDto;
        await this.deleteOTPs(email);
        const otp = (0, create_otp_util_1.generateOTP)();
        const expiresIn = new Date();
        expiresIn.setMinutes(expiresIn.getMinutes() + 30);
        const createdOtp = await this.databaseService.oneTimePassword.create({
            data: {
                email,
                otp,
                expiresIn,
            },
        });
        if (!createdOtp) {
            throw new common_1.UnauthorizedException('Failed to create OTP');
        }
        await this.mailService.sendVerificationCodeEmail(email, firstName, otp);
        return {
            message: 'OTP created and sent successfully',
        };
    }
    async findOTP(validateOtpDto) {
        return await this.databaseService.oneTimePassword.findFirst({
            where: {
                otp: validateOtpDto.otp,
                email: validateOtpDto.email,
            },
        });
    }
    async validateOTP(validateOtpDto) {
        const otpRecord = await this.findOTP(validateOtpDto);
        if (!otpRecord)
            throw new common_1.UnauthorizedException('Invalid OTP');
        const currentTime = new Date();
        if (currentTime > otpRecord.expiresIn) {
            await this.deleteToken(validateOtpDto);
            throw new common_1.UnauthorizedException('OTP expired');
        }
        await this.databaseService.oneTimePassword.update({
            where: {
                otp: validateOtpDto.otp,
                email: validateOtpDto.email,
            },
            data: {
                isVerified: true,
            },
        });
        return { verified: true, email: otpRecord.email };
    }
    async deleteToken(deleteOtpDto) {
        return await this.databaseService.oneTimePassword.delete({
            where: {
                otp: deleteOtpDto.otp,
                email: deleteOtpDto.email,
            },
        });
    }
    async deleteOTPs(email) {
        return await this.databaseService.oneTimePassword.deleteMany({
            where: {
                email,
            },
        });
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        mail_service_1.MailService])
], OtpService);
//# sourceMappingURL=otp.service.js.map