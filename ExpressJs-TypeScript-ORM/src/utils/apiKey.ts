import crypto from "crypto";
import { apiKeyExpiredTime } from "../constants/redisCacheTime";
import { redisClient } from "../config/redis.config";
import { v4 as uuidv4 } from "uuid";

export const generateApiKey = () => {
  return crypto.randomBytes(32).toString("hex"); // 64-char hex string
};

export const uuIDv4 = () => {
    return uuidv4(); // Generate a UUID
  };
export const storeApiKey = async (apiKey: string, userId: string) => {
  await redisClient.set(`api_key:${apiKey}`, `${userId}-${apiKey}`, apiKeyExpiredTime);    
};
