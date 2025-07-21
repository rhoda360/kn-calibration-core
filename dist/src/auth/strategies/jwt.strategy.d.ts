import { ConfigType } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { AuthService } from '../auth.service';
import { CurrentUser } from '../types/current-user';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly jwtConfiguration;
    private readonly authService;
    constructor(jwtConfiguration: ConfigType<typeof jwtConfig>, authService: AuthService);
    validate(payload: AuthJwtPayload): Promise<CurrentUser>;
}
export {};
