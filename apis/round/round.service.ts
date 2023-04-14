import { Request, Response, NextFunction } from "express";

import { EDeskType } from "./round.enum";
import { http, loggerFactory } from '@utils';
import roundModel from "./round.model";
import { IRecord } from '@apis/record/record.interface';
import { windList } from "@apis/record/record.service";
import { EWind } from "@apis/record/record.enum";
import { ICurrentRound, IPostOne, ICreateOneRoundDto } from "./round.interface";
import { IPlayer } from "@apis/player/player.interface";
import playerModel from "@apis/player/player.model";
import recordModel from "@apis/record/record.model";

const logger = loggerFactory('Api round');
const { success, fail } = http;

export const currentRound: ICurrentRound = {
    roundUid: '',
    deskType: EDeskType.AUTO,
    base: 0,
    point: 0,
    players: {
        east: null,
        south: null,
        west: null,
        north: null
    },
    circle: EWind.EAST,
    dealer: EWind.EAST,
    dealerCount: 0,
};

export const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body }: { body: IPostOne } = req;
        logger.debug('post one round', body);
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
        currentRound.roundUid = result.uid;
        currentRound.deskType = result.deskType;
        currentRound.base = result.base;
        currentRound.point = result.point;
        currentRound.players.east = east;
        currentRound.players.south = south;
        currentRound.players.west = west;
        currentRound.players.north = north;
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

export const getLast = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //TODO last record可能為空
        logger.debug('get last round');
        if (currentRound.roundUid) {
            logger.warn('currentRound', currentRound);
            success(res, currentRound);
        } else {
            const round = await roundModel.readLast();
            if (!round) {
                success(res, 'no round');
            } else {
                const lastRecord = await recordModel.readLastByRoundUid(round.uid);
                if (!lastRecord) {
                    currentRound.roundUid = round.uid;
                    currentRound.base = round.base;
                    currentRound.point = round.point;
                    currentRound.deskType = round.deskType;
                    currentRound.players = {
                        east: round.east,
                        south: round.south,
                        west: round.west,
                        north: round.north
                    };
                    success(res, currentRound);
                } else {
                    if (isLastRecord(lastRecord, currentRound.players.north)) {
                        currentRound.roundUid = '';
                        logger.warn('currentRound');
                        logger.warn(currentRound);
                        success(res, currentRound);
                    } else {
                        currentRound.roundUid = round.uid;
                        currentRound.base = round.base;
                        currentRound.point = round.point;
                        currentRound.deskType = round.deskType;
                        currentRound.players = {
                            east: round.east,
                            south: round.south,
                            west: round.west,
                            north: round.north
                        },
                            currentRound.circle = lastRecord.circle;
                        currentRound.dealer = lastRecord.dealer;
                        currentRound.dealerCount = lastRecord.dealerCount;
                        if (currentRound.dealer === EWind.NORTH) {
                            logger.debug('北風局')
                            //如果風圈是北風，則currentRound重置
                            if (currentRound.circle === EWind.NORTH) {
                                logger.debug('北風圈，結束，重置currentRound')
                                currentRound.roundUid = '';
                                currentRound.base = 0;
                                currentRound.point = 0;
                                currentRound.circle = null;
                                currentRound.dealer = null;
                                currentRound.players = null;
                                currentRound.deskType = null;
                            } else {
                                logger.debug('不是北風圈，下一圈')
                                //如果風圈不是北風，則風圈index + 1，風局index = 0
                                currentRound.circle = windList[windList.indexOf(currentRound.circle) + 1];
                                currentRound.dealer = windList[0];
                            };
                        } else {
                            logger.debug('不是被風局，下一局')
                            //如果風局不是北風位則進入下一局，風局index +1
                            currentRound.dealer = windList[windList.indexOf(currentRound.dealer) + 1];
                        };
                        logger.warn('currentRound');
                        logger.warn(currentRound);
                        success(res, currentRound);
                    };
                };
            };
        };

    } catch (err) {
        next(err);
        fail(res, err);
    };
};

const isCurrentRoundExist = (currentRound: ICurrentRound): boolean => {
    try {
        if (currentRound.roundUid) {
            return true;
        } else {
            return false;
        };
    } catch (err) {
        throw err;
    };
};

const isLastRecord = (record: IRecord, north: IPlayer) => {
    if (record.circle === EWind.NORTH && record.dealer === EWind.NORTH && record.winner !== north) return true;
    return false;
};