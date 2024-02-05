import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthorizationMiddleware } from './auth/controller/authorization.middleware';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Apply CORS middleware with all origins
  app.use(
    cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }),
  );
  // Apply the ValidationPipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((error) => Object.values(error.constraints))
          .flat();
        return new HttpException(
          { message: messages, success: false },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  app.use(new AuthorizationMiddleware().use); // Apply the middleware globally

  await app.listen(3000);
}

bootstrap();
