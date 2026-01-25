import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OrderStatus, UserRole } from '@prisma/client';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { UpdateOrderDto } from './dto/order.dto';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Dashboard Analytics
  async getDashboard() {
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      pendingOrders,
      recentOrders,
      topProductsRaw,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { total: true },
      }),
      this.prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    const productIds = topProductsRaw.map((p) => p.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));
    const topProducts = topProductsRaw.map((p) => ({
      ...p,
      product: productMap.get(p.productId),
    }));

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalCustomers,
      pendingOrders,
      recentOrders,
      topProducts,
    };
  }

  // User Management
  async createUser(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const password = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role || UserRole.CUSTOMER,
      },
    });
  }

  async getAllProducts(params?: { search?: string; page?: number; limit?: number }) {
    const { search, page = 1, limit = 20 } = params || {};
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { images: { orderBy: { displayOrder: 'asc' }, take: 1 } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateUserRole(userId: string, role: UserRole, actorRole?: UserRole) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.SUPER_ADMIN && actorRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot modify SUPER_ADMIN role');
    }

    if (role === UserRole.SUPER_ADMIN && actorRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot assign SUPER_ADMIN role');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'User deleted successfully' };
  }

  // Product Management
  async createProduct(dto: CreateProductDto) {
    const { images, ...productData } = dto;

    return this.prisma.product.create({
      data: {
        ...productData,
        images: images
          ? {
              create: images.map((url, index) => ({
                url,
                displayOrder: index,
              })),
            }
          : undefined,
      },
      include: { images: true },
    });
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { images, ...productData } = dto;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        images: images
          ? {
              deleteMany: {},
              create: images.map((url, index) => ({ url, displayOrder: index })),
            }
          : undefined,
      },
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    });
  }

  async deleteProduct(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  // Order Management
  async getAllOrders(filters?: { status?: OrderStatus; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true, phone: true },
          },
          address: true,
          items: {
            include: {
              product: {
                select: { name: true, images: { take: 1 } },
              },
            },
          },
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateOrder(id: string, dto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updateData: any = { ...dto };

    if (dto.status === OrderStatus.CONFIRMED && !order.confirmedAt) {
      updateData.confirmedAt = new Date();
    }
    if (dto.status === OrderStatus.SHIPPED && !order.shippedAt) {
      updateData.shippedAt = new Date();
    }
    if (dto.status === OrderStatus.DELIVERED && !order.deliveredAt) {
      updateData.deliveredAt = new Date();
    }
    if (dto.status === OrderStatus.CANCELLED && !order.cancelledAt) {
      updateData.cancelledAt = new Date();
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  // Customer Management
  async getAllCustomers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: customers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Reviews Management
  async getAllReviews(filters?: { isApproved?: boolean; page?: number; limit?: number }) {
    const { isApproved, page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;

    const where: any = {};
    if (isApproved !== undefined) {
      where.isApproved = isApproved;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
          product: {
            select: { name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async approveReview(id: string) {
    return this.prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async deleteReview(id: string) {
    await this.prisma.review.delete({ where: { id } });
    return { message: 'Review deleted successfully' };
  }
}
