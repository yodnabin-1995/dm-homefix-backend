import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [JwtModule.registerAsync({ imports: [ConfigModule], useFactory: (c: ConfigService) => ({ secret: c.get('JWT_ACCESS_SECRET') }), inject: [ConfigService] })],
  controllers: [QuoteController],
  providers: [QuoteService, JwtStrategy],
})
export class QuoteModule {}
