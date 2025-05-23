import { Injectable, NotFoundException } from '@nestjs/common';
import { Topic } from './entity/topic.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicDTO } from './dto/topic.dto';
import { CreateTopicDTO } from './dto/create-topic.dto';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
  ) {}

  async createTopicService(topic: CreateTopicDTO): Promise<CreateTopicDTO> {
    const newTopic = new Topic();
    newTopic.name = topic.name;
    newTopic.description = topic.description;
    return this.topicRepository.save(newTopic);
  }

  async getListTopicsService(page: number, limit: number): Promise<TopicDTO[]> {
    const topics = await this.topicRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return topics.map(topic => new TopicDTO(topic));
  }

  async getTopicByIdService(
    id: number,
    type: 'create' | 'get',
  ): Promise<TopicDTO | CreateTopicDTO> {
    const whereCondition =
      type === 'create' ? { id } : { id, relations: ['books'] };
    const topic = await this.topicRepository.findOne({
      where: whereCondition,
    });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
    return topic;
  }

  async updateTopicService(id: number, topic: TopicDTO): Promise<void> {
    const updatedTopic = await this.topicRepository.update(id, topic);
    if (!updatedTopic) {
      throw new NotFoundException('Topic not found');
    }
  }

  async deleteTopicService(id: number): Promise<void> {
    const deletedTopic = await this.topicRepository.delete(id);
    if (!deletedTopic) {
      throw new NotFoundException('Topic not found');
    }
  }
}
