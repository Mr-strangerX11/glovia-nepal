import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/orders.dto';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const orderNumber = this.generateOrderNumber();

    const items = await Promise.all(
      dto.items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }

        if (!product.isActive) {
          throw new BadRequestException(`${product.name} is not available`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}`,
          );
        }

        const priceNumber = Number(product.price);

        return {
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          total: priceNumber * item.quantity,
        };
      }),
    );

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const deliveryCharge = this.calculateDeliveryCharge(address.district, subtotal);
    const discount = dto.couponCode ? await this.calculateDiscount(dto.couponCode, subtotal) : 0;
    const total = subtotal + deliveryCharge - discount;

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: dto.addressId,
          subtotal,
          discount,
          deliveryCharge,
          total,
          paymentMethod: dto.paymentMethod || PaymentMethod.CASH_ON_DELIVERY,
          customerNote: dto.note,
          items: {
            create: items,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      if (createdOrder.paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
        await tx.payment.create({
          data: {
            orderId: createdOrder.id,
            method: PaymentMethod.CASH_ON_DELIVERY,
            amount: total,
            status: PaymentStatus.PENDING,
          },
        });
      }

      if (dto.clearCart) {
        await tx.cartItem.deleteMany({
          where: { userId },
        });
      }

      return createdOrder;
    });

    return order;
  }

  async findAll(userId: string, filters?: { status?: OrderStatus }) {
    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { displayOrder: 'asc' },
                },
              },
            },
          },
        },
        address: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { displayOrder: 'asc' },
                },
              },
            },
          },
        },
        address: true,
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const cancellableStatuses: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          cancelledAt: new Date(),
        },
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              increment: item.quantity,
            },
          },
        });
      }

      return updatedOrder;
    });
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `ORD${timestamp}${random}`;
  }

  private calculateDeliveryCharge(district: string, subtotal: number): number {
    const freeDeliveryThreshold = Number(
      this.configService.get('FREE_DELIVERY_THRESHOLD', 2000),
    );

    if (subtotal >= freeDeliveryThreshold) {
      return 0;
    }

    const valleyDistricts = ['Kathmandu', 'Lalitpur', 'Bhaktapur'];
    const valleyCharge = Number(
      this.configService.get('VALLEY_DELIVERY_CHARGE', 100),
    );
    const outsideValleyCharge = Number(
      this.configService.get('OUTSIDE_VALLEY_CHARGE', 150),
    );

    return valleyDistricts.includes(district)
      ? valleyCharge
      : outsideValleyCharge;
  }

  private async calculateDiscount(
    couponCode: string,
    subtotal: number,
  ): Promise<number> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: couponCode },
    });

    if (!coupon || !coupon.isActive) {
      return 0;
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return 0;
    }

    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      return 0;
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return 0;
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (subtotal * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, Number(coupon.maxDiscount));
      }
    } else {
      discount = Number(coupon.discountValue);
    }

    await this.prisma.coupon.update({
      where: { id: coupon.id },
      data: { usageCount: { increment: 1 } },
    });

    return discount;
  }
}
