import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma, SkinType } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    search?: string;
    categoryId?: string;
    brandId?: string;
    skinType?: SkinType;
    minPrice?: number;
    maxPrice?: number;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNew?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      search,
      categoryId,
      brandId,
      skinType,
      minPrice,
      maxPrice,
      isFeatured,
      isBestSeller,
      isNew,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters || {};

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (skinType) {
      where.suitableFor = { has: skinType };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (isBestSeller !== undefined) {
      where.isBestSeller = isBestSeller;
    }

    if (isNew !== undefined) {
      where.isNew = isNew;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
            take: 1,
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    const productsWithRatings = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
            product.reviews.length
          : 0;

      const { reviews, ...productData } = product;

      return {
        ...productData,
        averageRating: Number(avgRating.toFixed(1)),
        reviewCount: reviews.length,
      };
    });

    return {
      data: productsWithRatings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
        : 0;

    return {
      ...product,
      averageRating: Number(avgRating.toFixed(1)),
      reviewCount: product.reviews.length,
    };
  }

  async getFeaturedProducts(limit = 8) {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
          take: 1,
        },
        category: {
          select: { name: true },
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return products;
  }

  async getBestSellers(limit = 8) {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isBestSeller: true },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
          take: 1,
        },
      },
      take: limit,
    });

    return products;
  }

  async getRelatedProducts(productId: string, categoryId: string, limit = 4) {
    return this.prisma.product.findMany({
      where: {
        id: { not: productId },
        categoryId,
        isActive: true,
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
          take: 1,
        },
      },
      take: limit,
    });
  }
}
