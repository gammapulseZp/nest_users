import { Connection } from 'mongoose';
import  RefreshTokenSchema  from "../schemas/refresh-token.schema";
export const refreshTokensProviders = [
  {
    provide: 'REFRESH_TOKEN_MODEL',
    useFactory: (connection: Connection) => connection.model('RefreshToken', RefreshTokenSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
