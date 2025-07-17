import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import mailerConfig from './config/mailer.config';
import { ConfigType } from '@nestjs/config';
import { capitalizeWords } from 'src/common/utils/capitalize-word.util';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    @Inject(mailerConfig.KEY)
    private readonly mailerConfiguration: ConfigType<typeof mailerConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: mailerConfiguration.service,
      host: mailerConfiguration.host,
      port: mailerConfiguration.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: mailerConfiguration.user,
        pass: mailerConfiguration.pass,
      },
    });
  }

  async sendResetPasswordEmail(name: string, to: string, token: string) {
    const resetPasswordLink = `${this.mailerConfiguration.appUrl}/reset-password?token=${token}`;
    const mailOptions = {
      from: `"Koonage Infotec Team" <${this.mailerConfiguration.user}>`,
      to,
      subject: 'Password Reset Request',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #0d6efd;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Use the 6-digit token below to proceed:</p>
        <div style="background: #f8f9fa; padding: 16px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; border: 1px dashed #0d6efd; border-radius: 4px; margin: 20px 0;">
          ${token}
        </div>
        <p style="color: #dc3545;"><strong>Do not share this token with anyone.</strong></p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; color: #6c757d;">Need help? Contact our support team.</p>
        <p style="font-size: 12px; color: #6c757d;">© ${new Date().getFullYear()} Koonage Infotec. All rights reserved.</p>
      </div>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordSuccessEmail(name: string, to: string) {
    const mailOptions = {
      from: `"Koonage Infotec Team" <${this.mailerConfiguration.user}>`,
      to,
      subject: 'Password Reset Successful',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #198754;">Password Reset Successful</h2>
        <p>Hello ${name},</p>
        <p>This is to confirm that your password has been successfully reset.</p>

        <p>If you made this change, no further action is required.</p>

        <p style="color: #dc3545;"><strong>If you did not reset your password, please contact our support team immediately.</strong></p>

        <hr style="margin: 24px 0;">
        <p style="font-size: 12px; color: #6c757d;">For security, always keep your login information private.</p>
        <p style="font-size: 12px; color: #6c757d;">
          This message was sent by Koonage Infotec's secure account management system. If you did not expect this email, please ignore it.
        </p>
        <p style="font-size: 12px; color: #6c757d;">© ${new Date().getFullYear()} Koonage Infotec. All rights reserved.</p>
      </div>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendAccountCreationEmail(
    to: string,
    firstName: string,
    email: string,
    role: string,
    tempPassword: string,
  ) {
    const mailOptions = {
      from: `"Koonage Infotec Team" <${this.mailerConfiguration.user}>`,
      to,
      subject: `Your ${capitalizeWords(role)} Calibration System Account Has Been Created`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #0d6efd; text-align: center;">Welcome to Calibration System!</h2>

        <p>Hello ${firstName},</p>

        <p>
          An account has been created for you by an administrator on the calibration system.
        </p>

        <p>You can now log in using the following credentials:</p>

        <div style="background: #f8f9fa; padding: 16px; font-size: 16px; border: 1px dashed #0d6efd; border-radius: 4px; margin: 20px 0;">
          <p><strong>Login URL:</strong> <a href="https://calibration.com/login" style="color: #0d6efd;">calibration.com/login</a></p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>

        <p style="color: #dc3545;"><strong>Please change your password after logging in for security reasons.</strong></p>

        <p>If you have any questions or concerns, feel free to contact your system administrator.</p>

        <hr style="margin: 24px 0;">
        <p style="font-size: 12px; color: #6c757d;">
          This message was sent by Koonage Infotec's secure account management system. If you did not expect this email, please ignore it.
        </p>
        <p style="font-size: 12px; color: #6c757d;">© ${new Date().getFullYear()} Koonage Infotec. All rights reserved.</p>
      </div>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(to: string, firstName: string, role: string) {
    const mailOptions = {
      from: `"Koonage Infotec Team" <${this.mailerConfiguration.user}>`,
      to,
      subject: `Your ${capitalizeWords(role)} Calibration System Account Has Been Created`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #f5f7fa; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">

          <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 50px 30px; text-align: center; color: #e0f2fe;">
            <h1 style="margin: 0; font-size: 26px;">Welcome to Calibration System</h1>
            <p style="margin-top: 10px; font-size: 16px;">Hi ${firstName}, your ${capitalizeWords(role)} account is now active.</p>
          </div>

          <div style="padding: 30px; text-align: center;">
            <p style="font-size: 16px; color: #555;">
              Your account was created using <strong>Google authentication</strong>.
              Click below to access your dashboard and get started.
            </p>

            <a href="https://your-app-url.com/login"
              style="margin-top: 20px; display: inline-block; background-color: #10b981; color: #fff; text-decoration: none; font-weight: bold; padding: 14px 28px; border-radius: 6px; font-size: 16px;">
              Sign In with Google
            </a>
          </div>

          <div style="padding: 20px 30px; text-align: center; font-size: 14px; color: #888; border-top: 1px solid #eee;">
            <p>If you have any questions, feel free to reach out to <a href="mailto:support@koonage.com" style="color: #3b82f6; text-decoration: none;">support@koonage.com</a></p>
            <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} Koonage Infotec. All rights reserved.</p>
          </div>

        </div>
      </body>
      </html>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
