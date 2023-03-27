import { Request, Response, NextFunction } from 'express';

import http from '@utils/http';
import loggerFactory from '@utils/logger';
import { playerModel, ICreateOnePlayerDto } from '@postgres/models';

const logger = loggerFactory('Api player');
const { success, fail } = http;

const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body }: { body: ICreateOnePlayerDto } = req;
        logger.debug('post one player', body);
        logger.warn(body);
        const result = await playerModel.createOne(body);
        success(res, result);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await playerModel.readAll();
        success(res, result);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};

const getOneByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { playerName } = req.params;
        const result = await playerModel.readOneByName(playerName);
        success(res, result);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};

export default {
    postOne,
    getAll,
    getOneByName,
};