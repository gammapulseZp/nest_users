import { Document, ObjectId } from "mongoose";
import { Role } from 'src/enums/role.enum';
import { Prop } from "@nestjs/mongoose";

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
  readonly role: Role.Admin | Role.User;
}


export type SignUp = Pick<User, "username" | "password">;
//export type SignUp = Partial<Pick<User, "username" | "password">>

export interface RefreshToken extends Document {
  readonly user: string;
  readonly token: string;
  readonly revoked: number;
  readonly revokedByIp: string;
  readonly expires: number;
  readonly createdByIp: string;
  readonly isActive: boolean;
}
