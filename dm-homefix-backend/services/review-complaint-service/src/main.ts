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
    .setTitle('DM HomeFix — Review & Complaint Service')
    .setDescription(
      `Manages customer reviews and complaint/dispute workflows.\n\n` +
        `**Reviews:**\n` +
        `- Only CUSTOMER role can submit a review for a completed job.\n` +
        `- One review per job per customer (duplicate submissions rejected).\n` +
        `- Ratings are integers 1–5.\n\n` +
        `**Complaints:**\n` +
        `\`OPEN\` → \`IN_REVIEW\` → \`RESOLVED\` / \`CLOSED\`\n\n` +
        `- Customers submit complaints linked to a booking.\n` +
        `- Admins manage complaint status and record resolution details.\n` +
        `- All admin actions are recorded with actor ID and timestamp.`,
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'JWT')
    .addTag('reviews', 'Submit and view technician reviews')
    .addTag('complaints', 'Submit and manage complaints/disputes')
    .addTag('health', 'Service health check')
    .addServer('http://localhost:3008', 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true, tagsSorter: 'alpha', operationsSorter: 'alpha' },
    customSiteTitle: 'DM HomeFix — Review & Complaint Service API',
  });

  const port = process.env.PORT ?? 3008;
  await app.listen(port);
  console.log(
    JSON.stringify({
      level: 'info',
      message: `Review & Complaint Service running on port ${port}`,
      swagger: `http://localhost:${port}/api/v1/docs`,
    }),
  );
}
bootstrap();
