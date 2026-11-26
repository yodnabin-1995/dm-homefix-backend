import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { VerificationModule } from './verification/verification.module';
import { HealthModule } from './health/health.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development','production','test').default('development'),
        PORT: Joi.number().default(3002),
        DATABASE_URL: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        RABBITMQ_URL: Joi.string().default('amqp://guest:guest@localhost:5672'),
        ACCOUNT_SERVICE_URL: Joi.string().default('http://localhost:3001'),
        MINIO_ENDPOINT: Joi.string().default('localhost'),
        MINIO_PORT: Joi.number().default(9000),
        MINIO_USE_SSL: Joi.string().valid('true', 'false').default('false'),
        MINIO_ACCESS_KEY: Joi.string().default('dmhomefix'),
        MINIO_SECRET_KEY: Joi.string().default('dmhomefix_dev'),
      }),
    }),
    PrismaModule, VerificationModule, HealthModule, StorageModule,
  ],
})
export class AppModule {}
