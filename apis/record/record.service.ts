import { Request, Response, NextFunction } from "express";

import { http, loggerFactory } from '@utils';
import { EEndType, EWind } from "./record.enum";
import { IPostOne, ICreateOneRecordDto, IRecord } from "./record.interface";
import recordModel from "./record.model";
import { IPlayer, playerModel } from "@apis/player";
import { roundModel, IRound } from "@apis/round";
import { IAddRecordDto, ICurrentRound, addRecord, getCurrentRound, updateCurrentRound } from "jobs/mahjong";


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
        const { winner, loser, point, endType } = body;
        const currentRound = await getCurrentRound();
        const addRecordDto: IAddRecordDto = {
            winner: winner,
            losers: loser,
            point: point,
            endType: endType
        };
        await addRecord(currentRound, addRecordDto);
        success(res, addRecordDto);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

export const deleteLastRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roundUid } = req.params;
        const result = await recordModel.deleteLastByRoundUid(roundUid);
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};