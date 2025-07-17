import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
  name: process.env.MAIL_NAME,
  appUrl: process.env.APP_URL,
}));
