import { Injectable } from '@nestjs/common';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { UpdatePhraseDto } from './dto/update-phrase.dto';
import { CacheService } from '../cache.service';

@Injectable()
export class PhrasesService {
  constructor(private cacheService: CacheService) {}

  private motivationalPhrases = [
    'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
    'La motivación nos impulsa a comenzar y el hábito nos permite continuar.',
    'No cuentes los días, haz que los días cuenten.',
    'Cree en ti y todo será posible.',
    'La disciplina es el puente entre metas y logros.'
  ];

  async getMotivationalPhrases(): Promise<string[]> {
    const cacheKey = 'motivational_phrases';
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }
    // Simula llamada costosa
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await this.cacheService.set(cacheKey, this.motivationalPhrases, 15);
    return this.motivationalPhrases;
  }

  create(createPhraseDto: CreatePhraseDto) {
    return 'This action adds a new phrase';
  }

  findAll() {
    return `This action returns all phrases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} phrase`;
  }

  update(id: number, updatePhraseDto: UpdatePhraseDto) {
    return `This action updates a #${id} phrase`;
  }

  remove(id: number) {
    return `This action removes a #${id} phrase`;
  }
}
