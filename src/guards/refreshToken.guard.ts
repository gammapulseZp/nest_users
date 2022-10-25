import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { guardTypes } from 'src/constants';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(guardTypes.jwt_refresh) {}