import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogModule } from './catalog/catalog.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development','production','test').default('development'),
        PORT: Joi.number().default(3003),
        DATABASE_URL: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
      }),
    }),
    PrismaModule, CatalogModule, HealthModule,
  ],
})
export class AppModule {}
