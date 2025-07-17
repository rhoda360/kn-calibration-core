import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import mailerConfig from './config/mailer.config';

@Module({
  imports: [ConfigModule.forFeature(mailerConfig)],
  exports: [MailService],
  providers: [MailService],
})
export class MailModule {}
