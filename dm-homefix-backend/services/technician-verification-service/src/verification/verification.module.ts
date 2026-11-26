import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { VerificationService } from './verification.service';
import { VerificationController, EligibilityController } from './verification.controller';
import { EventPublisherService } from './events/event-publisher.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UploadController } from './upload/upload.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    StorageModule,
    MulterModule.register({}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({ secret: config.get('JWT_ACCESS_SECRET') }),
      inject: [ConfigService],
    }),
  ],
  controllers: [VerificationController, EligibilityController, UploadController],
  providers: [VerificationService, EventPublisherService, JwtStrategy],
})
export class VerificationModule {}
