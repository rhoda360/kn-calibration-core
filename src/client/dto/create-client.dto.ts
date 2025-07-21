import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    description: 'Company name of the user',
    example: 'Tech Corp',
  })
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john_doe@example.com',
  })
  email: string;

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
    description: 'Password for the user account',
    example: 'P@ssw0rd123',
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Company registration number',
    example: 'RC123456',
  })
  rcNumber?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Company address',
    example: '123 Tech Street, Silicon Valley',
  })
  address?: string;

  @IsString()
  @IsOptional()
  @Matches(/^(?:0|\+234)(7|8|9)[01]\d{8}$/, {
    message: 'Phone number must be a valid Nigerian mobile number',
  })
  @ApiPropertyOptional({
    description: 'Phone number of the user',
    example: '+2347012345678',
    required: false,
  })
  phone?: string;

  @IsEnum(UserRole, { message: 'Valid role required' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.CLIENT,
    required: false,
  })
  role?: UserRole;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Avatar URL for the user',
    example: 'https://example.com/avatar/john_doe.png',
    required: false,
  })
  avatarUrl?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Indicates if the user is active',
    example: true,
    required: false,
  })
  isActive?: boolean;
}
