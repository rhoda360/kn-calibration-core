import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MailModule } from 'src/mail/mail.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [MailModule, DatabaseModule],
  providers: [OtpService],
})
export class OtpModule {}
