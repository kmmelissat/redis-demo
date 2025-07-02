import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RedisService } from './redis.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PeliculasService {
  private readonly OMDB_API_KEY = '62c4e084';
  private readonly OMDB_BASE_URL = 'http://www.omdbapi.com/';

  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {}

  async getPeliculasPorAño(año: string, query: string = 'movie') {
    const cacheKey = `peliculas_${año}_${query}`;

    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
      return {
        source: 'cache',
        data: JSON.parse(cachedData),
      };
    }

    const url = `${this.OMDB_BASE_URL}?apikey=${this.OMDB_API_KEY}&s=${query}&y=${año}&type=movie`;

    const response = await firstValueFrom(this.httpService.get(url));
    const peliculas = response.data.Search || [];

    await this.redisService.setEx(cacheKey, 60, JSON.stringify(peliculas));

    return {
      source: 'api',
      data: peliculas,
    };
  }
}
