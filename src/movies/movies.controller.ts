import { Controller, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { PeliculasService } from './movies.service';

@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  @Get(':año')
  async getPeliculasPorAño(
    @Param('año') año: string,
    @Query('q') q: string
  ) {
    if (!q || q.trim() === '') {
      throw new BadRequestException('Debe proporcionar un parámetro de búsqueda (q)');
    }

    // Llamar al servicio pasando ambos parámetros: año y query
    return this.peliculasService.getPeliculasPorAño(año, q);
  }
}
