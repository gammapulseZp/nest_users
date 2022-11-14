import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { RefreshTokensController } from './refresh-tokens.controller';
import { refreshTokensProviders } from "../providers_mongoose/refresh-tokens.providers";
import { DatabaseModule } from "../mongoose-setup/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [RefreshTokensController],
  providers: [
    RefreshTokensService,
    ...refreshTokensProviders
  ],
   exports: [...refreshTokensProviders, RefreshTokensService]
})
export class RefreshTokensModule {}
