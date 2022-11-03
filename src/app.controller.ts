
import { Controller, Request, Post, UseGuards, Get, Body, Req, Res, Header } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Public } from './custom-decorators/set-metadata.decorator';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { SignUpDto } from './users/dto/sign-up';
import { UsersService } from './users/users.service';
import { UpdateRefreshTokenDto } from "./refresh-tokens/dto/update-refresh-token.dto";
import { CreateRefreshTokenDto } from "./refresh-tokens/dto/create-refresh-token.dto";
import { RefreshTokensService } from "./refresh-tokens/refresh-tokens.service";

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard) //creating own class LocalAuthGuard to avoid magic strings
  @Post('auth/sign-in') //route handler will only be invoked if the user has been validated
  async login(@Res({ passthrough: true }) response: any, @Req() req) { //passthrough - same as next() in express pipline
    return this.authService.login(req.user, req?.ip, response,); //user property is  populated by Passport during the passport-local authentication flow
  }

  @Public()
  @Post('auth/sign-up')
  async signUp(@Body() signUpDto: SignUpDto, refreshTokenDto: CreateRefreshTokenDto) {
    return this.usersService.signUp(signUpDto, refreshTokenDto);
  }


  @Post('auth/logout')
  logout(@Res({ passthrough: true }) response: any) { //passthrough - same as next() in express pipline
    this.authService.logout(response);
  }

  @Post('auth/revoke-token')
  revokeToken(@Body() response: any, @Req() req, updateRefreshTokenDto: UpdateRefreshTokenDto){
    return this.authService.revokeToken(req, updateRefreshTokenDto)
  }

  //@UseGuards(LocalAuthGuard)
  @Public()
  @Post('auth/refresh-token')
  refreshToken(@Req() req, @Res({passthrough: true}) res, updateRefreshTokenDto: UpdateRefreshTokenDto) {
    return this.authService.refreshToken(req, res, updateRefreshTokenDto)
  }


  /*When our GET /profile route is hit, the Guard will automatically invoke
  our passport-jwt custom configured logic,
  validating the JWT, and assigning the user property to the Request object*/
  @UseGuards(JwtAuthGuard) //creating own class JwtAuthGuard to avoid magic strings
  @Get('profile')  //route handler will only be invoked if the user has been validated
  getProfile(@Request() req) {
    console.log('kurwa')
    return req.user;
  }

}

function Private() {
  throw new Error('Function not implemented.');
}
