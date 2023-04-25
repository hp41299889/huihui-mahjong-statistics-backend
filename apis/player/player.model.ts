import { In } from 'typeorm';

import { Postgres } from '@databases';
import { loggerFactory } from '@utils';
import { Player } from './player.entity';
import { ICreateOnePlayerDto, IUpdateOnePlayerDto } from './player.interface';

const logger = loggerFactory('Model player');
const repo = Postgres.getRepository(Player);

const createOne = (dto: ICreateOnePlayerDto) => {
    try {
        logger.debug('create one player');
        return repo.save(dto);
    } catch (err) {
        throw err;
    };
};

const readAll = () => {
    try {
        logger.debug('read all players');
        return repo.find();
    } catch (err) {
        throw err;
    };
};

const readOneByName = async (name: string) => {
    try {
        logger.debug('read one by name');
        return await repo.findOneBy({
            name: name
        });
    } catch (err) {
        throw err;
    };
};

const readManyByNames = async (name: string[]) => {
    try {
        logger.debug('read many by many names');
        return repo.find({
            where: {
                name: In(name)
            }
        })
    } catch (err) {
        throw err;
    };
};

const updateOneByName = async (name: string, data: IUpdateOnePlayerDto) => {
    const player = await repo.findOneBy({ name: name });
    if (player) {
        player.win = data.win;
        player.lose = data.lose;
        player.beSelfDrawn = data.beSelfDrawn;
        player.draw = data.draw;
        player.fake = data.fake;
        player.amount = data.amount;
    };
    await repo.save(player);
};

export default {
    createOne,
    readAll,
    readOneByName,
    readManyByNames,
    updateOneByName
};