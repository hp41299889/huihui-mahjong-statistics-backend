import { In } from 'typeorm';

import { Postgres } from '@databases';
import { loggerFactory } from '@utils';
import { Player } from './player.entity';
import { ICreateOnePlayerDto } from './player.interface';

const logger = loggerFactory('Model player');
const repo = Postgres.getRepository(Player);

// Create
const createOne = (dto: ICreateOnePlayerDto) => {
    try {
        logger.debug('create one player');
        return repo.save(dto);
    } catch (err) {
        throw err;
    };
};

// Read
const readAll = async () => {
    try {
        logger.debug('read all players');
        return await repo.find();
    } catch (err) {
        throw err;
    };
};

const readOneByName = async (name: string) => {
    try {
        logger.debug('read one player by name');
        return await repo.findOne({
            where: {
                name: name
            }
        });
    } catch (err) {
        throw err;
    };
};

const readManyByNames = async (name: string[]) => {
    try {
        logger.debug('read many players by many names');
        return repo.find({
            where: {
                name: In(name)
            }
        })
    } catch (err) {
        throw err;
    };
};

// Update
//TODO not finish
const updateOneByName = async (name: string) => {
    logger.debug('update one player by name');
    const player = await repo.findOneBy({ name: name });
    if (player) {
    }
    await repo.save(player);
};

export default {
    createOne,
    readAll,
    readOneByName,
    readManyByNames,
    updateOneByName
};