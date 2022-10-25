//Remove if no need
// import { config } from 'dotenv';
// config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { jwtConstants } from './constants';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
 
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(
    {
      forbidNonWhitelisted: true //not working for mongoose schema not stated fields
    }));

  app.use(cookieParser(
    //'lolkek', // If a string is provided, this is used as the secret. 
    // ['lol', 'kek'] //If an array is provided, an attempt will be made to unsign the cookie with each secret in order.
    //{} //options object
   ));

  await app.listen(3000);
   console.log('server running on env:', process.env.NODE_ENV)
   
}
bootstrap();


