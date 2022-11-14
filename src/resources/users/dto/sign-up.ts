import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from "./create-user.dto";
//The IntersectionType() function is imported from the @nestjs/swagger package.

export class SignUpDto extends PartialType(
  PickType(CreateUserDto, [ 'username', 'password'] as const)
  ) {}

