import postgres from '@postgres/postgres';
import loggerFactory from '@utils/logger';
import Round from './round.entity';
import { ICreateOneRoundDto } from './round.interface';


const logger = loggerFactory('Model round');
const repo = postgres.getRepository(Round);

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
            where: {

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
    readLast,
    readOneByUid
};