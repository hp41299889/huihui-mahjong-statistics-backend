import { Request, Response, NextFunction } from 'express';

import { http, loggerFactory } from '@utils';
import playerModel from './player.model';
import { ICreateOnePlayerDto } from './player.interface';
import { getStatistics, setStatistics } from '@jobs/mahjong/statistics';
import { IPlayerStatistics } from '@jobs/mahjong/interface';

const logger = loggerFactory('Api player');
const { success, fail } = http;

export const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body }: { body: ICreateOnePlayerDto } = req;
        logger.debug('post one player', body);
        logger.warn(body);
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

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await playerModel.readAll();
        logger.debug('get all players');
        success(res, result);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};

export const getPlayerStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const statistics = await getStatistics();
        success(res, statistics);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};