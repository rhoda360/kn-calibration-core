import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { DatabaseService } from '../database/database.service';

@Module({
  exports: [TokenService],
  providers: [TokenService, DatabaseService],
})
export class TokenModule {}
