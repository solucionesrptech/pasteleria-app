import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppRole, ADMINISTRATOR_PERMISSIONS } from '../../common/constants/roles';
import { AdminCapabilitiesResponseDto } from './dto/admin-capabilities.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  @Get('capabilities')
  @ApiOperation({
    summary: 'Capacidades del perfil administrador',
    description: 'Lista de permisos asociados al rol ADMINISTRADOR. Útil para el frontend y para RBAC.',
  })
  @ApiResponse({ status: 200, description: 'Rol y permisos', type: AdminCapabilitiesResponseDto })
  getCapabilities(): AdminCapabilitiesResponseDto {
    return {
      role: AppRole.ADMINISTRADOR,
      permissions: [...ADMINISTRATOR_PERMISSIONS],
    };
  }
}
