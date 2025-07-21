import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { DatabaseModule } from 'src/database/database.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [DatabaseModule, UserModule, MailModule],
  controllers: [ClientController],
  providers: [ClientService, UserService],
})
export class ClientModule {}
