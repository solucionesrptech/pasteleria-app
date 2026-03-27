import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class InventoryMovementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty({ enum: ['IN', 'OUT', 'ADJUST'] })
  type: string;

  @ApiProperty()
  quantity: number;

  @ApiPropertyOptional({ nullable: true })
  reason: string | null;

  @ApiPropertyOptional({ nullable: true })
  userId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional({ type: ProductSummaryDto, nullable: true })
  product?: ProductSummaryDto | null;
}
