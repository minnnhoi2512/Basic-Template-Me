import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicDTO } from './dto/topic.dto';
import { CommonApiResponses } from 'src/common/decorators/response.decorator';
import { CreateTopicDTO } from './dto/create-topic.dto';
import { JwtAuthGuard } from 'src/common/extraModules/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
@Controller('topic')
@UseGuards(JwtAuthGuard)
export class TopicController {
  constructor(private topicService: TopicService) {}

  @CommonApiResponses({
    dto: CreateTopicDTO,
    dtoName: 'topic',
    summary: 'Create a new topic',
    description: 'Create a new topic description',
    createRequest: true,
  })
  @Post()
  createTopicController(@Body() topic: CreateTopicDTO) {
    return this.topicService.createTopicService(topic);
  }

  @Get()
  @CommonApiResponses({
    dto: TopicDTO,
    dtoName: 'topic',
    summary: 'Get all topics',
    description: 'Get all topics description',
    createRequest: false,
  })
  getListTopicsController(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.topicService.getListTopicsService(page, limit);
  }

  @Get(':id')
  @CommonApiResponses({
    dto: TopicDTO,
    dtoName: 'topic',
    summary: 'Get topic by id',
    description: 'Get topic by id description',
    createRequest: false,
  })
  getTopicByIdController(@Param('id') id: number) {
    return this.topicService.getTopicByIdService(id, 'get');
  }

  @Put(':id')
  @CommonApiResponses({
    dto: TopicDTO,
    dtoName: 'topic',
    summary: 'Update topic by id',
    description: 'Update topic by id description',
    createRequest: false,
  })
  updateTopicController(@Param('id') id: number, @Body() topic: TopicDTO) {
    return this.topicService.updateTopicService(id, topic);
  }

  @Delete(':id')
  @CommonApiResponses({
    dto: TopicDTO,
    dtoName: 'topic',
    summary: 'Delete topic by id',
    description: 'Delete topic by id description',
    createRequest: false,
  })
  deleteTopicController(@Param('id') id: number) {
    return this.topicService.deleteTopicService(id);
  }
}
