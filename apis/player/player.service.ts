import { Request, Response, NextFunction } from 'express';

import { http, loggerFactory } from '@utils';
import playerModel from './player.model';
import { ICreateOnePlayerDto, IPlayerStatistics } from './player.interface';
import { roundModel, IRound } from '@apis/round';
import { IRecord, EEndType } from '@apis/record';

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
        const [rounds, roundCount] = await roundModel.readManyByName(name);
        logger.warn(rounds);
        const result = await calculate([rounds, roundCount], name);
        success(res, result);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};

const calculate = async ([rounds, roundCount]: [IRound[], number], name: string) => {
    const playerStatistics: IPlayerStatistics = {
        east: {
            rounds: 0,
            records: 0,
            wins: 0,
            loses: 0,
            selfDrawns: 0,
            draws: 0,
            fakes: 0
        },
        south: {
            rounds: 0,
            records: 0,
            wins: 0,
            loses: 0,
            selfDrawns: 0,
            draws: 0,
            fakes: 0
        },
        west: {
            rounds: 0,
            records: 0,
            wins: 0,
            loses: 0,
            selfDrawns: 0,
            draws: 0,
            fakes: 0
        },
        north: {
            rounds: 0,
            records: 0,
            wins: 0,
            loses: 0,
            selfDrawns: 0,
            draws: 0,
            fakes: 0
        }
    };
    const roundPromise = rounds.map(async round => {
        const wind = takeWind(round, name);
        playerStatistics[wind].rounds++;
        playerStatistics[wind].records += round.records.length;
        const recordPromise = round.records.map(async record => {
            if (await isWin(record, name)) playerStatistics[wind].wins++;
            if (await isSelfDrawn(record, name)) playerStatistics[wind].selfDrawns++;
            if (await isLose(record, name)) playerStatistics[wind].loses++;
        });
        await Promise.all(recordPromise);
    });
    await Promise.all(roundPromise);
    return playerStatistics;
};

export const takeWind = (round: IRound, name: string) => {
    return Object.entries(round).find(([key, value]) => value.name === name)[0];
};

const isWin = async (record: IRecord, name: string) => {
    return record.endType === EEndType.WINNING && record.winner.name === name;
};

const isSelfDrawn = async (record: IRecord, name: string) => {
    return record.endType === EEndType.SELF_DRAWN && record.winner.name === name;
};

const isLose = async (record: IRecord, name: string) => {
    return record.losers.some(loser => loser.name === name);
};