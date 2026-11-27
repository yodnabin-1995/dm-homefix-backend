import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from './otp/otp.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

// Plain-string enum values matching schema.prisma — no @prisma/client import needed
// (prisma generate is required for @prisma/client enum types, not for string values)
type AccountRole = 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
type AccountStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

type AccountFromDb = { id: string; role: AccountRole | string; email?: string | null };

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private otpService: OtpService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.email) {
      const existing = await this.prisma.account.findUnique({ where: { email: dto.email } });
      if (existing) throw new ConflictException('EMAIL_TAKEN');
    }
    if (dto.phone) {
      const existing = await this.prisma.account.findUnique({ where: { phone: dto.phone } });
      if (existing) throw new ConflictException('PHONE_TAKEN');
    }

    const passwordHash = await argon2.hash(dto.password);
    const role = (dto.role ?? 'CUSTOMER') as AccountRole;
    const status = 'PENDING_VERIFICATION' as AccountStatus;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      id: uuidv4(),
      email: dto.email,
      phone: dto.phone,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash,
      role,
      status,
      preferredLanguage: dto.preferredLanguage ?? 'en',
    };

    const account = await this.prisma.account.create({ data });
    const identifier = dto.email ?? dto.phone!;
    await this.otpService.sendOtp(account.id, identifier);

    return {
      message: 'Registration successful. Please verify your contact.',
      accountId: account.id,
    };
  }

  async validateCredentials(identifier: string, password: string) {
    const account = await this.prisma.account.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });
    if (!account) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const valid = await argon2.verify(account.passwordHash, password);
    if (!valid) throw new UnauthorizedException('INVALID_CREDENTIALS');

    if (account.status === 'SUSPENDED') throw new ForbiddenException('ACCOUNT_SUSPENDED');
    if (account.status === 'DEACTIVATED') throw new ForbiddenException('ACCOUNT_DEACTIVATED');

    return account;
  }

  async login(account: AccountFromDb) {
    const payload = { sub: account.id, role: account.role, email: account.email ?? undefined };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    const refreshHash = await argon2.hash(refreshToken);
    await this.prisma.refreshToken.create({
      data: {
        id: uuidv4(),
        accountId: account.id,
        tokenHash: refreshHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const result = await this.otpService.verifyOtp(dto.accountId, dto.otp);
    if (!result) throw new BadRequestException('INVALID_OR_EXPIRED_OTP');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.prisma.account.update({
      where: { id: dto.accountId },
      data: { status: 'ACTIVE' as AccountStatus, isEmailVerified: true } as never,
    });

    return { message: 'Contact verified successfully' };
  }

  async refreshTokens(accountId: string, refreshToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { accountId, revokedAt: null, expiresAt: { gt: new Date() } },
    });

    let matched: (typeof tokens)[0] | undefined;
    for (const t of tokens) {
      if (await argon2.verify(t.tokenHash, refreshToken)) {
        matched = t;
        break;
      }
    }

    if (!matched) throw new UnauthorizedException('INVALID_REFRESH_TOKEN');

    await this.prisma.refreshToken.update({
      where: { id: matched.id },
      data: { revokedAt: new Date() },
    });

    const account = await this.prisma.account.findUnique({ where: { id: accountId } });
    if (!account) throw new UnauthorizedException('ACCOUNT_NOT_FOUND');
    return this.login(account);
  }

  async logout(accountId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { accountId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { message: 'Logged out successfully' };
  }
}
