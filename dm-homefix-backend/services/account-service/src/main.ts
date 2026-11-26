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
    .setTitle('DM HomeFix — Account Service')
    .setDescription(
      `Handles all account operations for DM HomeFix.\n\n` +
      `**Responsibilities:**\n` +
      `- Customer & technician registration\n` +
      `- Phone/email OTP verification\n` +
      `- Login, logout, token refresh\n` +
      `- Role-based access (CUSTOMER, TECHNICIAN, ADMIN)\n` +
      `- Profile read/update\n` +
      `- Account states: ACTIVE, SUSPENDED, DEACTIVATED\n` +
      `- Preferred language: \`en\` / \`am\`\n\n` +
      `**Auth:** Use \`POST /api/v1/auth/login\` to get a Bearer token, then click **Authorize** above.`,
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .addTag('auth', 'Registration, login, OTP verification, token refresh')
    .addTag('profile', 'View and update your own profile')
    .addTag('health', 'Service health check')
    .addServer(`http://localhost:3001`, 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'DM HomeFix — Account Service API',
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(JSON.stringify({
    level: 'info',
    message: `Account Service running on port ${port}`,
    swagger: `http://localhost:${port}/api/v1/docs`,
  }));
}
bootstrap();
