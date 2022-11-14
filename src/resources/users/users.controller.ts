import { Body, Controller, Get, Param, Patch, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ParamsId } from "src/pipes/validation-pipes";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateRefreshTokenDto } from "../refresh-tokens/dto/create-refresh-token.dto";

@ApiBearerAuth()
@Controller('users') //injects /users to all routes (e.g  /users/:id)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'The users records', type: CreateUserDto, isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  findAll(@Req() req) { //The @Req() decorator is imported from the @nestjs/common, while Request from the express package.
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'The user record', type: CreateUserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get(':id')
  findOne(@Param() myCustomParams: ParamsId) { //will not execute if URL string param id - myCustomParams.id is not valid
    return this.usersService.findOne(myCustomParams.id);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'The updated user record', type: UpdateUserDto, })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Deactivate user' })
  @ApiResponse({ status: 200, description: 'The user record', type: 'string' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Patch('/deactivate/:id') //@Delete for .findByIdAndRemove() service
  //@Role
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({ status: 200, description: 'The user record', type: 'string' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Patch('/activate/:id')
  //@Role
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @ApiOperation({ summary: 'Find tokens for user with specified id' })
  @ApiResponse({ status: 200, description: 'The refresh tokens records', type: CreateRefreshTokenDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('/:id/refresh-tokens')
  findUserTokens(@Param('id') id: string) {
    return this.usersService.findUserTokens(id)
  }
}

