import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AppRole } from '../../common/constants/roles';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { GetInventoryMovementsQueryDto } from './dto/get-inventory-movements-query.dto';
import { InventoryMovementResponseDto } from './dto/inventory-response.dto';
import { RegisterLossDto } from './dto/register-loss.dto';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('loss')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.PASTERO, AppRole.ADMINISTRADOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar merma de inventario', description: 'Descuenta stock por producto dañado, vencido o inutilizable. No crea orden. Requiere rol PASTERO o ADMINISTRADOR.' })
  @ApiResponse({ status: 201, description: 'Producto actualizado tras registrar la merma' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o stock insuficiente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permiso (requiere PASTERO o ADMINISTRADOR)' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async registerLoss(@Body() dto: RegisterLossDto, @CurrentUser() user: { id: string }) {
    return this.inventoryService.registerLoss(dto, user?.id);
  }

  @Post('movement')
  @ApiOperation({ summary: 'Registrar movimiento de inventario', description: 'Crea un movimiento IN (ingreso), OUT (salida por venta) o ADJUST (ajuste manual). Requiere cantidad positiva y producto existente; en OUT valida stock suficiente.' })
  @ApiResponse({ status: 201, description: 'Movimiento creado', type: InventoryMovementResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos o stock insuficiente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async createMovement(@Body() dto: CreateInventoryMovementDto /* TODO: @Request() req y usar req.user?.id cuando exista AuthGuard */) {
    const userId = undefined; // Reemplazar por req.user?.id cuando se agregue autenticación
    return this.inventoryService.createMovement(dto, userId);
  }

  @Get('movements')
  @ApiOperation({ summary: 'Listar movimientos de inventario', description: 'Obtiene el historial de movimientos. Opcionalmente filtra por productId.' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos', type: [InventoryMovementResponseDto] })
  async getMovements(@Query() query: GetInventoryMovementsQueryDto) {
    return this.inventoryService.getMovements(query.productId);
  }
}
