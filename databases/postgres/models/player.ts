import postgres from '@postgres/postgres';
import { Player } from '@postgres/entities';

const repo = postgres.getRepository(Player);

const createOne = (name: string) => {
    try {
        const player = new Player();
        player.name = name;
        return repo.save(player);
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

const readOneByName = async (playerName: string): Promise<Player | null> => {
    try {
        return await repo.findOneBy({ name: playerName });
    } catch (err) {
        throw err;
    };
};

export default {
    createOne,
    readAll,
    readOneByName
};