import { redisClient } from "../../services/redis";
import { roundModel } from "@apis/round";
import { EEndType, EWind } from "@apis/record";
import { IAddRecord, ICurrentRound, IStatistics } from "./interface";
import { addRecord, updateCurrentRound } from "./mahjong";

const STATISTICS = 'statistics';

export const getStatistics = async () => {
    return JSON.parse(await redisClient.get(STATISTICS));
};

//讀取所有round relation player,record

export const initStatistics = async () => {
    const statistics: IStatistics = {};
    const rounds = await roundModel.readAll();
    const rp = rounds.map(async round => {
        const { east, south, west, north } = round;
        statistics[east.name] = { ...east };
        statistics[south.name] = { ...south };
        statistics[west.name] = { ...west };
        statistics[north.name] = { ...north };
        statistics[east.name].amount = 888;
        await setStatistics(statistics);
    });
    await Promise.all(rp);
    console.log(await getStatistics());
};

const setStatistics = async (statistics: IStatistics) => {
    redisClient.set(STATISTICS, JSON.stringify(statistics));
};