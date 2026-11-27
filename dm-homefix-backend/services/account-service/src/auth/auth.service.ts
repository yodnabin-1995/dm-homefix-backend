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

// Use string constants instead of @prisma/client enums
// (Prisma enums are only available after prisma generate which requires a DB connection)
const AccountRole = { CUSTOMER: 'CUSTOMER', TECHNICIAN: 'TECHNICIAN', ADMIN: 'ADMIN' } as const;
const AccountStatus = {
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DEACTIVATED: 'DEACTIVATED',
} as const;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private otpService: OtpService,
  ) {}

  async register(dto: RegisterDto) {
    // Check for duplicate identifier
    if (dto.email) {
      const existing = await this.prisma.account.findUnique({ where: { email: dto.email } });
      if (existing) throw new ConflictException('EMAIL_TAKEN');
    }
    if (dto.phone) {
      const existing = await this.prisma.account.findUnique({ where: { phone: dto.phone } });
      if (existing) throw new ConflictException('PHONE_TAKEN');
    }

    const passwordHash = await argon2.hash(dto.password);

    const account = await this.prisma.account.create({
      data: {
        id: uuidv4(),
        email: dto.email,
        phone: dto.phone,
        firstName: dto.firstName,
        lastName: dto.lastName,
        passwordHash,
        role: (dto.role ?? AccountRole.CUSTOMER) as string,
        status: AccountStatus.PENDING_VERIFICATION as string,
        preferredLanguage: dto.preferredLanguage ?? 'en',
      },
    });

    // Send OTP
    const identifier = dto.email ?? dto.phone!;
    await this.otpService.sendOtp(account.id, identifier);

    return {
      message: 'Registration successful. Please verify your contact.',
      accountId: account.id,
    };
  }

  async validateCredentials(identifier: string, password: string) {
    const account = await this.prisma.account.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });
    if (!account) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const valid = await argon2.verify(account.passwordHash, password);
    if (!valid) throw new UnauthorizedException('INVALID_CREDENTIALS');

    if (account.status === 'SUSPENDED') throw new ForbiddenException('ACCOUNT_SUSPENDED');
    if (account.status === 'DEACTIVATED') throw new ForbiddenException('ACCOUNT_DEACTIVATED');

    return account;
  }

  async login(account: { id: string; role: string; email?: string }) {
    const payload = { sub: account.id, role: account.role, email: account.email };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    // Store hashed refresh token
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

    // Activate account
    await this.prisma.account.update({
      where: { id: dto.accountId },
      data: { status: 'ACTIVE', isEmailVerified: true },
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

    // Rotate: revoke old, issue new
    await this.prisma.refreshToken.update({
      where: { id: matched.id },
      data: { revokedAt: new Date() },
    });

    const account = await this.prisma.account.findUnique({ where: { id: accountId } });
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
