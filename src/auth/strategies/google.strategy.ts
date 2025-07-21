import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
  ) {
    super(googleConfiguration);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // The validate method is called after the user has been authenticated by Google
    const googleUser = {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      username: profile.emails[0].value.split('@')[0], // Use email prefix as username
      email: profile.emails[0].value,
      role: UserRole.CLIENT,
      avatarUrl: profile.photos ? profile.photos[0].value : null,
      password: '',
    };

    const user = await this.authService.validateGoogleUser(googleUser);

    // Return the  user ID
    done(null, user);
  }
}
