import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheService } from './cache.service';
import { ProductsModule } from './products/products.module';
import { PhrasesModule } from './phrases/phrases.module';
import { HttpModule } from '@nestjs/axios';
import { PeliculasModule } from 'src/movies/movies.module';
import { Product } from './products/entities/product.entity';

@Module({
  imports: [
    HttpModule,
    PeliculasModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'redis_demo',
      entities: [Product],
      synchronize: true, // Solo para desarrollo
      logging: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get('REDIS_HOST', 'localhost'),
            port: configService.get('REDIS_PORT', 6379),
          },
          ttl: configService.get('REDIS_TTL', 10),
        }),
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    PhrasesModule,
    PeliculasModule,
  ],
  controllers: [AppController],
  providers: [AppService, CacheService],
})
export class AppModule {}
