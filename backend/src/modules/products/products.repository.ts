import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateProductData {
  name: string;
  description?: string | null;
  priceCLP: number;
  imageUrl?: string | null;
  stock?: number;
  active?: boolean;
}

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findAll(activeOnly?: boolean) {
    return this.prisma.product.findMany({
      where: activeOnly !== undefined ? { active: activeOnly } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async searchByCriteria(q: string) {
    const term = q.trim().toLowerCase();
    if (!term) return this.findAll();
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(data: CreateProductData) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        priceCLP: data.priceCLP,
        imageUrl: data.imageUrl ?? null,
        stock: data.stock ?? 0,
        active: data.active ?? true,
      },
    });
  }
}
