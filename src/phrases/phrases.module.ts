import { Module } from '@nestjs/common';
import { PhrasesService } from './phrases.service';
import { PhrasesController } from './phrases.controller';
import { CacheService } from '../cache.service';

@Module({
  controllers: [PhrasesController],
  providers: [PhrasesService, CacheService],
})
export class PhrasesModule {}
