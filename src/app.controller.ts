import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheService } from './cache.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('cache/:key')
  async setCache(
    @Param('key') key: string,
    @Body() body: { value: any; ttl?: number },
  ): Promise<{ message: string }> {
    const ttl = body.ttl || 300; // Default 5 minutes
    await this.cacheService.set(key, body.value, ttl);
    return { message: `Cache set for key: ${key}` };
  }

  @Get('cache/:key')
  async getCache(@Param('key') key: string): Promise<any> {
    const data = await this.cacheService.get(key);
    return data ? { key, data } : { message: 'Key not found' };
  }
}
