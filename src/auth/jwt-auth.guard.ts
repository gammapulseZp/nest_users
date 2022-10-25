import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { guardTypes } from 'src/constants';
import { IS_PUBLIC_KEY } from 'src/custom-decorators/set-metadata.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard(guardTypes.jwt) { //strategy - may be "local" or "JWt". May be multiple strategies in one app
  constructor(private reflector: Reflector) {
    super();
  }

  //the method to activate custom @Public decorator
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
} 
