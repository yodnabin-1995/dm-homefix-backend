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
    .setTitle('DM HomeFix — Job Management Service')
    .setDescription(
      `Manages job execution after a booking is assigned to a technician.\n\n` +
      `**Job lifecycle:**\n` +
      `\`ASSIGNED\` → \`TECHNICIAN_EN_ROUTE\` → \`IN_PROGRESS\` → \`COMPLETED\`\n` +
      `Any state before COMPLETED can transition to → \`CANCELLED\`\n\n` +
      `**Key rules:**\n` +
      `- Jobs are created by ADMIN after a booking reaches ASSIGNED state.\n` +
      `- Technicians update their own job status (TECHNICIAN_EN_ROUTE → IN_PROGRESS → COMPLETED).\n` +
      `- All status transitions are recorded in \`JobStatusHistory\` with actor ID and timestamp.\n` +
      `- Invalid state transitions are rejected with 400.`,
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .addTag('jobs', 'Create and track job execution')
    .addTag('health', 'Service health check')
    .addServer('http://localhost:3006', 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true, tagsSorter: 'alpha', operationsSorter: 'alpha' },
    customSiteTitle: 'DM HomeFix — Job Management Service API',
  });

  const port = process.env.PORT ?? 3006;
  await app.listen(port);
  console.log(JSON.stringify({
    level: 'info',
    message: `Job Management Service running on port ${port}`,
    swagger: `http://localhost:${port}/api/v1/docs`,
  }));
}
bootstrap();
