import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from './otp/otp.service';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: Partial<PrismaService>;

  beforeEach(async () => {
    prisma = {
      account: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({
          id: 'test-id',
          email: 'test@example.com',
          role: 'CUSTOMER',
        }),
      } as any,
      refreshToken: { create: jest.fn().mockResolvedValue({}) } as any,
      otpRecord: {
        updateMany: jest.fn().mockResolvedValue({}),
        create: jest.fn().mockResolvedValue({}),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock-token') },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const vals: Record<string, string> = {
                JWT_REFRESH_SECRET: 'test-secret',
                JWT_REFRESH_EXPIRES_IN: '7d',
                OTP_CHANNEL: 'mock',
              };
              return vals[key] ?? null;
            }),
          },
        },
        { provide: OtpService, useValue: { sendOtp: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register a customer successfully', async () => {
    const result = await service.register({
      email: 'test@example.com',
      firstName: 'Abebe',
      lastName: 'Kebede',
      password: 'Password123!',
      role: 'CUSTOMER',
      preferredLanguage: 'en',
    });
    expect(result.accountId).toBe('test-id');
  });

  it('should throw ConflictException on duplicate email', async () => {
    (prisma.account!.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' });
    await expect(
      service.register({
        email: 'taken@example.com',
        firstName: 'A',
        lastName: 'B',
        password: 'Password123!',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
