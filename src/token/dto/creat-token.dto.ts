import { IsDate, IsString, IsUUID } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  token: string;

  @IsDate()
  expiresIn: Date;
}
