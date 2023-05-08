import { Request, Response, NextFunction } from "express";

import { http, loggerFactory } from '@utils';
import roundModel from "./round.model";
import { IPostOne, ICreateOneRoundDto } from "./round.interface";
import { playerModel, } from "@apis/player";
import { getCurrentRound, initCurrentRound, resetCurrentRound, saveRecords } from "@jobs/mahjong/mahjong";
import { getStatistics, setStatistics, updateStatistics } from "@jobs/mahjong/statistics";

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
        const statistics = await getStatistics();
        await saveRecords(currentRound);
        const updatedStatistics = await updateStatistics(statistics, currentRound)
        await setStatistics(updatedStatistics);
        await resetCurrentRound();
        success(res, 'reset currentRound');
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

export const deleteCurrentRound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await roundModel.deleteLast();
        await resetCurrentRound();
        success(res, 'delete currentRound');
    } catch (err) {
        next(err);
        fail(res, err);
    };
};