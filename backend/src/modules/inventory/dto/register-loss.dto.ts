import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class RegisterLossDto {
  @ApiProperty({ description: 'ID del producto', example: 'clxx123456789' })
  @IsNotEmpty({ message: 'productId es requerido' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Cantidad en merma (mayor a 0)', example: 2, minimum: 1 })
  @IsInt()
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  quantity: number;

  @ApiProperty({ description: 'Motivo de la merma (ej: producto vencido, dañado)', example: 'Producto vencido' })
  @IsNotEmpty({ message: 'reason es requerido' })
  @IsString()
  @MinLength(1, { message: 'El motivo no puede estar vacío' })
  reason: string;
}
