import { Injectable } from '@nestjs/common';
import { InventoryMovementType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateMovementData {
  productId: string;
  type: InventoryMovementType;
  quantity: number;
  reason?: string;
  userId?: string;
}

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async updateProductStock(productId: string, newStock: number) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });
  }

  async createMovement(data: CreateMovementData) {
    return this.prisma.inventoryMovement.create({
      data: {
        productId: data.productId,
        type: data.type,
        quantity: data.quantity,
        reason: data.reason ?? null,
        userId: data.userId ?? null,
      },
      include: {
        product: { select: { id: true, name: true } },
      },
    });
  }

  async findMovements(productId?: string) {
    return this.prisma.inventoryMovement.findMany({
      where: productId ? { productId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true } },
      },
    });
  }

  async registerLoss(productId: string, quantity: number, reason: string, userId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
      });
      await tx.inventoryMovement.create({
        data: {
          productId,
          type: 'LOSS',
          quantity,
          reason: reason || null,
          userId: userId ?? null,
        },
      });
      return product;
    });
  }
}
