import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://custprofile.europ-assistance.in', 'http://localhost:5000'],
    methods: 'GET,POST,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: false
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
