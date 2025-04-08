import { createClient, RedisClientType } from "redis";
import { logger } from "./logger.config";

class RedisClient {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    const port = process.env.PORT_REDIS
      ? parseInt(process.env.PORT_REDIS, 10)
      : 17053;

    this.client = createClient({
      username: process.env.REDIS_US || "default",
      password: process.env.REDIS_PW || "*******",
      socket: {
        host: process.env.REDIS_URL || "localhost",
        port,
      },
    });

    this.client.on("error", (err) => {
      logger.error("Redis Client Error:", err);
      this.isConnected = false;
    });

    this.client.on("connect", () => {
      logger.info("Connected to Redis");
      this.isConnected = true;
    });

    this.client.on("end", () => {
      logger.info("Disconnected from Redis");
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  async set(
    key: string,
    value: string,
    ttlInSeconds: number = 3600
  ): Promise<void> {
    try {
      await this.client.setEx(key, ttlInSeconds, value);
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
    }
  }

  isConnectedStatus(): boolean {
    return this.isConnected;
  }
}

export const redisClient = new RedisClient();
