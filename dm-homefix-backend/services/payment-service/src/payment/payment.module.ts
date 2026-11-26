import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MockPaymentAdapter } from './adapters/mock-payment.adapter';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [JwtModule.registerAsync({ imports: [ConfigModule], useFactory: (c: ConfigService) => ({ secret: c.get('JWT_ACCESS_SECRET') }), inject: [ConfigService] })],
  controllers: [PaymentController],
  providers: [PaymentService, MockPaymentAdapter, JwtStrategy],
})
export class PaymentModule {}
