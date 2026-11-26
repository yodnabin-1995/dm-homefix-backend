import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({ imports: [ConfigModule], useFactory: (c: ConfigService) => ({ secret: c.get('JWT_ACCESS_SECRET') }), inject: [ConfigService] }),
  ],
  controllers: [BookingController],
  providers: [BookingService, JwtStrategy],
})
export class BookingModule {}
