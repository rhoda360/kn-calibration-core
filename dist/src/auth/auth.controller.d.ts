import { AuthService } from './auth.service';
import { RequestWithUser } from './types/request-with-user';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateOtpDto } from 'src/otp/dto/create-otp.dto';
import { VerifyOtpDto } from 'src/otp/dto/verify-otp.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: RequestWithUser): Promise<{
        id: string;
        accessToken: string;
        refreshToken: string;
    }>;
    googleLogin(): Promise<void>;
    googleCallback(req: RequestWithUser): Promise<{
        id: string;
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(req: RequestWithUser): Promise<{
        message: string;
    }>;
    refresh(req: RequestWithUser): Promise<{
        id: string;
        accessToken: string;
        refreshToken: string;
    }>;
    sendOTP(createOtpDto: CreateOtpDto): Promise<{
        message: string;
    }>;
    verifyOTP(verifyOTPDto: VerifyOtpDto): Promise<{
        verified: boolean;
        email: string;
    }>;
    findProfile(req: RequestWithUser): Promise<Omit<{
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
    changePassword(req: RequestWithUser, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
