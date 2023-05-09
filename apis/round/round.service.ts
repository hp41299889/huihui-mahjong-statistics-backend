import { Request, Response, NextFunction } from "express";

import { http, loggerFactory } from '@utils';
import roundModel from "./round.model";
import { IPostOne, ICreateOneRoundDto } from "./round.interface";
import { playerModel, } from "@apis/player";
import { getCurrentRoundState, initCurrentRound, resetCurrentRound, saveRecords } from "@jobs/mahjong/mahjong";
import { getHistory, getStatistics, setHistory, setStatistics, updateHistory, updateStatistics } from "@jobs/mahjong/statistics";

const logger = loggerFactory('Api round');
const { success, fail } = http;

//POST
export const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug('post one round');
        const { body }: { body: IPostOne } = req;
        logger.warn(body);
        const east = await playerModel.readOneByName(body.east);
        const south = await playerModel.readOneByName(body.south);
        const west = await playerModel.readOneByName(body.west);
        const north = await playerModel.readOneByName(body.north);
        const dto: ICreateOneRoundDto = {
            ...body,
            east: east,
            south: south,
            west: west,
            north: north
        };
        const result = await roundModel.createOne(dto);
        await initCurrentRound();
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

export const postResetCurrentRound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug('post reset currentRound');
        const currentRound = await getCurrentRoundState();
        const statistics = await getStatistics();
        const history = await getHistory();
        await saveRecords(currentRound);
        const updatedStatistics = await updateStatistics(statistics, currentRound)
        const updatedHistory = await updateHistory(history, currentRound);
        await setStatistics(updatedStatistics);
        await setHistory(updatedHistory);
        await resetCurrentRound();
        success(res, 'reset currentRound');
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

//GET
export const getHistoryByDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug('get history round by date');
        const { date } = req.params;
        const history = await getHistory();
        const histories = history[date];
        success(res, histories);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

export const getExistDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug('get exist date from history');
        const history = await getHistory();
        const dates = history ? Object.keys(history) : [];
        success(res, dates);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

export const getCurrentRound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug('get currentRound');
        const currentRound = await getCurrentRoundState();
        success(res, currentRound);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

//DELETE
export const deleteCurrentRound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug('delete currentRound');
        await roundModel.deleteLastRound();
        await resetCurrentRound();
        success(res, 'delete');
    } catch (err) {
        next(err);
        fail(res, err);
    };
};