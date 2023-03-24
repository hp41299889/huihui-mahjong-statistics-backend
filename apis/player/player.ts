import { Request, Response, NextFunction } from 'express';

import { success, fail } from '@utils/http';
import { playerModel } from '@postgres/models';

const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name }: { name: string } = req.body;
        const result = await playerModel.createOne(name);
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
        const { name }: { name: string } = req.body;
        const result = await playerModel.readOneByName(name);
        success(res, result);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};

export default {
    postOne,
    getAll,
    getOneByName
};