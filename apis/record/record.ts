import { Request, Response, NextFunction } from "express";

import { success, fail } from "../../utils/http";
import { Record } from "../../entities";
import { findPlayerById, findPlayerByName } from "../../models/player";
import { saveRecord } from "../../models/record";

export {
    createRecord,
    getRecords
};

const createRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { playerName } = req.params;
        const player = await findPlayerByName(playerName);
        if (!player) {
            success(res, 'player not found');
        } else {
            const record = new Record();
            const { win, lose, drawn, position, amount } = req.body;
            record.player = player;
            record.win = win;
            record.lose = lose;
            record.drawn = drawn;
            record.position = position;
            record.amount = amount;
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

    } catch (err) {

    };
};