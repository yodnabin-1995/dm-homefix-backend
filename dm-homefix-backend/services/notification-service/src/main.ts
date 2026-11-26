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
    .setTitle('DM HomeFix — Notification Service')
    .setDescription(
      `Sends and stores notifications for all platform events.\n\n` +
      `**Supported channels:** \`in-app\`, \`email\`, \`sms\`\n\n` +
      `**Supported languages:** \`en\` (English), \`am\` (Amharic አማርኛ)\n\n` +
      `**⚠️ DEV MODE — Mock Adapter Active**\n` +
      `\`NOTIFICATION_CHANNEL=mock\` logs all notifications to console. No real messages are sent.\n` +
      `Configure a real SMS/email provider before go-live.\n\n` +
      `**Key rules:**\n` +
      `- Notifications are sent in the recipient's preferred language when a translation exists.\n` +
      `- Failed deliveries are retried — notification failures never roll back business transactions.\n` +
      `- All sent notifications are recorded for audit and delivery tracking.`,
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .addTag('notifications', 'Send and retrieve notifications')
    .addTag('health', 'Service health check')
    .addServer('http://localhost:3009', 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true, tagsSorter: 'alpha', operationsSorter: 'alpha' },
    customSiteTitle: 'DM HomeFix — Notification Service API',
  });

  const port = process.env.PORT ?? 3009;
  await app.listen(port);
  console.log(JSON.stringify({
    level: 'info',
    message: `Notification Service running on port ${port}`,
    swagger: `http://localhost:${port}/api/v1/docs`,
  }));
}
bootstrap();
