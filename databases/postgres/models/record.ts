import postgres from '@postgres/postgres';
import loggerFactory from '@utils/logger';
import { Record, IPlayer, IRecordLoser, IRound, EEndType, EWind } from '@postgres/entities';

const logger = loggerFactory('Model Record');

const repo = postgres.getRepository(Record);

interface ICreateOneRecordDto {
    winner: IPlayer;
    loser: IRecordLoser[];
    circle: number;
    dealer: number;
    dealerCount: number;
    endType: EEndType;
    point: number;
    round: IRound;
};

const createOne = async (dto: ICreateOneRecordDto) => {
    try {
        logger.debug('create one');
        return await repo.save(dto);
    } catch (err) {
        throw err;
    };
};

const readAll = async () => {
    try {
        return await repo.find();
    } catch (err) {
        throw err;
    };
};

const readLastByRoundUid = async (roundUid: string) => {
    try {
        return await repo.findOne({
            where: {
                round: {
                    uid: roundUid
                }
            },
            order: {
                createdAt: 'DESC'
            }
        });
    } catch (err) {
        throw err;
    };
};
export { ICreateOneRecordDto };
export default {
    createOne,
    readAll,
    readLastByRoundUid
};