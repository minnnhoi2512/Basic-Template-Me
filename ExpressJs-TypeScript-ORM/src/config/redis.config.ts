import { createClient, RedisClientType } from "redis";
import { logger } from "./logger.config";
import {
  connectTimeoutMS,
  defaultRedisPort,
  eachTimeTry,
  maxTimeTry,
  retryTime,
  ttlInSecondsGlobal,
} from "../constants/dbConstants";
class RedisClient {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    const port = process.env.PORT_REDIS
      ? parseInt(process.env.PORT_REDIS, 10)
      : defaultRedisPort;

    // Validate port
    if (isNaN(port)) {
      logger.error("Invalid Redis port specified in PORT_REDIS");
      throw new Error("Invalid Redis port");
    }

    this.client = createClient({
      username: process.env.REDIS_US || "default", // Redis username
      password: process.env.REDIS_PW || "default_pw", // Redis password (loaded from env)
      socket: {
        host: process.env.REDIS_HOST || "localhost", // Redis host
        port, // Redis port
        reconnectStrategy: (retries: number) => {
          if (retries > retryTime) {
            logger.error("Too many Redis reconnection attempts. Giving up.");
            return new Error("Too many retries");
          }
          return Math.min(retries * eachTimeTry, maxTimeTry); // Exponential backoff: 100ms, 200ms, ..., max 3s
        },
        connectTimeout: connectTimeoutMS,
      },
    });

    this.client.on("error", () => {
      //   logger.error("Redis Client Error:", err);
      this.isConnected = false;
    });

    this.client.on("connect", () => {
      //   logger.info("Connected to Redis");
      this.isConnected = true;
    });

    this.client.on("end", () => {
      //   logger.info("Disconnected from Redis");
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
    ttlInSeconds: number = ttlInSecondsGlobal
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
