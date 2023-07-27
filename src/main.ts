import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('TesloShop Boostrap');

  app.enableCors();

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Teslo Shop')
    .setDescription('TesloShop RESTFul API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);

  logger.log(`🚀 ~ App Running on port: ${process.env.PORT}`);
}
bootstrap();
