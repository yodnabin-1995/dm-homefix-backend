import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (c: ConfigService) => ({ secret: c.get('JWT_ACCESS_SECRET') }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ProxyController],
  providers: [ProxyService, JwtStrategy],
})
export class ProxyModule {}
