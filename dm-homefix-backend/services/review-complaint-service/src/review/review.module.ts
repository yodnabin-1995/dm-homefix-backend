import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [JwtModule.registerAsync({ imports: [ConfigModule], useFactory: (c: ConfigService) => ({ secret: c.get('JWT_ACCESS_SECRET') }), inject: [ConfigService] })],
  controllers: [ReviewController, ComplaintController],
  providers: [ReviewService, ComplaintService, JwtStrategy],
})
export class ReviewModule {}
