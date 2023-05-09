import { Postgres } from '@databases';
import { loggerFactory } from '@utils';
import { Round } from './round.entity';
import { ICreateOneRoundDto } from './round.interface';

const logger = loggerFactory('Model round');
const repo = Postgres.getRepository(Round);

// Create
const createOne = async (dto: ICreateOneRoundDto) => {
    try {
        logger.debug('create one round');
        return await repo.save(dto);
    } catch (err) {
        throw err;
    };
};

// Read
const readAll = async () => {
    logger.debug('read all rounds');
    try {
        return repo.find({
            relations: {
                records: {
                    winner: true,
                    losers: true,
                },
                east: true,
                south: true,
                west: true,
                north: true
            },
            order: {
                records: {
                    createdAt: 'ASC'
                }
            }
        });
    } catch (err) {
        throw err;
    };
};

const readLastWithPlayers = async () => {
    logger.debug('read last round with players');
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
    logger.debug('read many rounds by many names');
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

const deleteLastRound = async () => {
    logger.debug('delete last round');
    return repo.remove(await repo.findOne({
        where: {},
        order: {
            createdAt: 'DESC'
        }
    }));
};

export default {
    createOne,
    readAll,
    readLastWithPlayers,
    readManyByName,
    deleteLastRound
};