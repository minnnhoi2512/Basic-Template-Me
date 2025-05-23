import { Module } from '@nestjs/common';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { Episode } from './entity/episode.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../books/entity/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Episode, Book])],
  controllers: [EpisodesController],
  providers: [EpisodesService],
  exports: [EpisodesService],
})
export class EpisodesModule {}
