import { Product } from 'src/products/entities/product.entity';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'suser',
  database: 'redis',
  entities: [Product],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Product);

  for (let i = 1; i <= 1000; i++) {
    const product = repo.create({
      name: `Product ${i}`,
      price: parseFloat((Math.random() * 100).toFixed(2)),
    });
    await repo.save(product);
  }

  console.log('Seeded 1,000 products');
  await AppDataSource.destroy();
}

seed();