import { Controller, Get, Param } from '@nestjs/common';
import { PeliculasService } from './movies.service';


@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  @Get(':año')
  async getPeliculasPorAño(@Param('año') año: string) {
    return await this.peliculasService.getPeliculasPorAño(año);
  }
}
