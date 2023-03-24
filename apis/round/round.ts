import { Request, Response, NextFunction } from "express";

import { success, fail } from '@http';
import { IRound } from "./interface";
import { Round } from '@postgres/entities';
import { playerModel, recordModel, roundModel } from '@postgres/models';
import { isDealerContinue } from "../record/record";

export const currentRound = {
    uid: '',
    players: ['', '', '', ''],
    circle: 0,
    dealer: 0,
    dealerCount: 0,
};

const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { deskType, base, point, eastName, southName, westName, northName }: IRound = req.body;
        const round = new Round();
        const east = await playerModel.readOneByName(eastName);
        const south = await playerModel.readOneByName(southName);
        const west = await playerModel.readOneByName(westName);
        const north = await playerModel.readOneByName(northName);
        round.deskType = deskType;
        round.base = base;
        round.point = point;
        round.east = east;
        round.south = south;
        round.west = west;
        round.north = north;
        const result = await roundModel.createOne(round);
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

const getLast = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const round = await roundModel.readLast();
        if (currentRound.uid) {
            console.log('yes');
            const currentRecord = await recordModel.readLastByRoundUid(currentRound.uid);
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

export default {
    postOne,
    getLast
};