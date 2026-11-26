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
    .setTitle('DM HomeFix — Booking Service')
    .setDescription(
      `Manages customer booking requests from creation to completion.\n\n` +
        `**Booking lifecycle:**\n` +
        `\`PENDING\` → \`CONFIRMED\` → \`ASSIGNED\` → \`IN_PROGRESS\` → \`COMPLETED\`\n` +
        `Any state before COMPLETED can transition to → \`CANCELLED\`\n\n` +
        `**Key rules:**\n` +
        `- Only CUSTOMER role can create bookings.\n` +
        `- Technician assignment requires the technician to be APPROVED in the Verification Service.\n` +
        `- Duplicate booking prevention via optional \`idempotencyKey\` field.\n` +
        `- Cancellation is only allowed in PENDING or CONFIRMED states.`,
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'JWT')
    .addTag('bookings', 'Create, view, cancel and manage bookings')
    .addTag('health', 'Service health check')
    .addServer('http://localhost:3004', 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true, tagsSorter: 'alpha', operationsSorter: 'alpha' },
    customSiteTitle: 'DM HomeFix — Booking Service API',
  });

  const port = process.env.PORT ?? 3004;
  await app.listen(port);
  console.log(
    JSON.stringify({
      level: 'info',
      message: `Booking Service running on port ${port}`,
      swagger: `http://localhost:${port}/api/v1/docs`,
    }),
  );
}
bootstrap();
