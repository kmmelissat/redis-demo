import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { PeliculasService } from './movies.service';
import { PeliculasController } from './movies.controller';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [HttpModule],
  controllers: [PeliculasController],
  providers: [PeliculasService, RedisService],
})
export class PeliculasModule {}
