import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { guardTypes } from 'src/constants';

@Injectable()
export class AccessTokenGuard extends AuthGuard(guardTypes.jwt) {}