import { ConfigType } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
declare const RefreshJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class RefreshJwtStrategy extends RefreshJwtStrategy_base {
    private readonly refreshJwtConfiguration;
    private readonly authService;
    constructor(refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>, authService: AuthService);
    validate(req: Request, payload: AuthJwtPayload): Promise<{
        id: string;
    }>;
}
export {};
