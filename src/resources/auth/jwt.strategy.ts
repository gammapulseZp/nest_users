import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/*
  jwtFromRequest:
    supplies the method by which the JWT will be extracted from the Request.
    We will use the standard approach of supplying a bearer token in the Authorization header
    of our API requests.
    Other options are described here.
  ignoreExpiration:
    just to be explicit, we choose the default false setting, which delegates the responsibility
    of ensuring that a JWT has not expired to the Passport module.
    This means that if our route is supplied with an expired JWT, the request will be denied
    and a 401 Unauthorized response sent. Passport conveniently handles this automatically for us.
  secretOrKey:
  we are using the expedient option of supplying a symmetric secret for signing the token.
  Other options, such as a PEM-encoded public key, may be more appropriate for production apps
  (for more information see https://github.com/mikenicholson/passport-jwt#configure-strategy).
   In any case, do not expose this secret publicly.
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, //need to be configured and set as environment variables
    });
  }
  //Based on the way JWT signing works, we're guaranteed that we're receiving a valid token that we have previously signed and issued to a valid user.
  // Passport first verifies the JWT's signature and decodes the JSON.
  //It then invokes our validate() method passing the decoded JSON as its single parameter.
  //Passport will build a user object based on the return value of our validate() method, and attach it as a property on the Request object.
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
    /* we could do a database lookup in our validate() method to extract more information about the user,
    resulting in a more enriched user object being available in our Request
     This is also the place  to perform token revocation by looking up the userId in a list of revoked tokens
    */

}
