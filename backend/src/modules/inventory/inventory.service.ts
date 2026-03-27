import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InventoryMovementType } from '@prisma/client';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { RegisterLossDto } from './dto/register-loss.dto';
import { InventoryRepository } from './inventory.repository';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async createMovement(dto: CreateInventoryMovementDto, userId?: string) {
    const quantity = Number(dto.quantity);
    if (quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const product = await this.inventoryRepository.findProductById(dto.productId);
    if (!product) {
      throw new NotFoundException(`Producto con id ${dto.productId} no encontrado`);
    }

    const type = dto.type as InventoryMovementType;
    let newStock: number;

    switch (type) {
      case 'IN':
      case 'ADJUST':
        newStock = product.stock + quantity;
        break;
      case 'OUT':
        newStock = product.stock - quantity;
        if (newStock < 0) {
          throw new BadRequestException(
            `Stock insuficiente. Disponible: ${product.stock}, solicitado: ${quantity}`,
          );
        }
        break;
      default:
        throw new BadRequestException(`Tipo de movimiento no válido: ${type}`);
    }

    await this.inventoryRepository.updateProductStock(dto.productId, newStock);

    const movement = await this.inventoryRepository.createMovement({
      productId: dto.productId,
      type,
      quantity,
      reason: dto.reason,
      userId,
    });

    return movement;
  }

  async getMovements(productId?: string) {
    return this.inventoryRepository.findMovements(productId);
  }

  async registerLoss(dto: RegisterLossDto, userId?: string) {
    const quantity = Number(dto.quantity);
    if (quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const reasonTrimmed = dto.reason?.trim() ?? '';
    if (!reasonTrimmed) {
      throw new BadRequestException('El motivo de la merma es requerido');
    }

    const product = await this.inventoryRepository.findProductById(dto.productId);
    if (!product) {
      throw new NotFoundException(`Producto con id ${dto.productId} no encontrado`);
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Stock insuficiente para registrar merma. Disponible: ${product.stock}, solicitado: ${quantity}`,
      );
    }

    return this.inventoryRepository.registerLoss(
      dto.productId,
      quantity,
      reasonTrimmed,
      userId,
    );
  }
}
