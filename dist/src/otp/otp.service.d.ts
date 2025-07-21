import { CreateOtpDto } from './dto/create-otp.dto';
import { DatabaseService } from '../database/database.service';
import { MailService } from '../mail/mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class OtpService {
    private readonly databaseService;
    private readonly mailService;
    constructor(databaseService: DatabaseService, mailService: MailService);
    createOTP(createOtpDto: CreateOtpDto): Promise<{
        message: string;
    }>;
    findOTP(validateOtpDto: VerifyOtpDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresIn: Date;
        otp: string;
        isVerified: boolean;
    } | null>;
    validateOTP(validateOtpDto: VerifyOtpDto): Promise<{
        verified: boolean;
        email: string;
    }>;
    deleteToken(deleteOtpDto: VerifyOtpDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresIn: Date;
        otp: string;
        isVerified: boolean;
    }>;
    deleteOTPs(email: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
