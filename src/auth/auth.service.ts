import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { verifySecret } from '../common/utils/verify-secret.util';
import { JwtService } from '@nestjs/jwt';
import { omit } from '../common/utils/omit.util';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { hashSecret } from '../common/utils/hash-secret.util';
import { CurrentUser } from './types/current-user';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { randomInt } from 'crypto';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { OtpService } from '../otp/otp.service';
import { CreateOtpDto } from '../otp/dto/create-otp.dto';
import { VerifyOtpDto } from '../otp/dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshJwtConfiguration: ConfigType<
      typeof refreshJwtConfig
    >,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await verifySecret(user.password, password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return { id: user.id };
  }

  async validateJwtUser(userId: string) {
    // Check if the user exists
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');

    // If everything is fine, return the user ID and role
    const currentUser: CurrentUser = { id: user.id, role: user.role };
    return currentUser;
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    // Check if the user exists
    const user = await this.userService.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if the refresh token is valid
    const isRefreshTokenValid = await verifySecret(
      user.refreshToken,
      refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // If everything is fine, return the user ID
    return { id: user.id };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    // Check if the user already exists
    const existingUser = await this.userService.findByEmail(googleUser.email);

    if (existingUser) {
      // If the user exists, return the user ID
      return { id: existingUser.id };
    }

    // If the user does not exist, create a new user
    const createdUser = await this.userService.create(googleUser);

    // Send a welcome email to the new user
    await this.mailService.sendWelcomeEmail(
      createdUser.email,
      createdUser.firstName,
      createdUser.role,
    );

    return { id: createdUser.id };
  }

  // Send OTP to the user's email
  async sendOTP(sendOtpDto: CreateOtpDto) {
    return await this.otpService.createOTP(sendOtpDto);
  }

  // Verify the OTP sent to the user's email
  async verifyOTP(verifyOtpDto: VerifyOtpDto) {
    return await this.otpService.validateOTP(verifyOtpDto);
  }

  async login(userId: string) {
    // Generate a JWT token for the user
    const { accessToken, refreshToken } = await this.generateToken(userId);
    const hashedRefreshToken = await hashSecret(refreshToken);
    // Save the hashed refresh token to the database
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);

    return { id: userId, accessToken, refreshToken };
  }

  async logout(userId: string) {
    // Invalidate the refresh token by setting it to null in the database
    await this.userService.updateRefreshToken(userId, null);

    return { message: 'Logged out successfully' };
  }

  async refreshToken(userId: string) {
    // Generate a JWT token for the user
    const { accessToken, refreshToken } = await this.generateToken(userId);
    const hashedRefreshToken = await hashSecret(refreshToken);

    // Save the hashed refresh token to the database
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);

    // refresh token rotation
    return { id: userId, accessToken, refreshToken };
  }

  async generateToken(userId: string) {
    // Generate a JWT token for the user
    const payload: AuthJwtPayload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshJwtConfiguration),
    ]);

    return { accessToken, refreshToken };
  }

  async findProfile(userId: string) {
    const user = await this.userService.findOne(userId);

    // remove sensitive data for security reasons
    return omit(user, ['id', 'password', 'refreshToken']);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    // Check if the user exists
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found');

    // Check if the old password is correct
    const isOldPasswordValid = await verifySecret(
      user.password,
      changePasswordDto.oldPassword,
    );

    // If the old password is not valid, throw an UnauthorizedException
    if (!isOldPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    // Hash the new password and update it in the database
    const hashedNewPassword = await hashSecret(changePasswordDto.newPassword);
    await this.userService.updatePassword(userId, hashedNewPassword);

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // Check if the user exists
    const user = await this.userService.findByEmail(forgotPasswordDto.email);

    if (user) {
      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getHours() + 1); // Set expiration time to 1 hour

      const resetToken = randomInt(100000, 1000000).toString(); // 6-digit string

      // Save the reset token to the database
      await this.tokenService.createToken({
        userId: user.id,
        token: resetToken,
        expiresIn,
      });

      // Send the token to the user's email
      await this.mailService.sendResetPasswordEmail(
        user.firstName,
        forgotPasswordDto.email,
        resetToken,
      );
    }

    return { message: 'If this user exists, you will recieve and email.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetToken, newPassword } = resetPasswordDto;
    // Check if the token exists

    const token = await this.tokenService.validateToken(resetToken);

    // Hash the new password and update it in the database
    const hashedNewPassword = await hashSecret(newPassword);
    const user = await this.userService.updatePassword(
      token.userId,
      hashedNewPassword,
    );

    // Delete the token from the database
    await this.tokenService.deleteToken(resetToken);

    // Send a success email to the user
    await this.mailService.sendResetPasswordSuccessEmail(
      user.firstName,
      user.email,
    );

    return { message: 'Password reset successfully' };
  }
}
