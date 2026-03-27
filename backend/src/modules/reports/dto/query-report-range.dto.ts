import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsDateString } from 'class-validator';

export type ReportRange = 'daily' | 'weekly' | 'monthly';

export const REPORT_RANGES: ReportRange[] = ['daily', 'weekly', 'monthly'];

export class QueryReportRangeDto {
  @ApiPropertyOptional({
    description: 'Rango del reporte',
    enum: REPORT_RANGES,
    default: 'monthly',
  })
  @IsOptional()
  @IsIn(REPORT_RANGES)
  range?: ReportRange;

  @ApiPropertyOptional({
    description: 'Fecha de referencia para el rango (ISO 8601). Por defecto hoy.',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
