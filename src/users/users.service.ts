import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RefreshToken, User } from "../interfaces_mongoose";
import { catchError } from "src/utils/all-exseptions-custom-filter";
import { isUniqueEmail, isUniqueUsername } from "src/utils/unique";
import { SignUpDto } from "./dto/sign-up";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { generateRefreshToken } from "src/utils/tokens";
import { CreateRefreshTokenDto } from "../refresh-tokens/dto/create-refresh-token.dto";
import { Role } from "src/enums/role.enum";


@Injectable()
export class UsersService {
  constructor(
    // userModel corresponds to users collection in DB
    @Inject('USER_MODEL')
    private userModel: Model<User>,
   // private configService: ConfigService,
    private jwtService: JwtService,
    @Inject('REFRESH_TOKEN_MODEL')
    private refreshTokenModel: Model<RefreshToken>
  ) {}


 // private users: User[] = [];
 async signUp(signUpDto: SignUpDto, refreshTokenDto: CreateRefreshTokenDto): Promise<any> {
  await isUniqueUsername(this.userModel, signUpDto?.username);
  console.log('isUniqueUsername passed')
  console.log('signUpDto', typeof SignUpDto)

  try {
    const hash = await this.hashData(signUpDto.password);

  console.log('hash', hash)
  const createdUser = await this.userModel.create({
    ...signUpDto,
    role: Role.User,
    password: hash,  //will overwrite current signUpDto.password
  });

  const payload = { username: createdUser?.username, sub: createdUser?._id };
  const refresh_token = await generateRefreshToken(payload, this.jwtService)

  console.log('refresh_token', refresh_token);
  // await this.refreshTokenModel.create({
  //   ...refreshTokenDto,
  //   token: refresh_token,
  // })

  //updating straight after creating since generating refresh token needs the _id
  //await this.update(createdUser._id, {[refreshToken: refresh_token]}, true /* isCreated to skip check the email */);
  return createdUser//.save();

  } catch (err) {
    console.log(err)
    catchError(err, 'auth');
  }
}


  findAll(): Promise<User[]> {
    return this.userModel.find({deleted: {$ne: true}}).exec();
  }

  async findOne(id: string): Promise<User> { //these are different fns: my .findOne() service function
    const user = await this.userModel
    .findOne({_id: id}) // and mongoose .findOne({})
    .exec();
    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found.`);
    }

    return user;
  }

  async findOneByUsername(username: string): Promise<User> { //these are different fns: my .findOne() service function
    const user = await this.userModel
    .findOne({username: username}) // and mongoose .findOne({})
    .exec();
    if (!user) {
      throw new NotFoundException(`User with username: ${username} not found.`);
    }

    return user;
  }


  async update(id: string, updateUserDto: UpdateUserDto, isCreated = false): Promise<User> {
   // await isUniqueUsername(this.userModel, updateUserDto?.username);
    console.log('username passed', updateUserDto?.username);
    if (!isCreated) await isUniqueEmail(this.userModel, updateUserDto?.email);
    console.log('email passed', updateUserDto?.email);
    try {
      const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto) //mongoose, not this
      .exec();

      return updatedUser;
    } catch (err) {
      catchError(err, 'users');
    }
  }

  /* async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }*/

  deactivate(id: string,): string {
    this.userModel
      .findByIdAndUpdate(id, {deleted: true}) //example with no dto
      .exec();

    return `User with id: ${id} is sucessfully deactivated. This can be undone `;
  }

  activate(id: string): string {
    this.userModel
    .findByIdAndUpdate(id, {deleted: false}) //example with no dto
    .exec();

    return `Player ${id} is back in the game`
  }

  async findUserTokens(id: string): Promise<RefreshToken[]> {
    await this.findOne(id) //will throw error if no user found
    const tokens = await this.refreshTokenModel.find({user: id})
    if (!tokens) {
      throw new NotFoundException(`Refresh tokens for user with id: ${id} not found.`);
    }
    return tokens
  }

  hashData(data: string) {
    return argon2.hash(data);
  }


}
