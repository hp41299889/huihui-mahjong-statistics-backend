import { Request, Response, NextFunction } from "express";

import { http, loggerFactory } from '@utils';
import { currentRound, updateCurrentRound } from '@apis/round/round.service';
import { EWind } from "./record.enum";
import { IPostOne, ICreateOneRecordDto } from "./record.interface";
import playerModel from "@apis/player/player.model";
import roundModel from "@apis/round/round.model";
import recordModel from '@apis/record/record.model';

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
        const winner = await playerModel.readOneByName(body.winner);
        const loser = await playerModel.readManyByNames(body.loser);
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
        // await nextDealer(recordDto, takeWind(round, winner.name));
        success(res, record);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};