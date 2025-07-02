import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RedisService } from './redis.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PeliculasService {
  private readonly TMDB_API_KEY = 'tu_api_key_aqui';
  private readonly TMDB_BASE_URL = 'https://api.themoviedb.org/3';

  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {}

  async getPeliculasPorAño(año: string) {
    
    const cacheKey = `peliculas_${año}`;

    
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
      return {
        source: 'cache',
        data: JSON.parse(cachedData),
      };
    }

    
    const url = `${this.TMDB_BASE_URL}/discover/movie?api_key=${this.TMDB_API_KEY}&primary_release_year=${año}`;
    const response = await firstValueFrom(this.httpService.get(url));
    const peliculas = response.data.results;

    
    await this.redisService.setEx(cacheKey, 30, JSON.stringify(peliculas));

    return {
      source: 'api',
      data: peliculas,
    };
  }
}