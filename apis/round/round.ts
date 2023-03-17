import { Request, Response, NextFunction } from "express";

import { Round } from "../../entities";
import { success, fail } from "../../utils/http";
import { IRound } from "./interface";
import { findPlayerById, findPlayerByName } from "../../models/player";
import { findLastRound, saveRound } from "../../models/round";
import { findLastRecordByRound } from "../../models/record";

export {
    createRound,
    getLastRound
};

const createRound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { deskType, base, point, eastName, southName, westName, northName }: IRound = req.body;
        const round = new Round();
        const east = await findPlayerByName(eastName);
        const south = await findPlayerByName(southName);
        const west = await findPlayerByName(westName);
        const north = await findPlayerByName(northName);
        round.deskType = deskType;
        round.base = base;
        round.point = point;
        round.east = east;
        round.south = south;
        round.west = west;
        round.north = north;
        const result = await saveRound(round);
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

const getLastRound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const round = await findLastRound();
        const record = await findLastRecordByRound();
        const result = {
            uid: round.uid,
            player: [
                round.east.name,
                round.south.name,
                round.west.name,
                round.north.name
            ],
            circle: record.circle,
            wind: record.dealer
        };
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};