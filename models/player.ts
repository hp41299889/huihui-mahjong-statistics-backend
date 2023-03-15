import { postgres } from "../services";
import { Player } from "../entities";

export {
    findPlayerById,
    findPlayerByName
};

const repo = postgres.getRepository(Player);

const findPlayerById = (playerId: number) => {
    try {
        return repo.findOneBy({ id: playerId });
    } catch (err) {
        throw err;
    };
};

const findPlayerByName = async (playerName: string): Promise<Player | null> => {
    try {
        return await repo.findOneBy({ name: playerName });
    } catch (err) {
        throw err;
    };
};