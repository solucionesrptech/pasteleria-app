import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { REPORT_RANGES } from './dto/query-report-range.dto';
import { OrderTicketResponseDto } from './dto/order-ticket-response.dto';
import { SalesByAmountResponseDto } from './dto/sales-by-amount-response.dto';
import { SalesByProductResponseDto } from './dto/sales-by-product-response.dto';
import { SalesReportResponseDto } from './dto/sales-report-response.dto';
import { QueryOrderTicketsDto } from './dto/query-order-tickets.dto';
import { QueryReportRangeDto } from './dto/query-report-range.dto';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @ApiOperation({
    summary: 'Reporte de ventas por rango (summary + productos)',
    description: `Devuelve resumen (totalSalesCLP, paidOrdersCount, unitsSold) y detalle por producto. Solo implementado range=monthly. Valores aceptados: ${REPORT_RANGES.join(', ')}`,
  })
  @ApiResponse({ status: 200, description: 'Reporte de ventas', type: SalesReportResponseDto })
  @ApiResponse({ status: 400, description: 'Rango no implementado o no válido' })
  async getSalesReport(@Query() query: QueryReportRangeDto) {
    return this.reportsService.getSalesReport(query.range ?? 'monthly', query.date);
  }

  @Get('orders/tickets')
  @ApiOperation({
    summary: 'Reporte de tickets del pedido',
    description: `Lista pedidos/tickets con filtro por fecha (range: ${REPORT_RANGES.join(', ')}) y opcionalmente por estado`,
  })
  @ApiResponse({ status: 200, description: 'Lista de tickets con rango aplicado' })
  async getOrderTickets(@Query() query: QueryOrderTicketsDto) {
    return this.reportsService.getOrderTickets(
      query.range ?? 'monthly',
      query.date,
      query.status,
    );
  }

  @Get('sales/by-product')
  @ApiOperation({
    summary: 'Reporte de ventas por producto',
    description: `Ventas agrupadas por producto en el rango (${REPORT_RANGES.join(', ')})`,
  })
  @ApiResponse({ status: 200, description: 'Ventas por producto', type: SalesByProductResponseDto })
  async getSalesByProduct(@Query() query: QueryReportRangeDto) {
    return this.reportsService.getSalesByProduct(query.range ?? 'monthly', query.date);
  }

  @Get('sales/by-amount')
  @ApiOperation({
    summary: 'Reporte de ventas en pesos',
    description: `Total vendido en el período y cantidad de pedidos (${REPORT_RANGES.join(', ')})`,
  })
  @ApiResponse({ status: 200, description: 'Total en pesos y cantidad de pedidos', type: SalesByAmountResponseDto })
  async getSalesByAmount(@Query() query: QueryReportRangeDto) {
    return this.reportsService.getSalesByAmount(query.range ?? 'monthly', query.date);
  }
}
