import { Injectable, NotFoundException } from '@nestjs/common';
import { Episode } from './entity/episode.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EpisodeDTO } from './dto/episode.dto';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
  ) {}

  async createEpisodeService(episode: EpisodeDTO): Promise<EpisodeDTO> {
    const newEpisode = new Episode();
    newEpisode.title = episode.title;
    newEpisode.description = episode.description;
    newEpisode.publishedAt = episode.publishedAt;
    newEpisode.book = episode.book;
    return this.episodeRepository.save(newEpisode);
  }

  async getListEpisodesService(
    page: number,
    limit: number,
  ): Promise<EpisodeDTO[]> {
    const episodes = await this.episodeRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { publishedAt: 'DESC' },
    });
    return episodes.map(episode => new EpisodeDTO(episode));
  }

  async getEpisodeByIdService(id: number): Promise<EpisodeDTO> {
    const episode = await this.episodeRepository.findOne({ where: { id } });
    if (!episode) {
      throw new NotFoundException('Episode not found');
    }
    return episode;
  }

  async updateEpisodeService(id: number, episode: EpisodeDTO): Promise<void> {
    const updatedEpisode = await this.episodeRepository.update(id, episode);
    if (!updatedEpisode) {
      throw new NotFoundException('Episode not found');
    }
  }

  async deleteEpisodeService(id: number): Promise<void> {
    const deletedEpisode = await this.episodeRepository.delete(id);
    if (!deletedEpisode) {
      throw new NotFoundException('Episode not found');
    }
  }
}
