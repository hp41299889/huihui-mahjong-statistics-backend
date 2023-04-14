import { Request, Response, NextFunction } from 'express';

import { http, loggerFactory } from '@utils';
import playerModel from './player.model';
import { ICreateOnePlayerDto } from './player.interface';
import { IRound, } from '@apis/round/round.interface';
import { EWind, } from '@apis/record/record.enum';
import roundModel from '@apis/round/round.model';
import recordModel from '@apis/record/record.model';

const logger = loggerFactory('Api player');
const { success, fail } = http;

export const postOne = async (req: Request, res: Response, next: NextFunction) => {
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

export const getOneByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.params;
        logger.debug('get player by playerName');
        logger.warn(name);
        const rounds = await roundModel.readManyByName(name);
        logger.warn(rounds);
        calculateWinRate(rounds, name);
        success(res, rounds);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};

const calculateWinRate = async (rounds: IRound[], name: string) => {
    rounds.map(async (round, index) => {
        const wind = takeWind(round, name);
        const [records, recordsCount] = await recordModel.readManyByRoundUid(round.uid);
        console.log('wind', wind);
        console.log('records', records[0]);
        console.log('recordsCount', recordsCount);




    });
};

export const takeWind = (round: IRound, name: string) => {
    return Object.entries(round).find(([key, value]) => value.name === name)[0];
};