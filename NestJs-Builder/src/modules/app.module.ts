import { Module } from '@nestjs/common';
import { EpisodesModule } from './episodes/episodes.module';
import { TopicModule } from './topic/topic.module';
import { BooksModule } from './books/books.module';
import { DatabaseModule } from '../common/extraModules/modules/database.module';
import { ConfigModuleSystem } from '../common/extraModules/modules/config.module';
import { LoggerModule } from '../common/extraModules/modules/logger.module';
import { MetricsModule } from '../common/extraModules/modules/metrics.module';
import { RateLimitModule } from '../common/extraModules/modules/rate-limit.module';
import { CorsModule } from '../common/extraModules/modules/cors.module';
import { HealthModule } from '../common/extraModules/modules/health.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    RateLimitModule,
    ConfigModuleSystem,
    DatabaseModule,
    EpisodesModule,
    TopicModule,
    BooksModule,
    LoggerModule,
    MetricsModule,
    CorsModule,
    HealthModule,
    UserModule,
  ],
})
export class AppModule {}
