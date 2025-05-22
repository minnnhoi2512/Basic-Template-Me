import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { Episode } from './entity/episode.entity';
import { EpisodeDTO } from './dto/episode.dto';

@Injectable()
export class EpisodesService {
  private episodes: Episode[] = [];

  createEpisodeService(episode: EpisodeDTO): EpisodeDTO {
    const newEpisode = new Episode();
    newEpisode.id = this.episodes.length + 1;
    newEpisode.title = episode.title;
    newEpisode.description = episode.description;
    newEpisode.publishedAt = episode.publishedAt;
    this.episodes.push(newEpisode);
    return newEpisode;
  }
  getAllEpisodesService(sort: 'asc' | 'desc'): Episode[] {
    if (sort === 'asc') {
      this.episodes.sort((a: Episode, b: Episode) => a.id - b.id);
    } else {
      this.episodes.sort((a: Episode, b: Episode) => b.id - a.id);
    }
    return this.episodes;
  }
  getEpisodeByIdService(id: number): Episode {
    const episode = this.episodes.find((episode: Episode) => episode.id === id);
    if (!episode) {
      throw new NotFoundException('Episode not found', {
        cause: HttpStatus.NOT_FOUND,
        description: 'Episode not found',
      });
    }
    return episode;
  }
}
