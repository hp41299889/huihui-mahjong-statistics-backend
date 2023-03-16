import { Request, Response, NextFunction } from "express";

import { Round } from "../../entities";
import { success, fail } from "../../utils/http";
import { IRound } from "./interface";
import { findPlayerById } from "../../models/player";
import { findLastRound, saveRound } from "../../models/round";

export {
    createRound,
    getLastRound
};

const createRound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { deskType, base, point, eastId, southId, westId, northId }: IRound = req.body;
        const round = new Round();
        const east = await findPlayerById(eastId);
        const south = await findPlayerById(southId);
        const west = await findPlayerById(westId);
        const north = await findPlayerById(northId);
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
        throw err;
    };
};

const getLastRound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await findLastRound();
        const response = {
            uid: result.uid,
            player: [
                result.east,
                result.south,
                result.west,
                result.north
            ]
        };
        success(res, response);
    } catch (err) {
        throw err;
    };
};