import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from '../constants';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { RefreshTokensModule } from "../refresh-tokens/refresh-tokens.module";

/*
  for more on the Nest JwtModule: https://github.com/nestjs/jwt/blob/master/README.md
  for more details on the available configuration options: https://github.com/auth0/node-jsonwebtoken#usage
 */


@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register/*Async*/({
      /*By importing the same secret used when we signed the JWT,
       we ensure that the verify phase performed by Passport,
       and the sign phase performed in our AuthService, use a common secret.
       */
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    RefreshTokensModule,
    ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
