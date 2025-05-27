import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LogListService {
  private readonly logger = new Logger(LogListService.name);
  private readonly logsDirectory = path.join(process.cwd(), 'logs');

  constructor() {
    this.ensureLogsDirectory();
  }

  private ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDirectory)) {
      fs.mkdirSync(this.logsDirectory, { recursive: true });
    }
  }

  async getLogFiles() {
    try {
      const files = await fs.promises.readdir(this.logsDirectory);
      console.log(this.logsDirectory);
      const logFiles = files.filter(file => file.endsWith('.log'));

      const fileDetails = await Promise.all(
        logFiles.map(async file => {
          const filePath = path.join(this.logsDirectory, file);
          const stats = await fs.promises.stat(filePath);
          return {
            name: file,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
          };
        }),
      );

      return fileDetails;
    } catch (error) {
      this.logger.error(`Error reading log files: ${error.message}`);
      throw error;
    }
  }

  async getLogContent(
    filename: string,
    lines: number = 100,
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const filePath = path.join(this.logsDirectory, filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error('Log file not found');
      }

      // Read the file content
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const linesArray = content.split('\n').filter(line => line.trim());

      // Get the last N lines
      const lastLines = linesArray.slice(-lines);

      // Sort lines based on sortOrder
      const sortedLines =
        sortOrder === 'desc' ? lastLines.reverse() : lastLines;

      return {
        filename,
        content: sortedLines,
        totalLines: linesArray.length,
        sortOrder,
      };
    } catch (error) {
      this.logger.error(`Error reading log file ${filename}: ${error.message}`);
      throw error;
    }
  }
}
