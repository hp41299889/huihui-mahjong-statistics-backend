import { Request, Response, NextFunction } from 'express';

import { http, loggerFactory } from '@utils';
import playerModel from './player.model';
import { ICreateOnePlayerDto } from './player.interface';
import { getStatistics, setStatistics } from '@jobs/mahjong/statistics';
import { IPlayerStatistics } from '@jobs/mahjong/interface';

const logger = loggerFactory('Api player');
const { success, fail } = http;

// POST
export const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug('post one player');
        const { body }: { body: ICreateOnePlayerDto } = req;
        const { name } = body;
        const result = await playerModel.createOne(body);
        const statistics = await getStatistics();
        const createdPlayerStatistics: IPlayerStatistics = {
            id: result.id,
            name: result.name,
            createdAt: result.createdAt,
            winds: {}
        };
        const updatedStatistics = {
            ...statistics,
            [name]: createdPlayerStatistics
        };
        await setStatistics(updatedStatistics);
        success(res, result);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};

// GET
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug('get all players');
        const result = await playerModel.readAll();
        success(res, result);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};
export const getPlayerStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug('get player statistics');
        const statistics = await getStatistics();
        success(res, statistics);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};