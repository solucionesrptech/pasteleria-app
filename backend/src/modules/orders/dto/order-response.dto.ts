import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPriceCLP: number;

  @ApiProperty()
  lineTotalCLP: number;

  @ApiProperty()
  createdAt: Date;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional({ nullable: true })
  customerName: string | null;

  @ApiPropertyOptional({ nullable: true })
  customerEmail: string | null;

  @ApiPropertyOptional({ nullable: true })
  customerPhone: string | null;

  @ApiProperty()
  fulfillmentType: string;

  @ApiPropertyOptional({ nullable: true })
  deliveryAddress: string | null;

  @ApiPropertyOptional({ nullable: true })
  zone: string | null;

  @ApiProperty()
  totalCLP: number;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional({ nullable: true })
  publicToken: string | null;

  @ApiProperty()
  source: string;

  @ApiPropertyOptional({ nullable: true })
  createdByUserId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: [OrderItemResponseDto], nullable: true })
  items?: OrderItemResponseDto[];
}
