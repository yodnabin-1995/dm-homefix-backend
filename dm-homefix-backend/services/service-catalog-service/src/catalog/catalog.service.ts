import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.serviceCategory.create({
      data: {
        id: uuidv4(),
        nameEn: dto.nameEn,
        nameAm: dto.nameAm,
        descriptionEn: dto.descriptionEn,
        descriptionAm: dto.descriptionAm,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findAll(lang: string = 'en') {
    const cats = await this.prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { nameEn: 'asc' },
    });
    return cats.map((c) => ({
      id: c.id,
      name: lang === 'am' ? c.nameAm : c.nameEn,
      description: lang === 'am' ? c.descriptionAm : c.descriptionEn,
      isActive: c.isActive,
    }));
  }

  async findAllAdmin() {
    return this.prisma.serviceCategory.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const cat = await this.prisma.serviceCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('CATEGORY_NOT_FOUND');
    return cat;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.serviceCategory.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() },
    });
  }

  async deactivate(id: string) {
    await this.findOne(id);
    return this.prisma.serviceCategory.update({ where: { id }, data: { isActive: false } });
  }
}
