import { Request, Response, NextFunction } from 'express';

import { success, fail } from '@utils/http';
import { playerModel, ICreateOnePlayerDto } from '@postgres/models';

const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body }: { body: ICreateOnePlayerDto } = req;
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