import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTokenDto } from './dto/creat-token.dto';

@Injectable()
export class TokenService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createToken(createTokenDto: CreateTokenDto) {
    const { userId, token, expiresIn } = createTokenDto;
    // Check if the token already exists for the user
    await this.deleteTokens(userId);
    return await this.databaseService.token.create({
      data: {
        userId,
        token,
        expiresIn,
      },
    });
  }

  async findToken(token: string) {
    return await this.databaseService.token.findFirst({
      where: {
        token,
      },
    });
  }

  async validateToken(resetToken: string) {
    const token = await this.findToken(resetToken);
    if (!token) throw new UnauthorizedException('Invalid token');

    // Check if the token is expired
    const currentTime = new Date();
    if (currentTime > token.expiresIn) {
      await this.deleteToken(resetToken);
      throw new UnauthorizedException('Token expired');
    }

    return token;
  }

  async deleteToken(token: string) {
    return await this.databaseService.token.delete({
      where: {
        token,
      },
    });
  }

  async deleteTokens(userId: string) {
    return await this.databaseService.token.deleteMany({
      where: {
        userId,
      },
    });
  }
}
