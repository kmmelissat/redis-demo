import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CacheService } from '../cache.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cacheService: CacheService,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll() {
    const cacheKey = 'products:all';

    // 1. Intentar obtener desde Redis
    const cachedProducts = await this.cacheService.get(cacheKey);
    if (cachedProducts) {
      console.log('Productos obtenidos desde Redis cache');
      return {
        data: cachedProducts,
        source: 'cache',
        cached_at: new Date().toISOString(),
      };
    }

    // 2. Si no está en cache, consultar PostgreSQL
    console.log('🔍 Consultando productos desde PostgreSQL...');
    const products = await this.productRepository.find();

    // 3. Guardar en Redis por 20 segundos
    await this.cacheService.set(cacheKey, products, 20);
    console.log('💾 Productos guardados en Redis cache por 20 segundos');

    return {
      data: products,
      source: 'database',
      cached_at: new Date().toISOString(),
    };
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Invalidar cache cuando se actualiza un producto
    await this.cacheService.set('products:all', null, 1); // Eliminar cache
    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    // Invalidar cache cuando se elimina un producto
    await this.cacheService.set('products:all', null, 1); // Eliminar cache
    return this.productRepository.delete(id);
  }
}
