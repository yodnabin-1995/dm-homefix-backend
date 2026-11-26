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
    .setTitle('DM HomeFix — Payment Service')
    .setDescription(
      `Manages payment records and provider integration.\n\n` +
        `**Payment lifecycle:**\n` +
        `\`INITIATED\` → \`PENDING\` → \`SUCCESSFUL\` or \`FAILED\` → \`REFUNDED\`\n\n` +
        `**⚠️ DEV MODE — Mock Adapter Active**\n` +
        `The current \`PAYMENT_PROVIDER=mock\` logs payments to console and always returns success.\n` +
        `Configure a real provider (e.g. Chapa) before go-live.\n\n` +
        `**Key rules:**\n` +
        `- Amounts are stored as integer minor units (Ethiopian cents).\n` +
        `- No sensitive card data is ever stored.\n` +
        `- Webhook endpoint (\`POST /payments/webhook\`) is unauthenticated — the provider calls it directly.\n` +
        `- Webhook payloads are validated to prevent replay attacks.`,
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'JWT')
    .addTag('payments', 'Initiate and track payments')
    .addTag('health', 'Service health check')
    .addServer('http://localhost:3007', 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true, tagsSorter: 'alpha', operationsSorter: 'alpha' },
    customSiteTitle: 'DM HomeFix — Payment Service API',
  });

  const port = process.env.PORT ?? 3007;
  await app.listen(port);
  console.log(
    JSON.stringify({
      level: 'info',
      message: `Payment Service running on port ${port}`,
      swagger: `http://localhost:${port}/api/v1/docs`,
    }),
  );
}
bootstrap();
