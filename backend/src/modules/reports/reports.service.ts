import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import type { ReportRange } from './dto/query-report-range.dto';
import { ReportsRepository } from './reports.repository';

export interface DateRange {
  from: Date;
  to: Date;
}

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  getDateRange(range: ReportRange, referenceDate: Date = new Date()): DateRange {
    const from = new Date(referenceDate);
    const to = new Date(referenceDate);
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    switch (range) {
      case 'daily':
        break;
      case 'weekly': {
        const day = from.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        from.setDate(from.getDate() + diff);
        to.setDate(from.getDate() + 6);
        to.setHours(23, 59, 59, 999);
        break;
      }
      case 'monthly':
        from.setDate(1);
        to.setMonth(from.getMonth() + 1, 0);
        to.setHours(23, 59, 59, 999);
        break;
      default:
        from.setDate(1);
        to.setMonth(from.getMonth() + 1, 0);
        to.setHours(23, 59, 59, 999);
    }
    return { from, to };
  }

  async getOrderTickets(range: ReportRange, date?: string, status?: OrderStatus) {
    const ref = date ? new Date(date) : new Date();
    const { from, to } = this.getDateRange(range, ref);
    const orders = await this.reportsRepository.findOrdersInRange(from, to, status);
    return {
      items: orders.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        totalCLP: o.totalCLP,
        status: o.status,
        source: o.source,
        createdAt: o.createdAt,
      })),
      from: from.toISOString(),
      to: to.toISOString(),
      range,
    };
  }

  async getSalesByProduct(range: ReportRange, date?: string) {
    const ref = date ? new Date(date) : new Date();
    const { from, to } = this.getDateRange(range, ref);
    const items = await this.reportsRepository.aggregateOrderItemsByProductInRange(from, to);
    return {
      items,
      from: from.toISOString(),
      to: to.toISOString(),
      range,
    };
  }

  async getSalesByAmount(range: ReportRange, date?: string) {
    const ref = date ? new Date(date) : new Date();
    const { from, to } = this.getDateRange(range, ref);
    const { totalCLP, orderCount } =
      await this.reportsRepository.sumTotalCLPAndCountOrdersInRange(from, to);
    return {
      totalCLP,
      orderCount,
      from: from.toISOString(),
      to: to.toISOString(),
      range,
    };
  }

  /**
   * Reporte unificado de ventas (summary + detalle por producto).
   * Soporta range: daily, weekly, monthly.
   */
  async getSalesReport(range: ReportRange, date?: string) {
    const ref = date ? new Date(date) : new Date();
    const { from, to } = this.getDateRange(range, ref);
    const [sumResult, productItems] = await Promise.all([
      this.reportsRepository.sumTotalCLPAndCountOrdersInRange(from, to),
      this.reportsRepository.aggregateOrderItemsByProductInRange(from, to),
    ]);
    const unitsSold = productItems.reduce((acc, p) => acc + p.quantitySold, 0);
    return {
      range,
      summary: {
        totalSalesCLP: sumResult.totalCLP ?? 0,
        paidOrdersCount: sumResult.orderCount,
        unitsSold,
      },
      products: productItems.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        quantitySold: p.quantitySold,
        totalSalesCLP: p.totalCLP,
      })),
    };
  }
}
