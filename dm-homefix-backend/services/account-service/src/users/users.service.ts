import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async findById(id: string) {
    const user = await this.prisma.account.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Account not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.account.findUnique({ where: { email } });
  }

  async findByPhone(phone: string) {
    return this.prisma.account.findUnique({ where: { phone } });
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      updatedAt: new Date(),
    };
    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.preferredLanguage !== undefined) data.preferredLanguage = dto.preferredLanguage;
    if (dto.serviceLocation !== undefined) data.serviceLocation = dto.serviceLocation;
    if (dto.avatarKey !== undefined) {
      data.avatarUrl = this.storage.getPublicUrl(dto.avatarKey);
    }
    return this.prisma.account.update({ where: { id }, data });
  }

  async uploadAvatar(id: string, file: Express.Multer.File): Promise<{ avatarUrl: string }> {
    const objectKey = await this.storage.uploadAvatar(id, file.buffer, file.mimetype);
    const avatarUrl = this.storage.getPublicUrl(objectKey);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.prisma.account.update({ where: { id }, data: { avatarUrl } as any });
    return { avatarUrl };
  }

  async getProfile(id: string) {
    const user = await this.prisma.account.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        preferredLanguage: true,
        serviceLocation: true,
        avatarUrl: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('Account not found');
    return user;
  }
}
