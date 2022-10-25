import { Document } from 'mongoose';
import { Role } from 'src/enums/role.enum';

export interface User extends Document {
  readonly first_name: string;
  readonly last_name: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly gender: string;
  readonly age: number;
  readonly ip_address: string;
  readonly language: string;
  readonly company: string;
  readonly avatar: string;
  readonly deleted: boolean;
  readonly role: Role[];
}


export type SignUp = Pick<User, "username" | "password">;
//export type SignUp = Partial<Pick<User, "username" | "password">>