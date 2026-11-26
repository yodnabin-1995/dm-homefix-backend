import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { ProxyModule } from './proxy/proxy.module';
import { HealthModule } from './health/health.module';
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),
        JWT_ACCESS_SECRET: Joi.string().required(),
        ACCOUNT_SERVICE_URL: Joi.string().required(),
        TECHNICIAN_VERIFICATION_SERVICE_URL: Joi.string().required(),
        SERVICE_CATALOG_SERVICE_URL: Joi.string().required(),
        BOOKING_SERVICE_URL: Joi.string().required(),
        PRICING_QUOTE_SERVICE_URL: Joi.string().required(),
        JOB_MANAGEMENT_SERVICE_URL: Joi.string().required(),
        PAYMENT_SERVICE_URL: Joi.string().required(),
        REVIEW_COMPLAINT_SERVICE_URL: Joi.string().required(),
        NOTIFICATION_SERVICE_URL: Joi.string().required(),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ProxyModule,
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
