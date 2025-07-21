import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { DatabaseModule } from '../database/database.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [DatabaseModule, UserModule, MailModule],
  controllers: [ClientController],
  providers: [ClientService, UserService],
})
export class ClientModule {}
