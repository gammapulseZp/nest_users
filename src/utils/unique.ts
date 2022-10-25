import { UsersService } from 'src/users/users.service'
import { ConflictException } from '@nestjs/common';
export const isUniqueEmail = async (usersServicePrototype, email) => {
  const isOccupied = await usersServicePrototype.findOne({email: email }).exec();
      if(isOccupied){
        throw new ConflictException(`User with email: ${email} already exists.`);
      } 
}

export const isUniqueUsername = async(usersServicePrototype, username) => {
  const isOccupied = await usersServicePrototype.findOne({username: username }).exec();
  if(isOccupied){
    throw new ConflictException(`User with username: ${username} already exists.`);
  } 
}