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
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('DM HomeFix — API Gateway')
    .setDescription(
      `**Single public entry point** for all DM HomeFix frontend applications.\n\n` +
      `All requests from the Customer App, Technician App, and Admin Portal pass through here.\n\n` +
      `**Routing map:**\n` +
      `| Path prefix | Downstream service | Port |\n` +
      `|---|---|---|\n` +
      `| \`/api/v1/accounts\` | Account Service | 3001 |\n` +
      `| \`/api/v1/verification\` | Technician Verification Service | 3002 |\n` +
      `| \`/api/v1/catalog\` | Service Catalog Service | 3003 |\n` +
      `| \`/api/v1/bookings\` | Booking Service | 3004 |\n` +
      `| \`/api/v1/quotes\` | Pricing & Quote Service | 3005 |\n` +
      `| \`/api/v1/jobs\` | Job Management Service | 3006 |\n` +
      `| \`/api/v1/payments\` | Payment Service | 3007 |\n` +
      `| \`/api/v1/reviews\` | Review & Complaint Service | 3008 |\n` +
      `| \`/api/v1/notifications\` | Notification Service | 3009 |\n\n` +
      `**Auth:** Obtain a JWT from Account Service \`/auth/login\`, then click **Authorize**.`,
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .addTag('proxy', 'Reverse proxy to downstream microservices')
    .addTag('health', 'Gateway health check')
    .addServer('http://localhost:3000', 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'DM HomeFix — API Gateway',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(JSON.stringify({
    level: 'info',
    message: `API Gateway running on port ${port}`,
    swagger: `http://localhost:${port}/api/v1/docs`,
  }));
}
bootstrap();
