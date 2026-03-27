import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export enum InventoryMovementTypeDto {
  IN = 'IN',
  OUT = 'OUT',
  ADJUST = 'ADJUST',
}

export class CreateInventoryMovementDto {
  @ApiProperty({ description: 'ID del producto', example: 'clxx123456789' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Tipo de movimiento',
    enum: InventoryMovementTypeDto,
    example: InventoryMovementTypeDto.IN,
  })
  @IsEnum(InventoryMovementTypeDto)
  @IsNotEmpty()
  type: InventoryMovementTypeDto;

  @ApiProperty({ description: 'Cantidad (siempre positiva)', example: 10, minimum: 1 })
  @IsNumber()
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  quantity: number;

  @ApiPropertyOptional({ description: 'Motivo del movimiento', example: 'Ingreso por compra' })
  @IsOptional()
  @IsString()
  reason?: string;
}
