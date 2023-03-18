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

const currentRound = {
    uid: '',
    players: ['', '', '', ''],
    circle: '',
    dealer: '',
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
        if (currentRound.uid) {
            console.log('yes');
            const record = await findLastRecordByRound(currentRound.uid);
            //isDealerContinue
        } else {
            const round = await findLastRound();
            console.log('no');
            currentRound.uid = round.uid;
            currentRound.players = [
                round.east.name,
                round.south.name,
                round.west.name,
                round.north.name
            ];
            currentRound.circle = 'east';
            currentRound.dealer = 'east';
            currentRound.dealerCount = 0;
        };
        // const result = {
        //     uid: round.uid,
        //     player: [
        //         round.east.name,
        //         round.south.name,
        //         round.west.name,
        //         round.north.name
        //     ],
        //     circle: record ? record.circle : 'east',
        //     wind: record ? record.dealer : 'east'
        // };
        success(res, currentRound);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};