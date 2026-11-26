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
    .setTitle('DM HomeFix — Pricing & Quote Service')
    .setDescription(
      `Manages technician quotes and customer acceptance.\n\n` +
        `**Quote lifecycle:**\n` +
        `\`PENDING\` → \`ACCEPTED\` or \`DECLINED\`\n\n` +
        `**Key rules:**\n` +
        `- Amounts are stored as **integer minor units** (e.g. Ethiopian cents) — no floating-point arithmetic.\n` +
        `  Example: 500.00 ETB = \`amountMinorUnits: 50000\`\n` +
        `- When a customer accepts one quote, all other quotes for the same booking are automatically declined.\n` +
        `- Expired quotes (\`validUntil\` in the past) cannot be accepted.\n` +
        `- Only TECHNICIAN role can submit quotes; only CUSTOMER role can accept/decline.`,
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'JWT')
    .addTag('quotes', 'Submit, view, accept and decline quotes')
    .addTag('health', 'Service health check')
    .addServer('http://localhost:3005', 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true, tagsSorter: 'alpha', operationsSorter: 'alpha' },
    customSiteTitle: 'DM HomeFix — Pricing & Quote Service API',
  });

  const port = process.env.PORT ?? 3005;
  await app.listen(port);
  console.log(
    JSON.stringify({
      level: 'info',
      message: `Pricing & Quote Service running on port ${port}`,
      swagger: `http://localhost:${port}/api/v1/docs`,
    }),
  );
}
bootstrap();
