import { redisClient } from "@services/redis";
import { roundModel } from "@apis/round";
import { IAddRecord, ICurrentRound, IPlayers, IStatistics, IWindStatistics } from "./interface";
import { addRecord, generateCurrentRound, updateCurrentRound } from "./mahjong";

const STATISTICS = 'statistics';

export const getStatistics = async () => {
    return JSON.parse(await redisClient.get(STATISTICS));
};

export const setStatistics = async (statistics: IStatistics) => {
    redisClient.set(STATISTICS, JSON.stringify(statistics));
};

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
        const { players } = tempRound;
        const updatedStatistics = await updateStatistics(statistics, tempRound);
        await setStatistics(updatedStatistics);
    });
    await Promise.all(roundPromise);
};

export const updateStatistics = async (statistics: IStatistics, tempRound: ICurrentRound) => {
    const { players, records } = tempRound;

    Object.keys(players).forEach(wind => {
        const player = players[wind];
        const { id, name, win, lose, selfDrawn, beSelfDrawn, draw, fake, amount } = player;

        if (!statistics[name]) {
            statistics[name] = {
                id,
                name,
                winds: {}
            };
        }

        statistics[name].winds[wind] = updateOrCreateWindStatistics(statistics[name].winds[wind], records.length, {
            win,
            lose,
            selfDrawn,
            beSelfDrawn,
            draw,
            fake,
            amount
        });
    });

    return statistics;
};

const updateOrCreateWindStatistics = (stats: IWindStatistics | undefined, recordsLength: number, data: Partial<IWindStatistics>): IWindStatistics => {
    if (!stats) {
        return {
            round: 1,
            record: recordsLength,
            win: data.win || 0,
            lose: data.lose || 0,
            selfDrawn: data.selfDrawn || 0,
            beSelfDrawn: data.beSelfDrawn || 0,
            draw: data.draw || 0,
            fake: data.fake || 0,
            amount: data.amount || 0,
        };
    }

    stats.round++;
    stats.record += recordsLength;
    stats.win += data.win || 0;
    stats.lose += data.lose || 0;
    stats.selfDrawn += data.selfDrawn || 0;
    stats.beSelfDrawn += data.beSelfDrawn || 0;
    stats.draw += data.draw || 0;
    stats.fake += data.fake || 0;
    stats.amount += data.amount || 0;

    return stats;
};