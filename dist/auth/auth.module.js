"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const local_strategy_1 = require("./strategies/local.strategy");
const database_module_1 = require("../database/database.module");
const user_module_1 = require("../user/user.module");
const user_service_1 = require("../user/user.service");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const jwt_config_1 = require("./config/jwt.config");
const config_1 = require("@nestjs/config");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const refresh_jwt_config_1 = require("./config/refresh-jwt.config");
const refresh_strategy_1 = require("./strategies/refresh.strategy");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./guards/jwt-auth/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles/roles.guard");
const token_module_1 = require("../token/token.module");
const mail_module_1 = require("../mail/mail.module");
const google_oauth_config_1 = require("./config/google-oauth.config");
const google_strategy_1 = require("./strategies/google.strategy");
const otp_module_1 = require("../otp/otp.module");
const otp_service_1 = require("../otp/otp.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            user_module_1.UserModule,
            otp_module_1.OtpModule,
            passport_1.PassportModule,
            token_module_1.TokenModule,
            mail_module_1.MailModule,
            jwt_1.JwtModule.registerAsync(jwt_config_1.default.asProvider()),
            config_1.ConfigModule.forFeature(jwt_config_1.default),
            config_1.ConfigModule.forFeature(refresh_jwt_config_1.default),
            config_1.ConfigModule.forFeature(google_oauth_config_1.default),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            user_service_1.UserService,
            otp_service_1.OtpService,
            local_strategy_1.LocalStrategy,
            jwt_strategy_1.JwtStrategy,
            refresh_strategy_1.RefreshJwtStrategy,
            google_strategy_1.GoogleStrategy,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map