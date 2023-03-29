import postgres from '@postgres/postgres';
import loggerFactory from '@utils/logger';
import Record from './record.entity';
import { ICreateOneRecordDto } from './record.interface';

const logger = loggerFactory('Model Record');
const repo = postgres.getRepository(Record);

const createOne = async (dto: ICreateOneRecordDto) => {
    try {
        logger.debug('create one record', dto);
        logger.warn(dto);
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

export default {
    createOne,
    readAll,
    readLastByRoundUid
};