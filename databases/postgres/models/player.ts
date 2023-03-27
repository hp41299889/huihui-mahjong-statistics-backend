import postgres from '@postgres/postgres';
import { Player } from '@postgres/entities';
import { In } from 'typeorm';
import loggerFactory from '@utils/logger';

interface ICreateOnePlayerDto {
    name: string;
};

const logger = loggerFactory('Model player');
const repo = postgres.getRepository(Player);

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

const readOneByName = async (playerName: string) => {
    try {
        return await repo.findOneBy({
            name: playerName
        });
    } catch (err) {
        throw err;
    };
};

const readManyByNames = async (playerNames: string[]) => {
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

export { ICreateOnePlayerDto };
export default {
    createOne,
    readAll,
    readOneByName,
    readManyByNames
};