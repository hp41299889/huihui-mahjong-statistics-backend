import { Request, Response, NextFunction } from "express";

import { http, loggerFactory } from '@utils';
import { EWind } from "./record.enum";
import { addRecord, getCurrentRoundState, initCurrentRound, recoverCurrentRound, removeLastRecord, setCurrentRoundState, updateCurrentRound } from "@jobs/mahjong/mahjong";
import { IAddRecord } from "@jobs/mahjong/interface";


const { success, fail } = http;
const logger = loggerFactory('Api record');

export const windList = [
    EWind.EAST,
    EWind.SOUTH,
    EWind.WEST,
    EWind.NORTH
];

// POST
export const postOneToCurrentRoound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug('post one record to currentRound');
        const currentRound = await getCurrentRoundState();
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
        await setCurrentRoundState(updatedCurrentRound);
        success(res, addRecordDto);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

// DELETE
export const deleteLastToCurrentRound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug('delete last record to currentRound');
        const currentRound = await getCurrentRoundState();
        const removed = currentRound.records[currentRound.records.length - 1];
        if (removed) {
            const recoveredCurrentRound = await recoverCurrentRound(currentRound, removed);
            const removedCurrentRound = await removeLastRecord(recoveredCurrentRound);
            await setCurrentRoundState(removedCurrentRound);
        } else {
            await initCurrentRound();
        };
        success(res, 'result');
    } catch (err) {
        next(err);
        fail(res, err);
    };
};