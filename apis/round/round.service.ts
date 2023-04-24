import { Request, Response, NextFunction } from "express";

import { http, loggerFactory } from '@utils';
import { EDeskType } from "./round.enum";
import roundModel from "./round.model";
import { ICurrentRound, IPostOne, ICreateOneRoundDto, IRound } from "./round.interface";
import { IRecord, windList, EEndType, EWind } from '@apis/record';
import { playerModel, IPlayer } from "@apis/player";

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
        //前端新增round頁面會使用，若last round還沒結束要導向新增record頁面，並緩存currentRound
        //前端新增record頁面會使用，進入和新增都要使用，同步currentRound資料並顯示
        logger.debug('get last round');
        //先檢查currentRound有資料嗎，沒有才會跟DB要，TODO 加入redis
        if (currentRound.roundUid) {
            //currentRound有存資料，直接回傳
            logger.debug('currentRound有存資料，直接回傳');
            logger.warn(currentRound);
            success(res, currentRound);
        } else {
            //currentRound沒有資料，讀取DB
            logger.debug('currentRound沒有資料，讀取DB');
            const round = await roundModel.readLast();
            if (!round) {
                //根本沒有round
                logger.debug('根本沒有round');
                success(res, 'no round');
            } else {
                //讀取DB最新一筆round
                logger.debug('讀取DB最新一筆round');
                const lastRecord = await takeLastRecord(round);
                //若沒有record，把currentRound更新成roundModel.readLast()
                if (!lastRecord) {
                    logger.debug('沒有record，把currentRound更新成roundModel.readLast()');
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
                    logger.warn(currentRound);
                    success(res, currentRound);
                } else {
                    //若有record，判斷這個record是否是一將的最後一局
                    //若是最後一局，清空currentRound
                    logger.debug('若有record，判斷這個record是否是一將的最後一局');
                    if (await isLastRecord(lastRecord, round.north)) {
                        logger.debug('最後一局，清空currentRound');
                        await resetCurrentRound();
                        logger.warn('currentRound');
                        logger.warn(currentRound);
                        success(res, currentRound);
                    } else {
                        //若不是最後一局，更新currentRound
                        logger.debug('最後一局，更新currentRound');
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
                        currentRound.circle = lastRecord.circle;
                        currentRound.dealer = lastRecord.dealer;
                        currentRound.dealerCount = lastRecord.dealerCount;
                        //到目前為止currentRound是等同DB，接下來用風圈、風局、是否連莊判斷有沒有進入下一局
                        await updateCurrentRound(lastRecord);
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

//TODO 目前只能取出round關聯所有的record，自行取出最新record
const takeLastRecord = async (round: IRound) => {
    return round.records[round.records.length - 1];
};

const isLastRecord = async (record: IRecord, north: IPlayer) => {
    return (record.circle === EWind.NORTH && record.dealer === EWind.NORTH && record.winner !== north);
};

export const resetCurrentRound = async () => {
    currentRound.roundUid = '';
    currentRound.base = 0;
    currentRound.point = 0;
    currentRound.dealer = EWind.EAST;
    currentRound.dealerCount = 0;
    currentRound.deskType = EDeskType.AUTO;
    currentRound.players = {
        east: null,
        south: null,
        west: null,
        north: null
    };
};

export const updateCurrentRound = async (record: IRecord) => {
    //若連莊判斷發生，連莊數+1，風圈風局不變
    if (await isDealerContinue(record)) {
        currentRound.dealerCount++;
    } else {
        currentRound.dealerCount = 0;
        //若沒有連莊，則下一局
        //若是北風局，則判斷是否是北風圈
        if (record.dealer === EWind.NORTH) {
            //若是北風圈，
            if (record.circle === EWind.NORTH) {
                //北風北且沒有連莊，代表這將結束，重置currentRound
                currentRound.roundUid = '';
                currentRound.base = 0;
                currentRound.point = 0;
                currentRound.deskType = EDeskType.AUTO;
                currentRound.players = {
                    east: null,
                    south: null,
                    west: null,
                    north: null
                };
                currentRound.circle = EWind.EAST;
                currentRound.dealer = EWind.EAST;
                currentRound.dealerCount = 0;
            } else {
                //若非北風的北風局，更新currentRound下一圈，風局改為east
                currentRound.circle = windList[windList.indexOf(currentRound.circle) + 1];
                currentRound.dealer = windList[0];
            };
        } else {
            //若不是北風局，進入下一局
            currentRound.dealer = windList[windList.indexOf(currentRound.dealer) + 1];
        };
    };
};

const isDealerContinue = async (record: IRecord) => {
    return (await isDealerWin(record) || await isDraw(record) || await isFake(record));
};

const isDealerWin = async (record: IRecord) => {
    return record.winner ? currentRound.players[record.dealer].id === record.winner.id : false;
};

const isDraw = async (record: IRecord) => {
    return record.endType === EEndType.DRAW;
};

const isFake = async (record: IRecord) => {
    return record.endType === EEndType.FAKE;
};