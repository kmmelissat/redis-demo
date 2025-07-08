import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { PeliculasService, Movie } from './movies.service';

interface MovieResponse {
  source: string;
  year: string;
  data: Movie[];
  cached_at?: string;
  fetched_at?: string;
}

@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  @Get(':año')
  async getPeliculasPorAño(@Param('año') año: string): Promise<MovieResponse> {
    const currentYear = new Date().getFullYear();
    const yearNumber = parseInt(año, 10);

    // Validar que el año sea válido
    if (
      isNaN(yearNumber) ||
      yearNumber < 1900 ||
      yearNumber > currentYear + 10
    ) {
      throw new BadRequestException(
        'Año inválido. Debe ser entre 1900 y ' + (currentYear + 10),
      );
    }

    return this.peliculasService.getPeliculasPorAño(año);
  }
}
