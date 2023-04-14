import { loggerFactory } from '@utils';
import { Postgres } from '@postgres';
import { Record } from './record.entity';
import { ICreateOneRecordDto, IRecord } from './record.interface';

const logger = loggerFactory('Model Record');
const repo = Postgres.getRepository(Record);

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

const readManyByRoundUid = async (roundUid: string): Promise<[IRecord[], number]> => {
    return await repo.findAndCount({
        where: {
            round: {
                uid: roundUid
            }
        }
    });
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

const readManyByPlayerName = async (name: string) => {
    return await repo.findAndCountBy({

    })
};

export default {
    createOne,
    readAll,
    readLastByRoundUid,
    readManyByRoundUid
}