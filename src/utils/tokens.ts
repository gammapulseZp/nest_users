import { jwtConstants } from "src/constants";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Role } from "../enums/role.enum";
import { UpdateRefreshTokenDto } from "../refresh-tokens/dto/update-refresh-token.dto";

export const generateAccessToken = async(payload, signFn) => {
  return signFn.sign(payload, {
    /*
      sign() supplied by @nestjs/jwt library
      to generate our JWT from a subset of the user object properties, which we then return as a simple object
      with a single access_token property. Note: we choose a property name of sub to hold our userId value
      to be consistent with JWT standards.
     */
    //secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    //after deployment or fix process.env // same as secretOrKey in class JwtStrategy
    secret: jwtConstants.secret,
    expiresIn: jwtConstants.expiresIn //not cookie, not token document, encryption purposes only
  })
}
export const generateRefreshToken = async(payload, signFn) => {
  // sign() supplied by @nestjs/jwt library ... check the access_token/generateAccessToken
  return signFn.sign(payload, {
    secret: jwtConstants.refreshSecret,
    expiresIn: jwtConstants.refereshTokenExpiresIn,
  })
}

export const tokenRevocation = async (reqToken, refreshTokenService, updateRefreshTokenDto: UpdateRefreshTokenDto, req, refresh_token_document) => {

  if(!refresh_token_document) {
    throw new NotFoundException(`refresh token: ${reqToken} not found.`);
  }

  // 2. add some fields
  const updatedToken = {
    ...updateRefreshTokenDto,
    revoked: Date.now(),
    revokedByIp: req?.ip,
  }

  // 3. update
  if(req?.body?.token && req?.body?.role !== Role.Admin)  {
    throw new UnauthorizedException('You are neither admin nor the owner');
  }
  await refreshTokenService.update(refresh_token_document?._id, updatedToken)

  return 'Token is revoked'
}
