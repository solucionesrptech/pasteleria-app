import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { QueryReportRangeDto } from './query-report-range.dto';

export class QueryOrderTicketsDto extends QueryReportRangeDto {
  @ApiPropertyOptional({ description: 'Filtrar por estado del pedido', enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
