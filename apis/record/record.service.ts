import { Request, Response, NextFunction } from "express";

import { http, loggerFactory } from '@utils';
import { EEndType, EWind } from "./record.enum";
import { IPostOne, ICreateOneRecordDto, IRecord } from "./record.interface";
import recordModel from "./record.model";
import { playerModel } from "@apis/player";
import { roundModel, currentRound, updateCurrentRound, IRound } from "@apis/round";

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
        await updateCurrentRound(record);
        await playerCounter(record);
        success(res, record);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

const takeWind = (round: IRound, name: string) => {
    return Object.entries(round).find(([key, value]) => value.name === name)[0];
};

const playerCounter = async (record: IRecord) => {
    if (record.endType === EEndType.WINNING) {
        const winWind = takeWind(record.round, record.winner.name);
        const loseWind = takeWind(record.round, record.losers[0].name);
        currentRound.players[winWind].win++;
        currentRound.players[loseWind].lose++;
        //TODO 計算amount
        if (isDealer(winWind, record)) {
            const point = record.point * currentRound.dealerCount * 2 + 1;
            currentRound.players[winWind].amount += (currentRound.base + point);
        } else {
            currentRound.players[winWind].amount += (currentRound.base + record.point);
        };
        if (isDealer(loseWind, record)) {
            const point = record.point * currentRound.dealerCount * 2 + 1;
            currentRound.players[loseWind].amount -= (currentRound.base + point);
        } else {
            currentRound.players[loseWind].amount -= (currentRound.base + record.point);
        };
    };
    if (record.endType === EEndType.SELF_DRAWN) {
        const winWind = takeWind(record.round, record.winner.name);
        const loseWinds = record.losers.map((loser, index) => {
            return takeWind(record.round, loser.name);
        });
        currentRound.players[winWind].selfDrawn++;
        loseWinds.forEach(wind => {
            currentRound.players[wind].beSelfDrawn++;
        });
    };
    if (record.endType === EEndType.DRAW) {
        currentRound.players['east'].draw++;
        currentRound.players['south'].draw++;
        currentRound.players['west'].draw++;
        currentRound.players['north'].draw++;
    };
};

const isDealer = (wind: string, record: IRecord) => {
    return wind === record.dealer;
};