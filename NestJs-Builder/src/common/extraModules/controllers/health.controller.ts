import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseHealthIndicator } from '../indicators/database.health';
import { MemoryHealthIndicator } from '../indicators/memory.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private db: DatabaseHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      //   Check if the database is healthy
      () => this.db.isHealthy('database'),
      // Check memory usage
      // () => this.memory.checkSystemMemory('memory', 0.9),
      // Ping the API
      () => this.http.pingCheck('api', 'http://localhost:3000'),
    ]);
  }
}
