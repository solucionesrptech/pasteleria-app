import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class GetInventoryMovementsQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID de producto' })
  @IsOptional()
  @IsUUID()
  productId?: string;
}
