import { Injectable } from '@nestjs/common';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { UpdatePhraseDto } from './dto/update-phrase.dto';

@Injectable()
export class PhrasesService {
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
