import { redisClient } from "../../services/redis";

const STATISTICS = 'statistics';

export const getStatistics = async () => {
    return JSON.parse(await redisClient.get(STATISTICS));
};

export const initStatistics = async () => {

};