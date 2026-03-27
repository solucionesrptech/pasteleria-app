import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface DateRange {
  from: Date;
  to: Date;
}

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrdersInRange(from: Date, to: Date, status?: OrderStatus) {
    const where: Prisma.OrderWhereInput = {
      createdAt: { gte: from, lte: to },
    };
    if (status !== undefined) {
      where.status = status;
    }
    return this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async aggregateOrderItemsByProductInRange(from: Date, to: Date) {
    const items = await this.prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: from, lte: to },
          status: { not: 'CANCELLED' },
        },
      },
      include: { product: { select: { id: true, name: true } } },
    });

    const map = new Map<
      string,
      { productId: string; productName: string; quantitySold: number; totalCLP: number }
    >();
    for (const item of items) {
      const existing = map.get(item.productId);
      if (existing) {
        existing.quantitySold += item.quantity;
        existing.totalCLP += item.lineTotalCLP;
      } else {
        map.set(item.productId, {
          productId: item.productId,
          productName: item.product.name,
          quantitySold: item.quantity,
          totalCLP: item.lineTotalCLP,
        });
      }
    }
    return Array.from(map.values());
  }

  async sumTotalCLPAndCountOrdersInRange(from: Date, to: Date) {
    const result = await this.prisma.order.aggregate({
      where: {
        createdAt: { gte: from, lte: to },
        status: { not: 'CANCELLED' },
      },
      _sum: { totalCLP: true },
      _count: true,
    });
    return {
      totalCLP: result._sum.totalCLP ?? 0,
      orderCount: result._count,
    };
  }
}
