import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LogListService } from '../services/log-list.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/auth.guard';
import { CommonApiResponses } from 'src/shared/decorators/response.decorator';

@ApiTags('Logs')
@Controller('logs')
@UseGuards(JwtAuthGuard)
export class LogListController {
  constructor(private readonly logListService: LogListService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of all log files' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of log files with details',
  })
  @CommonApiResponses({
    dto: LogListService,
    dtoName: 'LogListService',
    summary: 'Get list of all log files',
    description: 'Returns list of log files with details',
    createRequest: false,
  })
  async getLogFiles() {
    return this.logListService.getLogFiles();
  }

  @Get(':filename')
  @ApiOperation({ summary: 'Get content of a specific log file' })
  @ApiParam({ name: 'filename', description: 'Name of the log file' })
  @ApiQuery({
    name: 'lines',
    required: false,
    description: 'Number of lines to return (default: 100)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order: asc or desc (default: desc)',
  })
  @ApiResponse({ status: 200, description: 'Returns log file content' })
  @ApiResponse({ status: 404, description: 'Log file not found' })
  @CommonApiResponses({
    dto: LogListService,
    dtoName: 'LogListService',
    summary: 'Get content of a specific log file',
    description: 'Returns log file content',
    createRequest: true,
  })
  async getLogContent(
    @Param('filename') filename: string,
    @Query('lines') lines?: number,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.logListService.getLogContent(filename, lines, sortOrder);
  }
}
