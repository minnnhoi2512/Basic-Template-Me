import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthCheckError } from '@nestjs/terminus';
import * as os from 'os';

@Injectable()
export class MemoryHealthIndicator extends HealthIndicator {
  async checkHeap(key: string, threshold: number) {
    const used = process.memoryUsage().heapUsed;
    const isHealthy = used < threshold;

    if (isHealthy) {
      return this.getStatus(key, true);
    }

    throw new HealthCheckError(
      'Memory check failed',
      this.getStatus(key, false, { used, threshold }),
    );
  }

  async checkSystemMemory(key: string, thresholdPercent: number = 0.9) {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const usedPercent = used / total;
    const isHealthy = usedPercent < thresholdPercent;

    if (isHealthy) {
      return this.getStatus(key, true);
    }

    throw new HealthCheckError(
      'System memory check failed',
      this.getStatus(key, false, { usedPercent, thresholdPercent }),
    );
  }
} 