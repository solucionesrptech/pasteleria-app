import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductExistsResponseDto, ProductResponseDto } from './dto/product-response.dto';
import { SearchProductQueryDto } from './dto/search-product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos', type: [ProductResponseDto] })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar producto por nombre o criterio' })
  @ApiResponse({ status: 200, description: 'Productos que coinciden con el criterio', type: [ProductResponseDto] })
  async search(@Query() query: SearchProductQueryDto) {
    return this.productsService.search(query.q);
  }

  @Get('check/:id')
  @ApiOperation({ summary: 'Validar si un producto existe (por id)' })
  @ApiResponse({ status: 200, description: 'Indica si existe y opcionalmente el producto', type: ProductExistsResponseDto })
  async checkExists(@Param('id') id: string) {
    return this.productsService.checkExists(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por id' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getById(@Param('id') id: string) {
    return this.productsService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear producto' })
  @ApiResponse({ status: 201, description: 'Producto creado', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }
}
