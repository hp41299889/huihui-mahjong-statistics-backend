import { postgres } from "../services";
import { Player } from "../entities";

export {
    findPlayerById,
    findPlayerByName
};

const repo = postgres.getRepository(Player);

const findPlayerById = (playerId: number) => {
    return repo.findOneBy({ id: playerId });
};

const findPlayerByName = (playerName: string) => {
    return repo.findOneBy({ name: playerName });
};