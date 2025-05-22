import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  NotFoundException,
  ValidationPipe,
  // UseGuards,
} from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodeDTO } from './dto/episode.dto';

import { ApiQuery } from '@nestjs/swagger';
import { CommonApiResponses } from 'src/common/decorators/response.decorator';
// import { Guards } from 'src/guards/guards';

// @UseGuards(Guards)
@Controller('episodes')
export class EpisodesController {
  constructor(private episodesService: EpisodesService) {}
  @Get()
  @CommonApiResponses({
    dto: EpisodeDTO,
    dtoName: 'episode',
    summary: 'Get all episodes',
    description: 'Get all episodes description',
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    enum: ['asc', 'desc'],
    required: false,
  })
  getAllEpisodes(@Query('sort') sort: 'asc' | 'desc') {
    return this.episodesService.getAllEpisodesService(sort);
  }
  @Get(':id')
  @CommonApiResponses({
    dto: EpisodeDTO,
    dtoName: 'episode',
    summary: 'Get episode by id',
    description: 'Get episode by id description',
  })
  findOne(@Param('id') id: string) {
    const episode = this.episodesService.getEpisodeByIdService(+id);
    if (!episode) {
      throw new NotFoundException('Episode not found');
    }
    return episode;
  }
  @Post()
  @CommonApiResponses({
    dto: EpisodeDTO,
    dtoName: 'episode',
    summary: 'Create episode',
    description: 'Create episode description',
  })
  createEpisodes(@Body(ValidationPipe) body: EpisodeDTO) {
    return this.episodesService.createEpisodeService(body);
  }
}
