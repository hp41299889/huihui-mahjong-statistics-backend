import { Request, Response, NextFunction } from "express";
import { join } from 'lodash';

import http from '@utils/http';
import loggerFactory from "@utils/logger";
import roundModel from "@apis/round/round.model";
import { EEndType, EWind } from "./record.enum";
import { ICurrentRound } from "@apis/round/round.interface";
import { IPostOne, ICreateOneRecordDto } from "./record.interface";

import { currentRound } from "../round/round.service";
import recordModel from "./record.model";

const { success, fail } = http;
const logger = loggerFactory('Api record');

const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roundUid } = req.params;
        const { body }: { body: IPostOne } = req;
        logger.debug('post one record');
        logger.warn(body);
        const round = await roundModel.readOneByUid(roundUid);
        const recordDto: ICreateOneRecordDto = {
            ...body,
            round: round
        };
        const result = await recordModel.createOne(recordDto);
        await nextDealer(body);
        logger.warn('currentRound', currentRound);
        success(res, result);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

const windList = [
    EWind.EAST,
    EWind.SOUTH,
    EWind.WEST,
    EWind.NORTH
];

const nextDealer = async (record: IPostOne) => {
    //如果連莊，連莊數+1
    if (isDealerContinue(record, currentRound)) {
        currentRound.dealerCount++;
    } else {
        //如果沒連莊
        //如果風局是北風位
        if (currentRound.dealer === EWind.NORTH) {
            //如果風圈是北風，則currentRound重置
            if (currentRound.circle === EWind.NORTH) {
                currentRound.roundUid = '';
                currentRound.base = 0;
                currentRound.point = 0;
                currentRound.circle = null;
                currentRound.dealer = null;
                currentRound.players = null;
                currentRound.deskType = null;
            } else {
                //如果風圈不是北風，則風圈index + 1，風局index = 0
                currentRound.circle = windList[windList.indexOf(currentRound.circle) + 1];
                currentRound.dealer = windList[windList.indexOf(currentRound.dealer) + 1];
            };
        } else {
            //如果風局不是北風位則進入下一局，風局index +1
            currentRound.dealer = windList[windList.indexOf(currentRound.dealer) + 1];
        };
    };
};

const isDealerContinue = async (record: IPostOne, round: ICurrentRound) => {
    if (record.endType === EEndType.DRAW) return true;
    if (record.endType === EEndType.FAKE) return true;
    if (record.winner === record.dealer) return true;
};

export default {
    postOne,
    // getAll
};