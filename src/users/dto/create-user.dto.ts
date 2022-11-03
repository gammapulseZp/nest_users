import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/enums/role.enum';
export class CreateUserDto { //pay attention to equal interface User
  @IsNotEmpty()
  readonly first_name: string;

  readonly last_name: string;

  //@IsEmail()  //validation pipe
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  readonly username: string;

  readonly age: boolean;

  readonly gender: string;

  readonly ip_address: string;

  readonly language: string;

  readonly company: string;

  readonly avatar: string;

  readonly role: Role.Admin | Role.User;

  readonly deleted: boolean;

}

