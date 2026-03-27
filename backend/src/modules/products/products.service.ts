import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async findAll(activeOnly?: boolean) {
    return this.productsRepository.findAll(activeOnly);
  }

  async getById(id: string) {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return product;
  }

  async search(q?: string) {
    if (q === undefined || q === null) {
      return this.productsRepository.findAll();
    }
    const trimmed = String(q).trim();
    return this.productsRepository.searchByCriteria(trimmed || '');
  }

  async checkExists(id: string) {
    const product = await this.productsRepository.findById(id);
    return { exists: !!product, product: product ?? null };
  }

  async create(dto: CreateProductDto) {
    return this.productsRepository.create({
      name: dto.name,
      description: dto.description,
      priceCLP: dto.priceCLP,
      imageUrl: dto.imageUrl,
      stock: dto.stock ?? 0,
      active: dto.active ?? true,
    });
  }
}
