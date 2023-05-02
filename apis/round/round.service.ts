import { Request, Response, NextFunction } from "express";

import { http, loggerFactory } from '@utils';
import { EDeskType } from "./round.enum";
import roundModel from "./round.model";
import { ICurrentRound, IPostOne, ICreateOneRoundDto, IRound } from "./round.interface";
import { IRecord, windList, EEndType, EWind } from '@apis/record';
import { playerModel, IPlayer } from "@apis/player";
import { IUpdateOnePlayerDto } from "@apis/player/player.interface";
import { getCurrentRound, initCurrentRound, resetCurrentRound, saveRecords } from "../../jobs/mahjong/mahjong";

const logger = loggerFactory('Api round');
const { success, fail } = http;

export const postOne = async (req: Request, res: Response, next: NextFunction) => {
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
        await initCurrentRound();
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

export const getLatest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentRound = await getCurrentRound();
        success(res, currentRound);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

export const postResetCurrentRound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentRound = await getCurrentRound();
        await saveRecords(currentRound);
        await resetCurrentRound();
        success(res, 'reset currentRound');
    } catch (err) {
        next(err);
        fail(res, err);
    };
};