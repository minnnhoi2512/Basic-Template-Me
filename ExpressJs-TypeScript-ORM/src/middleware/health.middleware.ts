import { Request, Response } from 'express';
import { redisClient } from '../config/redis.config';
import { connectDB } from '../database/connect';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Check database connection
    const dbStatus = await connectDB();
    
    // Check Redis connection
    const redisStatus = redisClient.isConnectedStatus();
    
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    
    // Check uptime
    const uptime = process.uptime();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus ? 'connected' : 'disconnected',
        redis: redisStatus ? 'connected' : 'disconnected',
      },
      system: {
        memory: {
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        },
        uptime: `${Math.round(uptime)}s`,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}; 