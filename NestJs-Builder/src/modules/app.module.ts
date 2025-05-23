import { Module } from '@nestjs/common';
import { EpisodesModule } from './episodes/episodes.module';
import { TopicModule } from './topic/topic.module';
import { BooksModule } from './books/books.module';
import { DatabaseModule } from '../common/extraModules/modules/database.module';
import { ConfigModuleSystem } from '../common/extraModules/modules/config.module';
import { LoggerModule } from '../common/extraModules/modules/logger.module';
import { MetricsModule } from '../common/extraModules/modules/metrics.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => [
        {
          ttl: 0, // Time window in seconds
          limit: 0, // Max requests per window
        },
      ],
    }),
    ConfigModuleSystem,
    DatabaseModule,
    EpisodesModule,
    TopicModule,
    BooksModule,
    LoggerModule,
    MetricsModule,
  ],
})
export class AppModule {}
