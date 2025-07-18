import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must include uppercase, lowercase, number, special character, and be at least 8 characters',
    },
  )
  @ApiProperty({
    description: 'New password for the user account',
    example: 'N3wP@ssw0rd123',
  })
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'Reset token must be exactly 6 characters long' })
  @ApiProperty({
    description: 'Reset token for password reset',
    example: '123456',
  })
  resetToken: string;
}
