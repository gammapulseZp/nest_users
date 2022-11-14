import { Controller } from "@nestjs/common";
import { AuthService } from "./resources/auth/auth.service";
import { UsersService } from "./resources/users/users.service";

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

}

