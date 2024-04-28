import dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { sshInit } from './common/sshForward/sshInit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  
  if (process.env.SSH_USE && process.env.SSH_USE === 'true') {
    await sshInit();
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('Documentazione Alfred24')
    .setDescription('Documentazione API versione 1 di Alfred24')
    .setVersion('1.0')
    .addTag('Autenticazione')
    .addTag('Impostazioni utente')
    .addTag('Traking spedizione')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docu/v1', app, document);

  await app.listen(
    parseInt(process.env.API_PORT) || 3000,
    process.env.API_HOST || '127.0.0.1',
  );
}
bootstrap();
