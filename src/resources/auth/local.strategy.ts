import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    /*
    We can pass an options object in the call to super() 
    to customize the behavior of the passport strategy.
    The passport-local strategy by default expects
    properties called username and password in the request body. 
    Можно использовать в принципе любые поля, например, email: super({ usernameField: 'email' })
     */
    super({usernameField: 'username'}); 
  }

  //For each strategy, Passport will call the verify function (implemented with the validate())
  /*
   The validate() method for any Passport strategy will follow a similar pattern, varying how you determine if a user exists and is valid. If a user is found and the credentials are valid, the user is returned so 
   so Passport can complete its tasks (e.g., creating the user property on the Request object), and the request handling pipeline can continue. If it's not found, we throw an exception and let our exceptions layer handle it.
  */
  //arg0 - username - is named so under hood, technically it could be an email or any other
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}