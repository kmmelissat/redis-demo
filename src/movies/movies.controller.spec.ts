import { Test, TestingModule } from '@nestjs/testing';
import { PeliculasController } from './movies.controller';
import {PeliculasService } from './movies.service';

describe('MoviesController', () => {
  let controller: PeliculasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeliculasController],
      providers: [PeliculasService],
    }).compile();

    controller = module.get<PeliculasController>(PeliculasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
