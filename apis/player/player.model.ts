import { In } from 'typeorm';

import { Postgres } from '@postgres';
import { loggerFactory } from '@utils';
import { Player } from './player.entity';
import { ICreateOnePlayerDto } from './player.interface';

const logger = loggerFactory('Model player');
const repo = Postgres.getRepository(Player);

const createOne = (dto: ICreateOnePlayerDto) => {
    try {
        logger.debug('create one player', dto);
        logger.warn(dto);
        return repo.save(dto);
    } catch (err) {
        throw err;
    };
};

const readAll = () => {
    try {
        return repo.find();
    } catch (err) {
        throw err;
    };
};

const readOneByName = async (name: string) => {
    try {
        return await repo.findOneBy({
            name: name
        });
    } catch (err) {
        throw err;
    };
};

const readManyByNames = async (name: string[]) => {
    try {
        return repo.find({
            where: {
                name: In(name)
            }
        })
    } catch (err) {
        throw err;
    }
};

export default {
    createOne,
    readAll,
    readOneByName,
    readManyByNames
};