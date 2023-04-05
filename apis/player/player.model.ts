import { In } from 'typeorm';

import { Postgres } from '../../databases/postgres/postgres';
import loggerFactory from '../../utils/logger';
import { Player } from './player.entity';
import { ICreateOnePlayerDto } from './player.interface';

const logger = loggerFactory('Model player');
const repo = Postgres.getRepository(Player);

export const createOne = (dto: ICreateOnePlayerDto) => {
    try {
        logger.debug('create one player', dto);
        logger.warn(dto);
        return repo.save(dto);
    } catch (err) {
        throw err;
    };
};

export const readAll = () => {
    try {
        return repo.find();
    } catch (err) {
        throw err;
    };
};

export const readOneByName = async (playerName: string) => {
    try {
        return await repo.findOneBy({
            name: playerName
        });
    } catch (err) {
        throw err;
    };
};

export const readManyByNames = async (playerNames: string[]) => {
    try {
        return repo.find({
            where: {
                name: In(playerNames)
            }
        })
    } catch (err) {
        throw err;
    }
};