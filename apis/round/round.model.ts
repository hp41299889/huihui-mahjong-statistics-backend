import { Postgres } from '../../databases/postgres/postgres';
import loggerFactory from '../../utils/logger';
import { Round } from './round.entity';
import { ICreateOneRoundDto } from './round.interface';

const logger = loggerFactory('Model round');
const repo = Postgres.getRepository(Round);

export const createOne = async (dto: ICreateOneRoundDto) => {
    try {
        logger.debug('create one round', dto);
        logger.warn(dto);
        return await repo.save(dto);
    } catch (err) {
        throw err;
    };
};

export const readAll = async () => {
    try {
        return repo.find();
    } catch (err) {
        throw err;
    };
};


export const readOneByUid = async (uid: string) => {
    try {
        return repo.findOneBy({ uid: uid });
    } catch (err) {
        throw err;
    };
};

export const readLast = async () => {
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