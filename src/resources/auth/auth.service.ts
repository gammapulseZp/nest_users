import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { jwtConstants } from '../constants';
import { generateAccessToken, generateRefreshToken, tokenRevocation } from "src/utils/tokens";
import { RefreshTokensService } from "../refresh-tokens/refresh-tokens.service";
import { Model, SchemaTypes, ObjectId } from "mongoose";
import { RefreshToken } from "../interfaces_mongoose";
import { UpdateRefreshTokenDto } from "../refresh-tokens/dto/update-refresh-token.dto";
import { catchError } from "../utils/all-exseptions-custom-filter";
import { Role } from "../enums/role.enum";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UpdateUserDto } from "../users/dto/update-user.dto";

type User = Omit<RefreshToken & {_id: ObjectId}, never>;

@Injectable()
export class AuthService {
  // Don't forget to inject the JwtService provider into the AuthService.
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokensService,
    @Inject('REFRESH_TOKEN_MODEL')
    private refreshTokenModel: Model<RefreshToken>
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
     const passwordMatches = await argon2.verify(user.password, pass); //never-ever put argon2.verify in login function
     if (!passwordMatches) throw new BadRequestException('Password is incorrect');

    if (user) {
      const { password, ...result } = user;

      return result;
    }
    throw new BadRequestException('Username is incorrect ');
  }


  async login(user: any, requestIp: string, response: any) { //NEST's internal object (user) => any
    const payload = { username: user.username, sub: user.userId };
    const refresh_token = await generateRefreshToken(payload, this.jwtService)
     await response.cookie('refresh_token', refresh_token, { //also sets automatically the 'Set-Cookie' header
      httpOnly: true,
      expiresIn: jwtConstants.refereshTokenExpiresIn, //cookie expires in, so the token too
    })
    await this.refreshTokenModel.create({
        token: refresh_token,
        user: user._doc._id,
        createdByIp: requestIp,
        expires: Date.now() + 7*24*60*60*1000,
      })
    const access_token = await generateAccessToken(payload, this.jwtService)

    return {
      access_token,
      user: user._doc
    };
  }

  async revokeToken(req, updateRefreshTokenDto: UpdateRefreshTokenDto) {
    try {
      //check body first since admin have own refresh token in cookies
      const reqToken = req?.body?.token || req?.cookies?.refresh_token; //admin sends token in body, user owner - from cookies
      if (!reqToken) throw new BadRequestException('Token is required');
      // 1. find token document in db
      const refresh_token_document = await this.refreshTokenService.findTokenDocument(reqToken)
      // 2, 3 happen in tokenRevocation
      await tokenRevocation(reqToken, this.refreshTokenService, updateRefreshTokenDto, req, refresh_token_document)

      return `Token ${reqToken} is revoked`
      } catch (err) {
        catchError(err, 'auth')
      }
  }

  async logout(response: any) {
    response.cookie('refresh_token', null)
    return 'refresh_token !!cookie!! invalidated'
  }

  async refreshToken(req, response, updateRefreshTokenDto: UpdateRefreshTokenDto,) {
    try {
      const reqToken = req?.cookies?.refresh_token;

      // 1. find token document in db
      const refresh_token_document = await this.refreshTokenService.findTokenDocument(reqToken)
      if (!reqToken || !refresh_token_document?.isActive) throw new BadRequestException('Active token is required');

      // 2, 3 happen in tokenRevocation
      await tokenRevocation(reqToken, this.refreshTokenService, updateRefreshTokenDto, req, refresh_token_document)

      //console.log('refresh_token_document', refresh_token_document);

      // 4. populate user details from refresh_token_document for generating new and returning user's data
      const user_document = await refresh_token_document.populate({path: "user" })
      const user = user_document?.user
      console.log('user', user);

      // 5. generate new refresh token
      const payload = { username: (user as unknown as UpdateUserDto)?.username, sub: (user as unknown as User)?._id};
     const new_token = await generateRefreshToken(payload, this.jwtService)
     console.log('newToken', new_token);

      // 6. generate new access token
      const access_token = await generateAccessToken(payload, this.jwtService)

      // 7. set refresh token cookie
      await response.cookie('refresh_token', new_token, {
        httpOnly: true,
        expiresIn: jwtConstants.refereshTokenExpiresIn,
      })

      return {
        access_token,
        user,
      }

    } catch (err) {
      catchError(err, 'auth')
    }
  }
}
