import { ApiProperty } from '@nestjs/swagger';

export class AdminCapabilitiesResponseDto {
  @ApiProperty({ description: 'Rol del administrador' })
  role: string;

  @ApiProperty({
    description: 'Permisos del perfil administrador',
    type: [String],
    example: ['products:read', 'products:create', 'orders:create_manual', 'reports:tickets'],
  })
  permissions: string[];
}
