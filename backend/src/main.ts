import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const port = process.env.PORT || 3001;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that are not in the DTO
      forbidNonWhitelisted: true, // throws error if extra properties are sent
      transform: true, // transforms payloads to DTO instances
    }),
  );

  const portToTry = [port, 3000, 3002, 3003, 3004];

  for (const p of portToTry) {
    try {
      await app.listen(p);
      console.log(`App is running on port ${p}`);
      break; // Exit the loop if the server starts successfully
    } catch (error) {
      console.error('Error starting server:', error);
      throw error; // rethrow if it's a different error
    }
  }
  // console.log(`App is running on port ${port}`);
}
bootstrap();
