import { Request, Response, NextFunction } from "express";

import { http, loggerFactory } from '@utils';
import { currentRound } from '@apis/round/round.service';
import { EWind, EEndType } from "./record.enum";
import { IPostOne, ICreateOneRecordDto } from "./record.interface";
import { takeWind } from "@apis/player/player.service";
import playerModel from "@apis/player/player.model";
import roundModel from "@apis/round/round.model";
import recordModel from '@apis/record/record.model';

const { success, fail } = http;
const logger = loggerFactory('Api record');

export const windList = [
    EWind.EAST,
    EWind.SOUTH,
    EWind.WEST,
    EWind.NORTH
];

export const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roundUid } = req.params;
        const { body }: { body: IPostOne } = req;
        console.log(body);

        const round = await roundModel.readOneByUid(roundUid);
        const winner = await playerModel.readOneByName(body.winner);
        const loser = await playerModel.readManyByNames(body.loser);
        const recordDto: ICreateOneRecordDto = {
            ...body,
            winner: winner,
            losers: loser,
            circle: currentRound.circle,
            dealer: currentRound.dealer,
            dealerCount: currentRound.dealerCount,
            round: round
        };
        // const record = await recordModel.createOne(recordDto);
        await nextDealer(recordDto, takeWind(round, winner.name));
        success(res, 'record');
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

const nextDealer = async (record: ICreateOneRecordDto, winnerWind: string) => {
    //如果連莊，連莊數+1
    if (await isDealerContinue(record, winnerWind)) {
        logger.debug('連莊')
        currentRound.dealerCount++;
    } else {
        logger.debug('沒連莊')
        //如果沒連莊
        //如果風局是北風位
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
            currentRound.dealerCount = 0;
        };
    };
};

const isDealerContinue = async (record: ICreateOneRecordDto, winnerWind: string) => {
    if (record.endType === EEndType.DRAW) return true;
    if (record.endType === EEndType.FAKE) return true;
    if (winnerWind === record.dealer) return true;
    return false;
};