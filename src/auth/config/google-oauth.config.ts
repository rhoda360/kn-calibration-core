import { registerAs } from '@nestjs/config';
import { StrategyOptions } from 'passport-google-oauth20';

export default registerAs(
  'google-oauth',
  (): StrategyOptions => ({
    clientID: process.env.GOOGLE_CLIENT_ID!!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: false,
    scope: ['email', 'profile'],
  }),
);
