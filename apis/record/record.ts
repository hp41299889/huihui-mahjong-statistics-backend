import { Request, Response, NextFunction } from "express";
import { join } from 'lodash';

import { success, fail } from "../../utils/http";
import { Record } from "../../databases/entities/index";
import { findAllRecords, saveRecord } from "../../databases/models/record";
import { IRecord } from "./interface";
import { findOneRoundByUid } from "../../databases/models/round";
import { currentRound } from "../round/round";
import { findLastRecordByRound } from "../../databases/models/record";

export {
    createRecord,
    getRecords
};

enum EEndType {
    WINNING = 'winning',
    SELF_DRAWN = 'self-drawn',
    DRAW = 'draw',
    FAKE = 'fake'
};

const createRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roundUid } = req.params;
        const round = await findOneRoundByUid(roundUid);
        if (!round) {
            success(res, 'round not found');
        } else {
            const { winner, loser, dealer, dealerCount, circle, endType, point }: IRecord = req.body;
            const currentRecord = await findLastRecordByRound(currentRound.uid);
            if (currentRecord) {
                if (await isDealerContinue(currentRecord)) {
                    currentRound.dealerCount = currentRecord.dealerCount + 1;
                } else {
                    if (currentRecord.circle === 3) {
                        currentRound.circle = currentRecord.circle + 1;
                        if (currentRound.circle > 3) {
                            currentRound.uid = null;
                        };
                        currentRound.dealer = 0;
                    } else {
                        currentRound.dealer = (+currentRecord.dealer + 1);
                        currentRound.dealerCount = 0;
                    };
                };
            };
            const record = new Record();
            if (loser.length > 1) {
                record.loser = join(loser);
            } else {
                record.loser = loser.toString();
            };
            record.round = round;
            record.winner = winner;
            record.dealer = dealer;
            record.dealerCount = dealerCount;
            record.circle = circle;
            record.endType = endType;
            record.point = point;
            const result = await saveRecord(record);
            console.log(currentRecord);

            success(res, result);
        };
    } catch (err) {
        fail(res, err);
        next(err);
    };
};

const getRecords = async (req: Request, res: Response) => {
    try {
        const result = await findAllRecords();
        success(res, result)
    } catch (err) {
        throw err;
    };
};

export const isDealerContinue = async (record: any) => {
    if (record.winner === record.dealer) {
        return true;
    };
    if (record.endType === EEndType.DRAW) {
        return true;
    };
    if (record.endType === EEndType.FAKE) {
        return true;
    }
    return false;
};