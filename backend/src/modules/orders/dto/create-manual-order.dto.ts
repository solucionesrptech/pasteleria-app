import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { FulfillmentType } from '@prisma/client';
import { OrderItemDto } from './order-item.dto';

export class CreateManualOrderDto {
  @ApiPropertyOptional({ description: 'Nombre del cliente' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Email del cliente' })
  @IsOptional()
  @IsString()
  @ValidateIf((_, v) => v != null && String(v).trim() !== '')
  @IsEmail({}, { message: 'customerEmail debe ser un email válido' })
  customerEmail?: string;

  @ApiPropertyOptional({ description: 'Teléfono del cliente' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({ description: 'Tipo de entrega', enum: ['DELIVERY', 'PICKUP'], default: 'PICKUP' })
  @IsOptional()
  @IsEnum(FulfillmentType)
  fulfillmentType?: FulfillmentType;

  @ApiPropertyOptional({ description: 'Dirección de entrega' })
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiPropertyOptional({ description: 'Zona' })
  @IsOptional()
  @IsString()
  zone?: string;

  @ApiProperty({ description: 'Items del pedido', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
