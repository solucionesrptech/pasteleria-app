import { Injectable } from '@nestjs/common';
import { OrderSource, OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface OrderItemInput {
  productId: string;
  quantity: number;
  unitPriceCLP: number;
  lineTotalCLP: number;
}

export interface CreateOrderData {
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  fulfillmentType: 'DELIVERY' | 'PICKUP';
  deliveryAddress?: string | null;
  zone?: string | null;
  totalCLP: number;
  status: OrderStatus;
  source: OrderSource;
  createdByUserId?: string | null;
  items: OrderItemInput[];
}

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithItemsAndDecrementStock(data: CreateOrderData) {
    const { items, ...orderData } = data;
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          ...orderData,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPriceCLP: item.unitPriceCLP,
              lineTotalCLP: item.lineTotalCLP,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            type: 'OUT',
            quantity: item.quantity,
            reason: `Venta pedido ${order.id}`,
          },
        });
      }

      return order;
    });
  }

  async createWithItems(data: CreateOrderData) {
    const { items, ...orderData } = data;
    return this.prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPriceCLP: item.unitPriceCLP,
            lineTotalCLP: item.lineTotalCLP,
          })),
        },
      },
      include: { items: true },
    });
  }

  async findMany(where?: Prisma.OrderWhereInput) {
    return this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: { select: { id: true, name: true } } } } },
    });
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: { select: { id: true, name: true } } } } },
    });
  }
}
