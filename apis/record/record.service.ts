import { Request, Response, NextFunction } from "express";
import { join } from 'lodash';

import http from '@utils/http';
import loggerFactory from "@utils/logger";
import roundModel from "@apis/round/round.model";
import { EEndType } from "./record.enum";
import { ICurrentRound } from "@apis/round/round.interface";
import { IPostOne, ICreateOneRecordDto } from "./record.interface";

import { currentRound } from "../round/round.service";

const { success, fail } = http;
const logger = loggerFactory('Api record');

const postOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //TODO functional
        const { roundUid } = req.params;
        const { body }: { body: IPostOne } = req;
        logger.debug('post one record');
        logger.warn(body);
        const round = await roundModel.readOneByUid(roundUid);
        const recordDto: ICreateOneRecordDto = {
            ...body,
            round: round
        };
        // const record = await recordModel.createOne(recordDto);
        // const recordLoser = loser.map(async player => {
        //     const recordLoserDto: ICreateOneLoserByPlayerDto = {
        //         player: player,
        //         record: record
        //     };
        //     return await recordLoserModel.createLoserByPlayer(recordLoserDto);
        // });
        success(res, recordDto);
    } catch (err) {
        next(err);
        fail(res, err);
    };
};

const nextDealer = async () => {

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