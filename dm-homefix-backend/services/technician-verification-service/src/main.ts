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
    .setTitle('DM HomeFix — Technician Verification Service')
    .setDescription(
      `Manages the full technician verification lifecycle.\n\n` +
      `**Application states:**\n` +
      `\`DRAFT\` → \`PENDING_REVIEW\` → \`APPROVED\` / \`REJECTED\` / \`INFORMATION_REQUESTED\` → \`RESUBMITTED\`\n\n` +
      `After approval: \`SUSPENDED\` / \`REVOKED\`\n\n` +
      `**Key rules:**\n` +
      `- Only APPROVED technicians can receive bookings.\n` +
      `- Document uploads go to private MinIO storage — never publicly accessible.\n` +
      `- Every admin decision is recorded with actor ID, timestamp, and reason.\n\n` +
      `**Roles required:** TECHNICIAN for applications, ADMIN for review decisions.`,
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .addTag('verification', 'Technician application submission and admin review')
    .addTag('verification-documents', 'Private document upload to MinIO')
    .addTag('health', 'Service health check')
    .addServer('http://localhost:3002', 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true, tagsSorter: 'alpha', operationsSorter: 'alpha' },
    customSiteTitle: 'DM HomeFix — Technician Verification API',
  });

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(JSON.stringify({
    level: 'info',
    message: `Technician Verification Service running on port ${port}`,
    swagger: `http://localhost:${port}/api/v1/docs`,
  }));
}
bootstrap();
