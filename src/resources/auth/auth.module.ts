import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { RefreshTokensModule } from "../refresh-tokens/refresh-tokens.module";
import { UsersModule } from "../users/users.module";
import { AppService } from "../../app.service";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { AuthController } from "./auth.controller";

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
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    RefreshTokensModule,
    ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenStrategy, AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //With this in place, Nest will automatically bind JwtAuthGuard to all endpoints.
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // roles decorator
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
