import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MailModule } from '../mail/mail.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [MailModule, DatabaseModule],
  providers: [OtpService],
})
export class OtpModule {}
