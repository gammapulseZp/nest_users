import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { Public } from "../../custom-decorators/set-metadata.decorator";
import { LocalAuthGuard } from "../../guards/local-auth.guard";
import { SignUpDto } from "../users/dto/sign-up";
import { CreateRefreshTokenDto } from "../refresh-tokens/dto/create-refresh-token.dto";
import { UpdateRefreshTokenDto } from "../refresh-tokens/dto/update-refresh-token.dto";
import { RefreshTokenResponse } from "../../ts-types";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
  constructor(
     private authService: AuthService,
     private usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Log in' })
  @Public() //custom decorator that uses JwtAuthGuard's canActivate method under hood
  @UseGuards(LocalAuthGuard) //creating own class LocalAuthGuard to avoid magic strings
  @Post('/sign-in') //route handler will only be invoked if the user has been validated
  async login(@Res({ passthrough: true }) response: any, @Req() req) { //passthrough - same as next() in express pipline
    return this.authService.login(req.user, req?.ip, response,); //user property is  populated by Passport during the passport-local authentication flow
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: 201, description: 'The created user record.', type: CreateRefreshTokenDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({type: SignUpDto})
  @Public()
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto, refreshTokenDto: CreateRefreshTokenDto) {
    return this.usersService.signUp(signUpDto, refreshTokenDto);
  }

  @ApiOperation({ summary: 'Log out' })
  @ApiResponse({ status: 204, description: 'Sucessfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('/logout')
  logout(@Res({ passthrough: true }) response: any): Promise<string> { //passthrough - same as next() in express pipline
    return this.authService.logout(response);
  }

  @ApiOperation({ summary: 'Revoke the current refresh token' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('/revoke-token')
  revokeToken(@Body() response: any, @Req() req, updateRefreshTokenDto: UpdateRefreshTokenDto): Promise<string>{
    return this.authService.revokeToken(req, updateRefreshTokenDto)
  }

  @ApiOperation({ summary: 'Generate new access and refresh token' })
  @ApiResponse({ status: 201, description: 'The updated refresh token record.', type: UpdateRefreshTokenDto })
  @Public()
  @Post('/refresh-token')
  refreshToken(@Req() req, @Res({passthrough: true}) res, updateRefreshTokenDto: UpdateRefreshTokenDto): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(req, res, updateRefreshTokenDto)
  }
}
