import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RedisService } from './redis.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PeliculasService {
  private readonly OMDB_API_KEY = 'c2e6bed4';
  private readonly OMDB_BASE_URL = 'http://www.omdbapi.com/';

  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {}

  async getPeliculasPorAño(año: string, query: string) {
    const cacheKey = `peliculas_${año}_${query}`;

    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      const parsedCache = JSON.parse(cachedData);
      if (parsedCache.length > 0) {
        return {
          source: 'cache',
          data: parsedCache,
        };
      }
    }

    const url = `${this.OMDB_BASE_URL}?apikey=${this.OMDB_API_KEY}&s=${encodeURIComponent(query)}&y=${año}&type=movie`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

      if (data.Response === 'False') {
        throw new BadRequestException(data.Error || 'No se encontraron películas');
      }

      const pelis = data.Search || [];

      if (pelis.length > 0) {
        await this.redisService.setEx(cacheKey, 60, JSON.stringify(pelis));
      }

      return {
        source: 'api',
        data: pelis,
      };

    } catch (error) {
      console.error('Error consultando OMDB:', error.message);
      throw new BadRequestException(error.response?.data?.Error || error.message || 'Error al obtener datos');
    }
  }
}
