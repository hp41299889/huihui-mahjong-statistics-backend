import { redisClient } from "../../services/redis";
import { roundModel } from "@apis/round";
import { EEndType, EWind } from "@apis/record";
import { IAddRecord, ICurrentRound, IStatistics } from "./interface";
import { addRecord, generateCurrentRound, updateCurrentRound } from "./mahjong";
import { ERoundStatus } from "@apis/round/round.enum";

const STATISTICS = 'statistics';

export const getStatistics = async () => {
    return JSON.parse(await redisClient.get(STATISTICS));
};

//讀取所有round relation player,record

export const initStatistics = async () => {
    const statistics: IStatistics = {};
    const rounds = await roundModel.readAll();
    const roundPromise = rounds.map(async round => {
        const { east, south, west, north, records } = round;
        let tempRound = generateCurrentRound(round);
        const recordPromise = records.map(async record => {
            const addRecordDto: IAddRecord = {
                circle: tempRound.circle,
                dealer: tempRound.dealer,
                dealerCount: tempRound.dealerCount,
                winner: record.winner ? record.winner.name : '',
                losers: record.losers.length > 0 ? record.losers.map(loser => loser.name ? loser.name : '') : [],
                point: record.point,
                endType: record.endType,
                createdAt: record.createdAt
            };
            const addedCurrentRound = await addRecord(tempRound, addRecordDto);
            tempRound = await updateCurrentRound(addedCurrentRound, addRecordDto);
        });
        await Promise.all(recordPromise);
        console.log(tempRound);

        // statistics[east.name] = {
        //     ...statistics[east.name],
        // win: tempRound.players.east.win
        // };
        // statistics[south.name] = { ...south };
        // statistics[west.name] = { ...west };
        // statistics[north.name] = { ...north };
        // console.log(records);

        await setStatistics(statistics);
    });
    await Promise.all(roundPromise);
    console.log(await getStatistics());
};

const setStatistics = async (statistics: IStatistics) => {
    redisClient.set(STATISTICS, JSON.stringify(statistics));
};