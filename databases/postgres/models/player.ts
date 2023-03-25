import postgres from '@postgres/postgres';
import { IPlayer, Player } from '@postgres/entities';

interface ICreateOnePlayerDto {
    name: string;
};

const repo = postgres.getRepository(Player);

const createOne = (dto: ICreateOnePlayerDto) => {
    try {
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

export { ICreateOnePlayerDto };
export default {
    createOne,
    readAll,
    readOneByName
};