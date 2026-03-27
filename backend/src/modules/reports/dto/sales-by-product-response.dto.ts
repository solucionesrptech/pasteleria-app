import { ApiProperty } from '@nestjs/swagger';

export class SalesByProductItemDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  quantitySold: number;

  @ApiProperty()
  totalCLP: number;
}

export class SalesByProductResponseDto {
  @ApiProperty({ type: [SalesByProductItemDto] })
  items: SalesByProductItemDto[];

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  range: string;
}
