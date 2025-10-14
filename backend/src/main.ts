import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AppLoggerService } from './app-logger/app-logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    bufferLogs: true,
  });
  const appLogger = app.get(AppLoggerService);
  app.useLogger(appLogger);

  const configDocs = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The NestJS API description')
    .setVersion('9.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configDocs);
  SwaggerModule.setup('api/docs', app, document);

  appLogger.log('🚀 Application starting...');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that are not in the DTO
      forbidNonWhitelisted: true, // throws error if extra properties are sent
      transform: true, // transforms payloads to DTO instances
    }),
  );
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // cookies
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`App is running on port ${port}`);
}
bootstrap();
