import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { DatabaseService } from '../database/database.service';
import { generateOTP } from '../utils/create-otp.util';
import { MailService } from '../mail/mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class OtpService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
  ) {}

  async createOTP(createOtpDto: CreateOtpDto) {
    const { email, firstName } = createOtpDto;
    // Delete any existing OTPs for the email
    await this.deleteOTPs(email);

    // Generate a new OTP
    const otp = generateOTP();
    // Set the expiration time to 10 minutes from now
    const expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + 10); // 10 minutes

    const createdOtp = await this.databaseService.oneTimePassword.create({
      data: {
        email,
        otp,
        expiresIn,
      },
    });

    if (!createdOtp) {
      throw new UnauthorizedException('Failed to create OTP');
    }

    await this.mailService.sendVerificationCodeEmail(email, firstName, otp);

    return {
      message: 'OTP created and sent successfully',
    };
  }

  async findOTP(validateOtpDto: VerifyOtpDto) {
    return await this.databaseService.oneTimePassword.findFirst({
      where: {
        otp: validateOtpDto.otp,
        email: validateOtpDto.email,
      },
    });
  }

  async validateOTP(validateOtpDto: VerifyOtpDto) {
    const otpRecord = await this.findOTP(validateOtpDto);
    if (!otpRecord) throw new UnauthorizedException('Invalid OTP');

    // Check if the OTP is expired
    const currentTime = new Date();
    if (currentTime > otpRecord.expiresIn) {
      await this.deleteToken(validateOtpDto);
      throw new UnauthorizedException('OTP expired');
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

  async deleteToken(deleteOtpDto: VerifyOtpDto) {
    return await this.databaseService.oneTimePassword.delete({
      where: {
        otp: deleteOtpDto.otp,
        email: deleteOtpDto.email,
      },
    });
  }

  async deleteOTPs(email: string) {
    return await this.databaseService.oneTimePassword.deleteMany({
      where: {
        email,
      },
    });
  }
}
