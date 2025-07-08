import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RedisService } from './redis.service';
import { firstValueFrom } from 'rxjs';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

@Injectable()
export class PeliculasService {
  private readonly OMDB_API_KEY = 'c2e6bed4';
  private readonly OMDB_BASE_URL = 'http://www.omdbapi.com/';

  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {}

  async getPeliculasPorAño(año: string) {
    const cacheKey = `peliculas_${año}`;

    // Verificar si hay datos en caché
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
      const parsedCache = JSON.parse(cachedData);
      return {
        source: 'cache',
        year: año,
        data: parsedCache,
        cached_at: new Date().toISOString(),
      };
    }

    // Buscar películas populares del año específico
    const popularSearchTerms = [
      'the',
      'love',
      'man',
      'war',
      'life',
      'story',
      'world',
      'new',
      'last',
      'first',
    ];
    let allMovies: Movie[] = [];

    try {
      // Hacer múltiples búsquedas para obtener más películas del año
      for (const term of popularSearchTerms.slice(0, 3)) {
        // Solo usar 3 términos para evitar too many requests
        const url = `${this.OMDB_BASE_URL}?apikey=${this.OMDB_API_KEY}&s=${term}&y=${año}&type=movie`;

        try {
          const response = await firstValueFrom(this.httpService.get(url));
          const data = response.data;

          if (data.Response === 'True' && data.Search) {
            allMovies = allMovies.concat(data.Search);
          }
        } catch (searchError) {
          console.warn(
            `Error en búsqueda con término "${term}":`,
            searchError.message,
          );
        }
      }

      // Remover duplicados basados en imdbID
      const uniqueMovies = allMovies.filter(
        (movie, index, self) =>
          index === self.findIndex((m) => m.imdbID === movie.imdbID),
      );

      // Limitar a 10 películas y ordenar por título
      const finalMovies = uniqueMovies
        .slice(0, 10)
        .sort((a, b) => a.Title.localeCompare(b.Title));

      if (finalMovies.length === 0) {
        throw new BadRequestException(
          `No se encontraron películas para el año ${año}`,
        );
      }

      // Guardar en caché por 30 segundos
      await this.redisService.setEx(cacheKey, 30, JSON.stringify(finalMovies));

      return {
        source: 'api',
        year: año,
        data: finalMovies,
        fetched_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error consultando OMDB:', error.message);
      throw new BadRequestException(
        error.response?.data?.Error ||
          error.message ||
          `Error al obtener películas del año ${año}`,
      );
    }
  }
}
