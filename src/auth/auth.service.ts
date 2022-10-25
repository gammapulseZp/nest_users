import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { jwtConstants } from '../constants';
import { generateRefreshToken } from 'src/utils/tokens';



@Injectable()
export class AuthService {
  // Don't forget to inject the JwtService provider into the AuthService.
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    console.log('user', user);

    console.log('argon2.verify params', user.password, pass)
     const passwordMatches = await argon2.verify(user.password, pass); //never-ever put argon2.verify in login function
     if (!passwordMatches) throw new BadRequestException('Password is incorrect');

    if (user) {
      const { password, ...result } = user;
      return result;
    }
    throw new BadRequestException('Username is incorrect ');
   // return null; // null will not be returned since 404 not found already thrown by findOneByUsername 
  }

  
  async login(user: any, response: any) { //NEST's internal object (user) => any
    const payload = { username: user.username, sub: user.userId };
    const refresh_token = await generateRefreshToken(payload, this.jwtService)
   
     response.cookie('refresh_token', refresh_token, { //also sets automatically the 'Set-Cookie' header 
      httpOnly: true,
      expiresIn: jwtConstants.refereshTokenExpiresIn, //cookie expires in, so the token too
    })
   
    return {
      /*
      sign() supplied by @nestjs/jwt library
       to generate our JWT from a subset of the user object properties, which we then return as a simple object
        with a single access_token property. Note: we choose a property name of sub to hold our userId value 
        to be consistent with JWT standards.
       */
      access_token: this.jwtService.sign(payload, {
        //secret: this.configService.get<string>('JWT_ACCESS_SECRET'), 
        //after deployment or fix process.env // same as secretOrKey in class JwtStrategy
        secret: jwtConstants.secret, 
        expiresIn: jwtConstants.expiresIn
      }), 
      user: user._doc
    };
  }
  
  async logout(response: any) {
    response.cookie('refresh_token', null)
    return 'refresh_token !!cookie!! invalidated'
  }
  

}
