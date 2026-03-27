import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManualOrderDto } from './dto/create-manual-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear pedido desde tienda (web)' })
  @ApiResponse({ status: 201, description: 'Pedido creado', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos, productos inexistentes o stock insuficiente' })
  async create(@Body() dto: CreateManualOrderDto) {
    return this.ordersService.createForWeb(dto);
  }

  @Post('manual')
  @ApiOperation({ summary: 'Crear pedido manual (administrador)' })
  @ApiResponse({ status: 201, description: 'Pedido creado', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos o productos inexistentes' })
  async createManual(@Body() dto: CreateManualOrderDto) {
    return this.ordersService.createManual(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pedidos' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos', type: [OrderResponseDto] })
  async findAll(@Query() query: QueryOrdersDto) {
    return this.ordersService.findAll(query.status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pedido por id' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async getById(@Param('id') id: string) {
    return this.ordersService.getById(id);
  }
}
