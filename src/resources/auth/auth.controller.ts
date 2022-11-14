import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { Public } from "../../custom-decorators/set-metadata.decorator";
import { LocalAuthGuard } from "../../guards/local-auth.guard";

@Controller()
export class AuthController {
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
}
