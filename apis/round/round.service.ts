import { Request, Response, NextFunction } from "express";

import http from '@utils/http';
import loggerFactory from "@utils/logger";
import roundModel from "./round.model";
import recordModel from "@apis/record/record.model";
import playerModel from "@apis/player/player.model";
import { EDeskType } from "./round.enum";
import { EWind } from "@apis/record/record.enum";
import { IRecord } from "@apis/record/record.interface";
import { IPlayer } from "@apis/player/player.interface";
import { ICurrentRound, IPostOne, ICreateOneRoundDto } from "./round.interface";
// import { isDealerContinue } from "../record/record";

const logger = loggerFactory('Api round');
const { success, fail } = http;

export const currentRound: ICurrentRound = {
    roundUid: '',
    deskType: EDeskType.AUTO,
    base: 0,
    point: 0,
    players: {
        east: null,
        south: null,
        west: null,
        north: null
    },
    circle: EWind.EAST,
    dealer: EWind.EAST,
    dealerCount: 0,
};



const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body }: { body: IPostOne } = req;
        logger.debug('post one round', body);
        logger.warn(body);
        const east = await playerModel.readOneByName(body.east);
        const south = await playerModel.readOneByName(body.south);
        const west = await playerModel.readOneByName(body.west);
        const north = await playerModel.readOneByName(body.north);
        const dto: ICreateOneRoundDto = {
            ...body,
            east: east,
            south: south,
            west: west,
            north: north
        };
        const result = await roundModel.createOne(dto);
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

const getLast = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const round = await roundModel.readLast();
        const lastRecord = await recordModel.readLastByRoundUid(round.uid);

        // if (currentRound.roundUid) {
        //     success(res, currentRound);
        // } else {
        //     if (isLastRecord(lastRecord, round.north)) {

        //     } else {
        //         success(res, round);
        //     };
        // };
        const result = {
            roundUid: round.uid,
            players: {
                east: round.east,
                south: round.south,
                west: round.west,
                north: round.north
            },
            base: round.base,
            point: round.point,
            deskType: round.deskType
        };
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

const isLastRecord = (record: IRecord, north: IPlayer) => {
    // if (record.circle === EWind.NORTH && record.dealer && record.winner != north) return true;
    return false;
};

export default {
    postOne,
    getLast
};