import loggerFactory from '../../utils/logger';
import { Postgres } from '../../databases/postgres/postgres';
import { Record } from './record.entity';
import { ICreateOneRecordDto } from './record.interface';

const logger = loggerFactory('Model Record');
const repo = Postgres.getRepository(Record);

export const createOne = async (dto: ICreateOneRecordDto) => {
    try {
        logger.debug('create one record', dto);
        logger.warn(dto);
        return await repo.save(dto);
    } catch (err) {
        throw err;
    };
};

export const readAll = async () => {
    try {
        return await repo.find();
    } catch (err) {
        throw err;
    };
};

export const readLastByRoundUid = async (roundUid: string) => {
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