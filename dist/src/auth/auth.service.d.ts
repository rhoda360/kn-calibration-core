import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { CurrentUser } from './types/current-user';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { OtpService } from '../otp/otp.service';
import { CreateOtpDto } from '../otp/dto/create-otp.dto';
import { VerifyOtpDto } from '../otp/dto/verify-otp.dto';
export declare class AuthService {
    private readonly userService;
    private readonly mailService;
    private readonly jwtService;
    private readonly tokenService;
    private readonly otpService;
    private readonly refreshJwtConfiguration;
    constructor(userService: UserService, mailService: MailService, jwtService: JwtService, tokenService: TokenService, otpService: OtpService, refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>);
    validateUser(email: string, password: string): Promise<{
        id: string;
    }>;
    validateJwtUser(userId: string): Promise<CurrentUser>;
    validateRefreshToken(userId: string, refreshToken: string): Promise<{
        id: string;
    }>;
    validateGoogleUser(googleUser: CreateUserDto): Promise<{
        id: string;
    }>;
    sendOTP(sendOtpDto: CreateOtpDto): Promise<{
        message: string;
    }>;
    verifyOTP(verifyOtpDto: VerifyOtpDto): Promise<{
        verified: boolean;
        email: string;
    }>;
    login(userId: string): Promise<{
        id: string;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    refreshToken(userId: string): Promise<{
        id: string;
        accessToken: string;
        refreshToken: string;
    }>;
    generateToken(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    findProfile(userId: string): Promise<Omit<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        avatarUrl: string;
        isActive: boolean;
        id: string;
        username: string;
        refreshToken: string | null;
        deactivatedAt: Date | null;
        deactivatedById: string | null;
        deactivationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, "password" | "id" | "refreshToken">>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
