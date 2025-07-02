import { Product } from '../src/products/entities/product.entity';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '',
  database: 'redis',
  entities: [Product],
  synchronize: true,
});

async function seed() {
  console.log('🌱 Iniciando seed...');
  await AppDataSource.initialize();
  console.log('✅ Conectado a PostgreSQL');

  const repo = AppDataSource.getRepository(Product);

  // Limpiar productos existentes
  await repo.clear();
  console.log('🧹 Productos existentes eliminados');

  console.log('📦 Creando 1,000 productos...');
  for (let i = 1; i <= 1000; i++) {
    const product = repo.create({
      name: `Product ${i}`,
      price: parseFloat((Math.random() * 100).toFixed(2)),
    });
    await repo.save(product);

    if (i % 100 === 0) {
      console.log(`✨ ${i} productos creados...`);
    }
  }

  console.log('🎉 Seeded 1,000 productos completado!');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Error en seed:', error);
  process.exit(1);
});
