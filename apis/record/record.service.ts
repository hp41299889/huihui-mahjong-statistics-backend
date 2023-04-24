import { Request, Response, NextFunction } from "express";

import { http, loggerFactory } from '@utils';
import { EEndType, EWind } from "./record.enum";
import { IPostOne, ICreateOneRecordDto, IRecord } from "./record.interface";
import recordModel from "./record.model";
import { playerModel } from "@apis/player";
import { roundModel, currentRound, updateCurrentRound, IRound } from "@apis/round";
import { resetCurrentRound } from "@apis/round/round.service";

const { success, fail } = http;
const logger = loggerFactory('Api record');

export const windList = [
    EWind.EAST,
    EWind.SOUTH,
    EWind.WEST,
    EWind.NORTH
];

export const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roundUid } = req.params;
        const { body }: { body: IPostOne } = req;
        const round = await roundModel.readOneByUid(roundUid);
        const winner = body.winner ? await playerModel.readOneByName(body.winner) : null;
        const loser = body.loser.length > 0 ? await playerModel.readManyByNames(body.loser) : null;
        const recordDto: ICreateOneRecordDto = {
            round: round,
            endType: body.endType,
            point: body.point,
            winner: winner,
            losers: loser,
            circle: currentRound.circle,
            dealer: currentRound.dealer,
            dealerCount: currentRound.dealerCount,
        };
        const record = await recordModel.createOne(recordDto);
        currentRound.records++;
        await playerCounter(record);
        await updateCurrentRound(record);
        success(res, record);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

export const deleteLastRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roundUid } = req.params;
        const result = await recordModel.deleteLastByRoundUid(roundUid);
        await resetCurrentRound();
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

const takeWind = (round: IRound, name: string) => {
    return Object.entries(round).find(([key, value]) => value.name === name)[0];
};

const playerCounter = async (record: IRecord) => {
    console.log('***************', record.point);

    if (record.endType === EEndType.WINNING) {
        const winWind = takeWind(record.round, record.winner.name);
        const loseWind = takeWind(record.round, record.losers[0].name);
        currentRound.players[winWind].win++;
        currentRound.players[loseWind].lose++;
        calculateWinAmount(winWind, record);
        calculateLoseAmount(loseWind, record);
    };
    if (record.endType === EEndType.SELF_DRAWN) {
        const winWind = takeWind(record.round, record.winner.name);
        const loseWinds = record.losers.map((loser, index) => {
            return takeWind(record.round, loser.name);
        });
        currentRound.players[winWind].selfDrawn++;
        calculateWinAmount(winWind, record);
        loseWinds.forEach(wind => {
            currentRound.players[wind].beSelfDrawn++;
            calculateLoseAmount(wind, record);
        });
    };
    if (record.endType === EEndType.DRAW) {
        currentRound.draws++;
        currentRound.players['east'].draw++;
        currentRound.players['south'].draw++;
        currentRound.players['west'].draw++;
        currentRound.players['north'].draw++;
    };
};

const isDealer = (winWind: string, loseWind: string, record: IRecord) => {
    return winWind === record.dealer || loseWind === record.dealer;
};

const calculateWinAmount = (winWind: string, record: IRecord) => {
    if (isDealer(winWind, '', record)) {
        // console.log(' record.point', record.point);
        // console.log(' currentRound.dealerCount', currentRound.dealerCount);

        const points = record.point + currentRound.dealerCount * 2 + 1;
        // console.log('******winning');
        // console.log('currentRound.base', currentRound.base);
        // console.log('currentRound.point', currentRound.point);
        // console.log('points', points);


        // console.log(currentRound.base + currentRound.point * points);

        currentRound.players[winWind].amount += (currentRound.base + currentRound.point * points);
    } else {
        currentRound.players[winWind].amount += (currentRound.base + currentRound.point * record.point);
    };
};

const calculateLoseAmount = (loseWind: string, record: IRecord) => {
    if (isDealer('', loseWind, record)) {
        const point = record.point + currentRound.dealerCount * 2 + 1;
        currentRound.players[loseWind].amount -= (currentRound.base + currentRound.point * point);
    } else {
        currentRound.players[loseWind].amount -= (currentRound.base + currentRound.point * record.point);
    };
};