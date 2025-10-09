/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that are not in the DTO
      forbidNonWhitelisted: true, // throws error if extra properties are sent
      transform: true, // transforms payloads to DTO instances
    }),
  );
  // app.use(cookieParser());
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000', // explicitly allow Next.js dev server
    credentials: true, // allow cookies / auth headers if needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`App is running on port ${port}`);
}
bootstrap();

// somewhere in your initialization file
