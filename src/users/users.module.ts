import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { usersProviders } from './providers_mongoose/users.providers';
import { DatabaseModule } from 'src/mongoose-setup/database.module';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register/*Async*/({
      /*By importing the same secret used when we signed the JWT,
       we ensure that the verify phase performed by Passport, 
       and the sign phase performed in our AuthService, use a common secret.
       */
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    ...usersProviders,
  ],
  exports: [UsersService] // for auth needs
})
export class UsersModule {}
