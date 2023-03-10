import { Request, Response, NextFunction } from "express";

import { postgres } from "../../services";
import { Player } from "../../entities";

export {
    createPlayer,
    getPlayers
};

const repo = postgres.getRepository(Player);

const createPlayer = async (req: Request, res: Response) => {
    const player = repo.create(req.body);
    await repo.save(player);
    res.json(player);
};

const getPlayers = async (req: Request, res: Response) => {
    const players = await repo.find();
    res.json(players);
};