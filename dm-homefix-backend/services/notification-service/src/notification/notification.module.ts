import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MockNotificationAdapter } from './adapters/mock-notification.adapter';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [JwtModule.registerAsync({ imports: [ConfigModule], useFactory: (c: ConfigService) => ({ secret: c.get('JWT_ACCESS_SECRET') }), inject: [ConfigService] })],
  controllers: [NotificationController],
  providers: [NotificationService, MockNotificationAdapter, JwtStrategy],
})
export class NotificationModule {}
