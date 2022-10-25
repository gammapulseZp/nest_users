import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ParamsId } from 'src/pipes/validation-pipes';
import { UserDecorator } from 'src/custom-decorators/user.decorator';
import { Public } from 'src/custom-decorators/set-metadata.decorator';
import { Roles } from 'src/custom-decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('users') //injects /users to all routes (e.g  /users/:id)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public() //custom decorator that uses JwtAuthGuard's canActivate method under hood
  @Get()
  findAll(@Req() req) { //The @Req() decorator is imported from the @nestjs/common, while Request from the express package (??? эээ).
    console.log('req.cookies', req.cookies)
    /* or*/ //console.log(req.cookies['refresh_token']);
    // or console.log(request.signedCookies); //if a secret was provided on top-level (app.use(cookieParser()))
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param() paramsHujams: ParamsId) { //will not execute if URL string param id - paramsHujams.id is not valid
    return this.usersService.findOne(paramsHujams.id);
  }

  // @Post()
  // @Roles(Role.Admin)
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('/deactivate/:id') //@Delete for .findByIdAndRemove() service
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }


  @Patch('/activate/:id')
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }
}

