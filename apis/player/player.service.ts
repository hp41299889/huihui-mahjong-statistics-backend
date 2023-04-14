import { Request, Response, NextFunction } from 'express';

import { http, loggerFactory } from '@utils';
import playerModel from './player.model';
import { ICreateOnePlayerDto, IPlayerRecord } from './player.interface';
import { IRound, } from '@apis/round/round.interface';
import { EWind, } from '@apis/record/record.enum';
import roundModel from '@apis/round/round.model';
import recordModel from '@apis/record/record.model';
import { IRecord } from '@apis/record';

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
        //TODO post player/名字 要計算總局數、胡牌數、自摸數、放槍數及機率等等
        const { name } = req.params;
        logger.debug('get player by playerName');
        logger.warn(name);
        const rounds = await roundModel.readManyByName(name);
        logger.warn(rounds);
        calculate(rounds, name);
        const result: IPlayerRecord = {

        };
        success(res, rounds);
    } catch (err) {
        fail(res, err);
        next(err);
    };
};

const calculate = async (rounds: IRound[], name: string) => {

    rounds.map(async (round, index) => {
        let wins = 0;
        const wind = takeWind(round, name);
        const [records, recordsCount] = await recordModel.readManyByRoundUid(round.uid);
        records.forEach(record => {
            if (countWin(record.winner.name, name)) wins++;
        });
        console.log('wind', wind);
        console.log('records', records);
        console.log('recordsCount', recordsCount);
        console.log('wins', wins);





    });
};

export const takeWind = (round: IRound, name: string) => {
    return Object.entries(round).find(([key, value]) => value.name === name)[0];
};

const countWin = (winner: string, name: string) => {
    return winner === name ? true : false;
};