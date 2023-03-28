import { Request, Response, NextFunction } from "express";

import http from '@utils/http';
import loggerFactory from "@utils/logger";
import { ICurrentRound } from "./interface";
import { EDeskType, EWind, IPlayer, IRecord, Round } from '@postgres/entities';
import { playerModel, recordModel, roundModel, ICreateOneRoundDto } from '@postgres/models';
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

interface IPostOne {
    deskType: EDeskType;
    base: number;
    point: number;
    east: string;
    south: string;
    west: string;
    north: string;
}

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

        if (currentRound.roundUid) {

        } else {
            if (isLastRecord(lastRecord, round.north)) {

            } else {

            };
        };
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
        // if (currentRound.uid) {
        //     console.log('yes');
        //     const currentRecord = await recordModel.readLastByRoundUid(currentRound.uid);
        //     if (currentRecord) {
        // if (await isDealerContinue(currentRecord)) {
        //     currentRound.dealerCount = currentRecord.dealerCount + 1;
        // } else {
        //     if (currentRecord.circle === 3) {
        //         currentRound.circle = currentRecord.circle + 1;
        //         if (currentRound.circle > 3) {
        //             currentRound.uid = null;
        //         };
        //         currentRound.dealer = 0;
        //     } else {
        //         currentRound.dealer = (+currentRecord.dealer + 1);
        //         currentRound.dealerCount = 0;
        //     };
        // };
        // };
        // } else {
        //     console.log('no');
        //     currentRound.uid = round.uid;
        //     currentRound.players = [
        //         round.east.name,
        //         round.south.name,
        //         round.west.name,
        //         round.north.name
        //     ];
        //     currentRound.circle = 0;
        //     currentRound.dealer = 0;
        //     currentRound.dealerCount = 0;
        // };
        // console.log(currentRound);
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

const isLastRecord = (record: IRecord, north: IPlayer) => {
    if (record.circle === EWind.NORTH && record.dealer && record.winner != north) return true;
    return false;
};

export default {
    postOne,
    getLast
};