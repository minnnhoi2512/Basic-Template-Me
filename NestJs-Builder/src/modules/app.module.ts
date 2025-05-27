import { Module } from '@nestjs/common';
import { EpisodesModule } from './episodes/episodes.module';
import { TopicModule } from './topic/topic.module';
import { BooksModule } from './books/books.module';
import { DatabaseModule } from '../common/modules/database.module';
import { ConfigModuleSystem } from '../common/modules/config.module';
import { LoggerModule } from '../common/modules/logger.module';
import { MetricsModule } from '../common/modules/metrics.module';
import { RateLimitModule } from '../common/modules/rate-limit.module';
import { CorsModule } from '../common/modules/cors.module';
import { HealthModule } from '../common/modules/health.module';
import { UserModule } from './user/user.module';
import { AuthModule } from '../common/modules/auth.module';
import { BackgroundModule } from '../common/modules/background.module';
import { RedisModule } from '../common/modules/redis.module';
import { LogListModule } from '../common/modules/log-list.module';

@Module({
  imports: [
    ConfigModuleSystem,
    DatabaseModule,
    RedisModule,
    RateLimitModule,
    EpisodesModule,
    TopicModule,
    BooksModule,
    LoggerModule,
    MetricsModule,
    CorsModule,
    HealthModule,
    UserModule,
    AuthModule,
    BackgroundModule,
    LogListModule,
  ],
})
export class AppModule {}
