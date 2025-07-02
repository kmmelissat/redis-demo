import { Controller, Get, Param, Query } from '@nestjs/common';
import { PeliculasService } from './movies.service';


@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  @Get(':año')
  async getPeliculasPorAño(@Query('año') año: string, @Query('q') q: string ) {
    return this.peliculasService.getPeliculasPorAño(año, q);
  }
}
