import { createClient } from "redis";
import { postgresConfig } from "@configs";

export const redisClient = createClient({
    url: `redis://${postgresConfig.host}:6379`
});

export const redisConnect = async () => {
    await redisClient.connect();
};

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (error) => {
    console.error('Redis connection error:', error);
});
