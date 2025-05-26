import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthCheckError } from '@nestjs/terminus';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    super();
  }

  async isHealthy(key: string) {
    try {
      const testKey = 'health-check';
      const testValue = 'ok';

      // Set the test value
      await this.cacheManager.set(testKey, testValue);

      // Get the value back
      const result = await this.cacheManager.get<string>(testKey);

      // Clean up
      await this.cacheManager.del(testKey);

      if (result !== testValue) {
        throw new Error(
          `Redis health check failed: value mismatch. Expected: ${testValue}, Got: ${result}`,
        );
      }

      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'Redis check failed',
        this.getStatus(key, false, {
          error: error instanceof Error ? error.message : 'Unknown error',
          details: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
        }),
      );
    }
  }
}
