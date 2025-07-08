import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { CacheService } from '../cache.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cacheService: CacheService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);

    // Invalidar caché al crear un producto
    await this.cacheService.get('products_all');
    if (await this.cacheService.get('products_all')) {
      // Solo invalidar si existe caché
      await this.cacheService.set('products_all', null, 0);
    }

    return savedProduct;
  }

  async findAll(): Promise<{
    source: string;
    data: Product[];
    cached_at?: string;
    fetched_at?: string;
  }> {
    const cacheKey = 'products_all';

    // Verificar caché primero
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      return {
        source: 'cache',
        data: cachedData,
        cached_at: new Date().toISOString(),
      };
    }

    // Consultar base de datos
    const products = await this.productRepository.find({
      order: { id: 'ASC' },
    });

    // Guardar en caché por 20 segundos
    await this.cacheService.set(cacheKey, products, 20);

    return {
      source: 'database',
      data: products,
      fetched_at: new Date().toISOString(),
    };
  }

  async findOne(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | null> {
    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.productRepository.findOne({
      where: { id },
    });

    // Invalidar caché al actualizar
    await this.cacheService.set('products_all', null, 0);

    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);

    // Invalidar caché al eliminar
    await this.cacheService.set('products_all', null, 0);
  }

  // Método para seed de datos
  async seed(): Promise<void> {
    const count = await this.productRepository.count();

    if (count < 1000) {
      console.log('Creando productos de prueba...');

      const products: Partial<Product>[] = [];
      const categories = [
        'Electronics',
        'Books',
        'Clothing',
        'Home',
        'Sports',
        'Beauty',
        'Toys',
        'Food',
      ];
      const adjectives = [
        'Amazing',
        'Premium',
        'Deluxe',
        'Professional',
        'Ultimate',
        'Super',
        'Mega',
        'Ultra',
      ];

      for (let i = count + 1; i <= 1000; i++) {
        const category =
          categories[Math.floor(Math.random() * categories.length)];
        const adjective =
          adjectives[Math.floor(Math.random() * adjectives.length)];

        products.push({
          name: `${adjective} ${category} Product ${i}`,
          price: Math.round((Math.random() * 999 + 1) * 100) / 100, // Precio entre 1.00 y 999.99
        });
      }

      await this.productRepository.save(products);
      console.log(
        `Creados ${products.length} productos. Total: ${await this.productRepository.count()}`,
      );
    }
  }
}
