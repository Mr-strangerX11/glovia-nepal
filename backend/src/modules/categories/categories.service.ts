import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug, isActive: true },
      include: {
        children: {
          where: { isActive: true },
        },
        products: {
          where: { isActive: true },
          include: {
            images: {
              take: 1,
              orderBy: { displayOrder: 'asc' },
            },
          },
          take: 12,
        },
      },
    });
  }
}
