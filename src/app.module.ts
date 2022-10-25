import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

//Remove if no need
// import { config } from 'dotenv';
// config();

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: './config.env',
    isGlobal: true,
    //ignoreEnvFile: false
  }), UsersModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService, 
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //With this in place, Nest will automatically bind JwtAuthGuard to all endpoints.
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // roles decorator
    },
],
})
export class AppModule {}
// console.log('process.env.JWT_SECRET',process.env.JWT_SECRET);
// console.log('jwtConstants', jwtConstants.secret);
// console.log('process.env.ACLOCAL_PATH',process.env.ACLOCAL_PATH);