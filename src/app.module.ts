import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

const envModule = ConfigModule.forRoot({
  //envFilePath: './config.env',
  isGlobal: true,
})
import { AppController } from "./app.controller";
import { UsersModule } from "./resources/users/users.module";
import { RefreshTokensModule } from "./resources/refresh-tokens/refresh-tokens.module";
import { AuthModule } from "./resources/auth/auth.module";

@Module({
  imports: [
    envModule,
    //CacheModule.register(),
    UsersModule, AuthModule, RefreshTokensModule],
  controllers: [AppController],
})
export class AppModule {}
