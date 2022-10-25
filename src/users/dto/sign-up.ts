import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
//The IntersectionType() function is imported from the @nestjs/swagger package.

export class SignUpDto extends PartialType(
  PickType(CreateUserDto, [ 'username', 'password', 'refreshToken'] as const)
  ) {}

