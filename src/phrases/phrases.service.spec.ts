import { Test, TestingModule } from '@nestjs/testing';
import { PhrasesService } from './phrases.service';
import { CacheService } from '../cache.service';

describe('PhrasesService', () => {
  let service: PhrasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhrasesService, CacheService],
    }).compile();

    service = module.get<PhrasesService>(PhrasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
