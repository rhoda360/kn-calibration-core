import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateOtpDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @IsEmail()
  @ApiProperty({
    description: 'Email address to send the OTP to',
    example: 'user@example.com',
  })
  email: string;
}
