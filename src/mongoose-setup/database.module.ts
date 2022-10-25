import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

//make them accessible for the rest part of the application.
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}