import { Request, Response, NextFunction } from "express";

import { http, loggerFactory } from '@utils';
import { EWind } from "./record.enum";
import recordModel from "./record.model";
import { addRecord } from "../../jobs/mahjong/mahjong";
import { IAddRecord } from "../../jobs/mahjong/interface";


const { success, fail } = http;
const logger = loggerFactory('Api record');

export const windList = [
    EWind.EAST,
    EWind.SOUTH,
    EWind.WEST,
    EWind.NORTH
];

export const postOneToCurrentRoound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roundUid } = req.params;
        const { body }: { body: IAddRecord } = req;
        console.log('api', body);
        const { winner, losers, point, endType } = body;
        const addRecordDto: IAddRecord = {
            winner: winner,
            losers: losers,
            point: point,
            endType: endType
        };
        await addRecord(addRecordDto);
        success(res, addRecordDto);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

export const deleteLastToCurrentRoound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roundUid } = req.params;
        const result = await recordModel.deleteLastByRoundUid(roundUid);
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};