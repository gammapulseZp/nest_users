import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
//First, register the JwtAuthGuard as a global guard using the following construction (in app module, may be any as per logic):
//also add  class JwtAuthGuard
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);