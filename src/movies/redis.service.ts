import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient();
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async setEx(key: string, ttl: number, value: string): Promise<void> {
    await this.client.setEx(key, ttl, value);
  }
}