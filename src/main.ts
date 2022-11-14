import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
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

  app.enableCors({
    origin: "http://non-existing-server.com",
  });

  //set up Swagger to build a swagger docs
  const config = new DocumentBuilder()
    .setTitle('Nest Auth')
    .setDescription('Nest.js Basic authentication and authorization api')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
   console.log('server running on env:', process.env.NODE_ENV)

}
bootstrap();


