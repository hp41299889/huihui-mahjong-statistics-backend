import { Request, Response, NextFunction } from "express";

import { http, loggerFactory } from '@utils';
import { EWind } from "./record.enum";
import { addRecord, getCurrentRound, initCurrentRound, recoverCurrentRound, removeLastRecord, setCurrentRound, updateCurrentRound } from "@jobs/mahjong/mahjong";
import { IAddRecord } from "@jobs/mahjong/interface";


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
        const currentRound = await getCurrentRound();
        const { body }: { body: IAddRecord } = req;
        const { winner, losers, point, endType } = body;
        const { circle, dealer, dealerCount } = currentRound;
        const addRecordDto: IAddRecord = {
            circle: circle,
            dealer: dealer,
            dealerCount: dealerCount,
            winner: winner,
            losers: losers,
            point: point,
            endType: endType,
            createdAt: new Date()
        };
        const addedCurrentRound = await addRecord(currentRound, addRecordDto);
        const updatedCurrentRound = await updateCurrentRound(addedCurrentRound, addRecordDto);
        await setCurrentRound(updatedCurrentRound);
        success(res, addRecordDto);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

export const deleteLastToCurrentRound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roundUid } = req.params;
        // const result = await recordModel.deleteLastByRoundUid(roundUid);
        const currentRound = await getCurrentRound();
        const removed = currentRound.records[currentRound.records.length - 1];
        if (removed) {
            const recoveredCurrentRound = await recoverCurrentRound(currentRound, removed);
            const removedCurrentRound = await removeLastRecord(recoveredCurrentRound);
            await setCurrentRound(removedCurrentRound);
        } else {
            await initCurrentRound();
        };
        success(res, 'result');
    } catch (err) {
        next(err);
        fail(res, err);
    };
};