import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('DM HomeFix — Service Catalog Service')
    .setDescription(
      `Manages the bilingual service category catalog.\n\n` +
      `**Features:**\n` +
      `- All categories have English (\`nameEn\`, \`descriptionEn\`) and Amharic (\`nameAm\`, \`descriptionAm\`) content.\n` +
      `- Public endpoints return the localized name based on the \`?lang=en\` or \`?lang=am\` query parameter.\n` +
      `- Admin endpoints require ADMIN role for create/update/deactivate.\n` +
      `- Category IDs are stable UUIDs — safe to store in bookings and historical records.\n\n` +
      `**Public endpoint (no auth):** \`GET /api/v1/catalog?lang=am\``,
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .addTag('catalog', 'Browse and manage service categories')
    .addTag('health', 'Service health check')
    .addServer('http://localhost:3003', 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true, tagsSorter: 'alpha', operationsSorter: 'alpha' },
    customSiteTitle: 'DM HomeFix — Service Catalog API',
  });

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  console.log(JSON.stringify({
    level: 'info',
    message: `Service Catalog Service running on port ${port}`,
    swagger: `http://localhost:${port}/api/v1/docs`,
  }));
}
bootstrap();
