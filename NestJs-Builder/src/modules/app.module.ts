import { Module } from '@nestjs/common';
import { EpisodesModule } from './episodes/episodes.module';
import { TopicModule } from './topic/topic.module';
import { AuthService } from '../auth/auth.service';
import { BooksModule } from './books/books.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModuleSystem } from './config/configSystem.module';

@Module({
  imports: [
    ConfigModuleSystem,
    DatabaseModule,
    EpisodesModule,
    TopicModule,
    BooksModule,
  ],
  providers: [AuthService],
})
export class AppModule {}
