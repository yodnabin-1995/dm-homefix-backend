import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentModule } from './payment/payment.module';
import { HealthModule } from './health/health.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: Joi.object({
      NODE_ENV: Joi.string().valid('development','production','test').default('development'),
      PORT: Joi.number().default(3007),
      DATABASE_URL: Joi.string().required(),
      JWT_ACCESS_SECRET: Joi.string().required(),
      PAYMENT_PROVIDER: Joi.string().valid('mock').default('mock'),
    })}),
    PrismaModule, PaymentModule, HealthModule,
  ],
})
export class AppModule {}
