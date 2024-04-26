import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log']
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });
  await app.listen((parseInt(process.env.API_PORT)) || 3000, (process.env.API_HOST) || '127.0.0.1');
}
bootstrap();
