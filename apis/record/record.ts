import { Request, Response, NextFunction } from "express";
import { Record } from "../../entities";

import { findPlayerById, findPlayerByName } from "../../models/player";
import { saveRecord } from "../../models/record";

export {
    createRecord,
    getRecords
};

const createRecord = async (req: Request, res: Response) => {
    const { playerName } = req.params;
    const player = await findPlayerByName(playerName);
    if (!player) {
        res.json('player not found');
    } else {
        const record = new Record();
        const { win, lose, drawn, position, amount } = req.body;
        record.player = player;
        record.win = win;
        record.lose = lose;
        record.drawn = drawn;
        record.position = position;
        record.amount = amount;
        await saveRecord(record);
        res.json(record);
    };
};

const getRecords = async (req: Request, res: Response) => {

};