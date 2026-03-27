import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { ReportsModule } from '../reports/reports.module';

/**
 * Módulo que centraliza las capacidades del perfil ADMINISTRADOR.
 * No contiene lógica propia: los endpoints de productos, pedidos y reportes
 * viven en sus módulos. Aquí se exponen capacidades (RBAC) y se agrupan imports
 * para un posible panel de admin.
 */
@Module({
  imports: [ProductsModule, OrdersModule, ReportsModule],
  controllers: [AdminController],
})
export class AdminModule {}
