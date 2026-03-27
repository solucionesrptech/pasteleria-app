import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;

  @ApiProperty()
  priceCLP: number;

  @ApiPropertyOptional({ nullable: true })
  imageUrl: string | null;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ProductExistsResponseDto {
  @ApiProperty()
  exists: boolean;

  @ApiPropertyOptional({ type: ProductResponseDto, nullable: true })
  product?: ProductResponseDto | null;
}
