import { DatabaseService } from '../database/database.service';
import { CreateTokenDto } from './dto/creat-token.dto';
export declare class TokenService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    createToken(createTokenDto: CreateTokenDto): Promise<{
        token: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresIn: Date;
    }>;
    findToken(token: string): Promise<{
        token: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresIn: Date;
    } | null>;
    validateToken(resetToken: string): Promise<{
        token: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresIn: Date;
    }>;
    deleteToken(token: string): Promise<{
        token: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresIn: Date;
    }>;
    deleteTokens(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
