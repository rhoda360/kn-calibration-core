import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email address to send the OTP to',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'One Time Password',
    example: '123456',
  })
  @IsString()
  otp: string;
}
