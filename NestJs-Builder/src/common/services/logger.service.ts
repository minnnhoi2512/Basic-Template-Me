import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';
import 'dotenv/config';
import { LogLevel } from '../../shared/types/LogLevel.type';
import { emoji } from 'src/shared/constants/statusCodeColor';
import { colors } from 'src/shared/constants/statusCodeColor';

@Injectable()
export class Logger implements LoggerService {
  private logger: winston.Logger;
  private readonly appName: string;

  constructor() {
    const logDir = path.join(process.cwd(), 'src/logs');
    this.appName = process.env.APP_NAME || 'NestJS-App';

    winston.addColors(colors);

    const format = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.colorize({ all: true }),
      winston.format.printf((info: any) => {
        const message = `${info.timestamp} ${info.level}: ${info.message}`;
        return `${emoji[info.level as LogLevel] || ''} ${message}`;
      }),
    );

    const transports = [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'all.log'),
      }),
    ];

    this.logger = winston.createLogger({
      level: 'debug',
      format,
      transports,
      defaultMeta: { service: this.appName },
    });
  }

  log(message: any, context?: string) {
    this.logger.info(this.formatMessage(message, context));
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(this.formatMessage(message, context));
    // if (trace) {
    //   this.logger.error(`📚 Stack: ${trace}`);
    // }
  }

  warn(message: any, context?: string) {
    this.logger.warn(this.formatMessage(message, context));
  }

  debug(message: any, context?: string) {
    this.logger.debug(this.formatMessage(message, context));
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(this.formatMessage(message, context));
  }

  http(message: any, context?: string) {
    this.logger.http(this.formatMessage(message, context));
  }

  info(message: any, context?: string) {
    this.logger.info(this.formatMessage(message, context));
  }

  private formatMessage(message: any, context?: string): string {
    const formattedMessage =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    return context
      ? `[${this.appName}][${context}] ${formattedMessage}`
      : `[${this.appName}] ${formattedMessage}`;
  }
}
