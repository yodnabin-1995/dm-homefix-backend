import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.account.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        preferredLanguage: dto.preferredLanguage,
        serviceLocation: dto.serviceLocation,
        updatedAt: new Date(),
      },
    });
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
