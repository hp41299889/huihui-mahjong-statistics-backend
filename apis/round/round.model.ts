import { Postgres } from '@databases';
import { loggerFactory } from '@utils';
import { Round } from './round.entity';
import { ICreateOneRoundDto } from './round.interface';

const logger = loggerFactory('Model round');
const repo = Postgres.getRepository(Round);

const createOne = async (dto: ICreateOneRoundDto) => {
    try {
        logger.debug('create one round');
        return await repo.save(dto);
    } catch (err) {
        throw err;
    };
};

const readAll = async () => {
    try {
        return repo.find({
            relations: {
                records: {
                    winner: true,
                    losers: true
                },
                east: true,
                south: true,
                west: true,
                north: true
            }
        });
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

const readLastWithPlayers = async () => {
    try {
        return repo.findOne({
            where: {},
            relations: {
                records: {
                    winner: true,
                    losers: true
                },
                east: true,
                south: true,
                west: true,
                north: true
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

const deleteLast = async () => {
    return repo.remove(
        await repo.findOne({
            where: {},
            order: {
                createdAt: 'DESC'
            }
        }));
};

export default {
    createOne,
    readAll,
    readOneByUid,
    readLastWithPlayers,
    readManyByName,
    deleteLast
};