import { CreateUserDto } from "../resources/users/dto/create-user.dto";
import { UpdateUserDto } from "../resources/users/dto/update-user.dto";

export type LoginResponse = {
  access_token: string,
  user: CreateUserDto,
  // user: {
  //   _id: mongoose.Types.ObjectId,
  //   username: "admin",
  //   password: "$argon2id$v=19$m=4096,t=3,p=1$jTsXrs/ga2Uirb14meI0Vg$UuTF3VAc4eg5b77vzsXtts99Qwmf9d7WUDK0PsT2kJI",
  //   role: "user"
  // }
}

export type RefreshTokenResponse = {
  access_token: string,
  user: UpdateUserDto,
}
