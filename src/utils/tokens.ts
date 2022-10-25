import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';
export const generateRefreshToken = async(payload, signFn) => {
  // sign() supplied by @nestjs/jwt library ... check the access_token
  const refresh_token = /*await? */ signFn.sign(payload, {
    secret: jwtConstants.refreshSecret,
    expiresIn: jwtConstants.refereshTokenExpiresIn, //not cookie
  })
  return refresh_token
}