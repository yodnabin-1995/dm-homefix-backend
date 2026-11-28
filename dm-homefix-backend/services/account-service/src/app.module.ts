import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3001),
        DATABASE_URL: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
        OTP_SECRET: Joi.string().required(),
        OTP_CHANNEL: Joi.string().valid('mock', 'sms', 'email').default('mock'),
        RABBITMQ_URL: Joi.string().default('amqp://guest:guest@localhost:5672'),
        MINIO_ENDPOINT: Joi.string().default('minio'),
        MINIO_PORT: Joi.number().default(9000),
        MINIO_USE_SSL: Joi.string().valid('true', 'false').default('false'),
        MINIO_ACCESS_KEY: Joi.string().default('dmhomefix'),
        MINIO_SECRET_KEY: Joi.string().default('dmhomefix_dev'),
        MINIO_REGION: Joi.string().default('us-east-1'),
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    HealthModule,
  ],
})
export class AppModule {}
