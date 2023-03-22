import { Request, Response, NextFunction } from "express";

import { success, fail } from "../../utils/http";
import postgres from "../../databases/postgres";
import { Player } from "../../databases/entities/index";

export {
    createPlayer,
    getPlayers
};

const repo = postgres.getRepository(Player);

const createPlayer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const player = repo.create(req.body);
        const result = await repo.save(player);
        success(res, result);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};

const getPlayers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await repo.find();
        success(res, result);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};