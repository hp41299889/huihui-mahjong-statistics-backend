import { redisClient } from "@services/redis";
import { roundModel } from "@apis/round";
import { IAddRecord, ICurrentRound, IPlayers, IStatistics } from "./interface";
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
    const statisticsPromise = Object.keys(players).map(wind => {
        const { id, name, win, lose, selfDrawn, beSelfDrawn, draw, fake, amount } = players[wind];
        if (!statistics[name]) {
            statistics[name] = {
                id: id,
                name: name,
                winds: {}
            };
            statistics[name].winds[wind] = {
                round: 1,
                record: records.length,
                win: win,
                lose: lose,
                selfDrawn: selfDrawn,
                draw: draw,
                beSelfDrawn: beSelfDrawn,
                fake: fake,
                amount: amount
            };
        } else {
            if (statistics[name].winds[wind]) {
                statistics[name].winds[wind].round++;
                statistics[name].winds[wind].record += records.length;
                statistics[name].winds[wind].win += win;
                statistics[name].winds[wind].lose += lose;
                statistics[name].winds[wind].selfDrawn += selfDrawn;
                statistics[name].winds[wind].beSelfDrawn += beSelfDrawn;
                statistics[name].winds[wind].draw += draw;
                statistics[name].winds[wind].fake += fake;
                statistics[name].winds[wind].amount += amount;
            } else {
                statistics[name].winds[wind].round = 1;
                statistics[name].winds[wind].record = records.length;
                statistics[name].winds[wind].win = win;
                statistics[name].winds[wind].lose = lose;
                statistics[name].winds[wind].selfDrawn = selfDrawn;
                statistics[name].winds[wind].beSelfDrawn = beSelfDrawn;
                statistics[name].winds[wind].draw = draw;
                statistics[name].winds[wind].fake = fake;
                statistics[name].winds[wind].amount = amount;
            };
        };
    });
    await Promise.all(statisticsPromise);
    return statistics;
};