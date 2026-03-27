import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchProductQueryDto {
  @ApiPropertyOptional({ description: 'Criterio de búsqueda por nombre o texto' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;
}
