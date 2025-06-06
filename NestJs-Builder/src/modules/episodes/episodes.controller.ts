import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodeDTO } from './dto/episode.dto';
import { CommonApiResponses } from 'src/shared/decorators/response.decorator';
import { CreateEpisodeDTO } from './dto/create-episode.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
@Controller('episodes')
@UseGuards(JwtAuthGuard)
export class EpisodesController {
  constructor(private episodesService: EpisodesService) {}

  @Get()
  @CommonApiResponses({
    dto: EpisodeDTO,
    dtoName: 'episode',
    summary: 'Get list episodes',
    description: 'Get list episodes description',
    createRequest: false,
  })
  getListEpisodesController(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.episodesService.getListEpisodesService(page, limit);
  }
  @Get(':id')
  @CommonApiResponses({
    dto: EpisodeDTO,
    dtoName: 'episode',
    summary: 'Get episode by id',
    description: 'Get episode by id description',
    createRequest: false,
  })
  getEpisodeByIdController(@Param('id') id: string) {
    return this.episodesService.getEpisodeByIdService(+id);
  }
  @Post()
  @CommonApiResponses({
    dto: CreateEpisodeDTO,
    dtoName: 'episode',
    summary: 'Create episode',
    description: 'Create episode description',
    createRequest: true,
  })
  createEpisodeController(@Body() body: CreateEpisodeDTO) {
    return this.episodesService.createEpisodeService(body);
  }
  @Put(':id')
  @CommonApiResponses({
    dto: EpisodeDTO,
    dtoName: 'episode',
    summary: 'Update episode',
    description: 'Update episode description',
    createRequest: false,
  })
  updateEpisodeController(@Param('id') id: string, @Body() body: EpisodeDTO) {
    return this.episodesService.updateEpisodeService(+id, body);
  }
  @Delete(':id')
  @CommonApiResponses({
    dto: EpisodeDTO,
    dtoName: 'episode',
    summary: 'Delete episode',
    description: 'Delete episode description',
    createRequest: false,
  })
  deleteEpisodeController(@Param('id') id: string) {
    return this.episodesService.deleteEpisodeService(+id);
  }
}
