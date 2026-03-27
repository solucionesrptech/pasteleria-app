import { ApiProperty } from '@nestjs/swagger';

export class SalesReportSummaryDto {
  @ApiProperty({ description: 'Total vendido en CLP en el período' })
  totalSalesCLP: number;

  @ApiProperty({ description: 'Cantidad de pedidos pagados en el período' })
  paidOrdersCount: number;

  @ApiProperty({ description: 'Total de unidades vendidas' })
  unitsSold: number;
}

export class SalesReportProductDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  quantitySold: number;

  @ApiProperty()
  totalSalesCLP: number;
}

export class SalesReportResponseDto {
  @ApiProperty({ description: 'Rango aplicado', example: 'monthly' })
  range: string;

  @ApiProperty({ type: SalesReportSummaryDto })
  summary: SalesReportSummaryDto;

  @ApiProperty({ type: [SalesReportProductDto] })
  products: SalesReportProductDto[];
}
