import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
