import { Request, Response, NextFunction } from "express";

import { Round } from "../../entities";
import { success, fail } from "../../utils/http";
import { IRound } from "./interface";
import { findPlayerById, findPlayerByName } from "../../models/player";
import { findLastRound, saveRound } from "../../models/round";
import { findLastRecordByRound } from "../../models/record";
import { isDealerContinue } from "../record/record";

export {
    createRound,
    getLastRound
};

export const currentRound = {
    uid: '',
    players: ['', '', '', ''],
    circle: 0,
    dealer: 0,
    dealerCount: 0,
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
        if (currentRound.uid) {
            console.log('yes');
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
        } else {
            console.log('no');
            currentRound.uid = round.uid;
            currentRound.players = [
                round.east.name,
                round.south.name,
                round.west.name,
                round.north.name
            ];
            currentRound.circle = 0;
            currentRound.dealer = 0;
            currentRound.dealerCount = 0;
        };
        console.log(currentRound);
        success(res, currentRound);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

