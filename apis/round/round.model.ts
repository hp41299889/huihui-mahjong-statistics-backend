import { Postgres } from '@databases';
import { loggerFactory } from '@utils';
import { Round } from './round.entity';
import { ICreateOneRoundDto } from './round.interface';

const logger = loggerFactory('Model round');
const repo = Postgres.getRepository(Round);

const createOne = async (dto: ICreateOneRoundDto) => {
    try {
        logger.debug('create one round', dto);
        logger.warn(dto);
        return await repo.save(dto);
    } catch (err) {
        throw err;
    };
};

const readAll = async () => {
    try {
        return repo.find();
    } catch (err) {
        throw err;
    };
};

const readOneByUid = async (uid: string) => {
    try {
        return repo.findOneBy({ uid: uid });
    } catch (err) {
        throw err;
    };
};

const readLast = async () => {
    try {
        return repo.findOne({
            where: {},
            relations: {
                records: true
            },
            order: {
                createdAt: 'DESC'
            }
        });
    } catch (err) {
        throw err;
    };
};

const readManyByName = async (name: string) => {
    return repo.findAndCount({
        where: [
            { east: { name: name } },
            { south: { name: name } },
            { west: { name: name } },
            { north: { name: name } }
        ],
        relations: {
            records: true
        }
    });
};

export default {
    createOne,
    readAll,
    readOneByUid,
    readLast,
    readManyByName
};