import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '50mb' }));
  app.use(
    express.urlencoded({
      limit: '50mb',
      extended: true,
    }),
  );

  app.enableCors({
    // origin: ['https://custprofile.europ-assistance.in', 'http://localhost:5000'],
    origin: '*',
    methods: 'GET,POST,PATCH,OPTIONS',
    allowedHeaders: '*',
    // credentials: true,
    // preflightContinue: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
