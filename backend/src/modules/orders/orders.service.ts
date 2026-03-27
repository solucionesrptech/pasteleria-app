import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderSource, OrderStatus } from '@prisma/client';
import { CreateManualOrderDto } from './dto/create-manual-order.dto';
import { OrdersRepository } from './orders.repository';
import { ProductsRepository } from '../products/products.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async createManual(dto: CreateManualOrderDto, createdByUserId?: string) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('El pedido debe tener al menos un producto válido');
    }

    const productIds = [...new Set(dto.items.map((i) => i.productId))];
    const products = await Promise.all(
      productIds.map((id) => this.productsRepository.findById(id)),
    );
    const productMap = new Map(products.filter(Boolean).map((p) => [p!.id, p!]));

    const missingIds = productIds.filter((id) => !productMap.has(id));
    if (missingIds.length > 0) {
      throw new BadRequestException(
        `No se puede asociar un pedido a productos inexistentes. Crear primero el producto o usar un id válido: ${missingIds.join(', ')}`,
      );
    }

    const orderItems: Array<{
      productId: string;
      quantity: number;
      unitPriceCLP: number;
      lineTotalCLP: number;
    }> = [];
    let totalCLP = 0;

    for (const item of dto.items) {
      if (item.quantity <= 0) {
        throw new BadRequestException('Las cantidades deben ser mayores a 0');
      }
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}`,
        );
      }
      const unitPriceCLP = product.priceCLP;
      const lineTotalCLP = unitPriceCLP * item.quantity;
      totalCLP += lineTotalCLP;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPriceCLP,
        lineTotalCLP,
      });
    }

    return this.ordersRepository.createWithItemsAndDecrementStock({
      customerName: dto.customerName ?? null,
      customerEmail: dto.customerEmail ?? null,
      customerPhone: dto.customerPhone ?? null,
      fulfillmentType: dto.fulfillmentType ?? 'PICKUP',
      deliveryAddress: dto.deliveryAddress ?? null,
      zone: dto.zone ?? null,
      totalCLP,
      status: OrderStatus.PENDING,
      source: OrderSource.MANUAL,
      createdByUserId: createdByUserId ?? null,
      items: orderItems,
    });
  }

  async createForWeb(dto: CreateManualOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('El pedido debe tener al menos un producto válido');
    }

    const productIds = [...new Set(dto.items.map((i) => i.productId))];
    const products = await Promise.all(
      productIds.map((id) => this.productsRepository.findById(id)),
    );
    const productMap = new Map(products.filter(Boolean).map((p) => [p!.id, p!]));

    const missingIds = productIds.filter((id) => !productMap.has(id));
    if (missingIds.length > 0) {
      throw new BadRequestException(
        `No se puede asociar un pedido a productos inexistentes. Crear primero el producto o usar un id válido: ${missingIds.join(', ')}`,
      );
    }

    const orderItems: Array<{
      productId: string;
      quantity: number;
      unitPriceCLP: number;
      lineTotalCLP: number;
    }> = [];
    let totalCLP = 0;

    for (const item of dto.items) {
      if (item.quantity <= 0) {
        throw new BadRequestException('Las cantidades deben ser mayores a 0');
      }
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}`,
        );
      }
      const unitPriceCLP = product.priceCLP;
      const lineTotalCLP = unitPriceCLP * item.quantity;
      totalCLP += lineTotalCLP;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPriceCLP,
        lineTotalCLP,
      });
    }

    return this.ordersRepository.createWithItemsAndDecrementStock({
      customerName: dto.customerName ?? null,
      customerEmail: dto.customerEmail ?? null,
      customerPhone: dto.customerPhone ?? null,
      fulfillmentType: dto.fulfillmentType ?? 'PICKUP',
      deliveryAddress: dto.deliveryAddress ?? null,
      zone: dto.zone ?? null,
      totalCLP,
      status: OrderStatus.PENDING,
      source: OrderSource.WEB,
      createdByUserId: null,
      items: orderItems,
    });
  }

  async findAll(status?: OrderStatus) {
    return this.ordersRepository.findMany(status ? { status } : undefined);
  }

  async getById(id: string) {
    const order = await this.ordersRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }
    return order;
  }
}
