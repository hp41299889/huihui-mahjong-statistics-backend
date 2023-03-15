import { Request, Response, NextFunction } from "express";
import { join } from 'lodash';

import { success, fail } from "../../utils/http";
import { Record } from "../../entities";
import { findAllRecords, saveRecord } from "../../models/record";
import { IRecord } from "./interface";
import { findOneRoundByUid } from "../../models/round";

export {
    createRecord,
    getRecords
};

const createRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roundUid } = req.params;
        const round = await findOneRoundByUid(roundUid);
        if (!round) {
            success(res, 'round not found');
        } else {
            const { winner, loser, dealer, dealerCount, circle, endType, point }: IRecord = req.body;
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