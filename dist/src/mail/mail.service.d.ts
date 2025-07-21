import mailerConfig from './config/mailer.config';
import { ConfigType } from '@nestjs/config';
export declare class MailService {
    private readonly mailerConfiguration;
    private readonly transporter;
    constructor(mailerConfiguration: ConfigType<typeof mailerConfig>);
    sendResetPasswordEmail(name: string, to: string, token: string): Promise<void>;
    sendResetPasswordSuccessEmail(name: string, to: string): Promise<void>;
    sendAccountCreationEmail(to: string, firstName: string, email: string, role: string, tempPassword: string): Promise<void>;
    sendClientCreationEmail(to: string, firstName: string, email: string, role: string, password: string): Promise<void>;
    sendVerificationCodeEmail(to: string, firstName: string, code: string): Promise<void>;
    sendWelcomeEmail(to: string, firstName: string, role: string): Promise<void>;
}
