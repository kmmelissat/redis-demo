import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class CacheService implements OnModuleInit {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({ url: 'redis://localhost:6379' });
    this.client.on('error', (err) => console.error('Redis Client Error', err));
    await this.client.connect();
    console.log('--Conectado a Redis');
  }

  async get(key: string): Promise<any> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
  }
}
