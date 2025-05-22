import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EpisodesModule } from './episodes/episodes.module';
import { TopicModule } from './topic/topic.module';
import databaseConfig from '../configs/database.config';
import jwtConfig from '../configs/jwt.config';
import defaultConfig from '../configs/default.config';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [defaultConfig, databaseConfig, jwtConfig],
    }),
    EpisodesModule,
    TopicModule,
  ],
  providers: [AuthService],
})
export class AppModule {}
