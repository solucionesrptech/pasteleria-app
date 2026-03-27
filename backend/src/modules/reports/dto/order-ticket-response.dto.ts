import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderTicketResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional({ nullable: true })
  customerName: string | null;

  @ApiProperty()
  totalCLP: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  source: string;

  @ApiProperty()
  createdAt: Date;
}
