import { ApiProperty } from '@nestjs/swagger';

export class SalesByAmountResponseDto {
  @ApiProperty({ description: 'Total vendido en pesos en el período' })
  totalCLP: number;

  @ApiProperty({ description: 'Cantidad de pedidos en el período' })
  orderCount: number;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  range: string;
}
