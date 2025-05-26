import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseHealthIndicator } from '../indicators/database.health';
// import { MemoryHealthIndicator } from '../indicators/memory.health';
import { RedisHealthIndicator } from '../indicators/redis.health';
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    // private memory: MemoryHealthIndicator,
    private db: DatabaseHealthIndicator,
    private redis: RedisHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    try {
      const healthCheck = await this.health.check([
        //   Check if the database is healthy
        () => this.db.isHealthy('database'),
        // Check memory usage
        // () => this.memory.checkSystemMemory('memory', 0.9),
        // Ping the API
        // check Redis
        () => this.redis.isHealthy('redis'),
        // check Http
        () =>
          this.http.pingCheck(
            'api',
            process.env?.API_URL || 'http://localhost:3000',
          ),
      ]);

      return {
        statusCode: HttpStatus.OK,
        status: 'ok',
        details: healthCheck,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.OK,
        status: 'error',
        details: error.response || error.message,
      };
    }
  }
}
