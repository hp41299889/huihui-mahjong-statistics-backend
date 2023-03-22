import postgres from "../postgres";
import { Round } from "../entities/index";

export {
    findAllRounds,
    findOneRoundByUid,
    findLastRound,
    saveRound
};

const repo = postgres.getRepository(Round);

const findAllRounds = async () => {
    try {
        return repo.find();
    } catch (err) {
        throw err;
    };
};


const findOneRoundByUid = async (uid: string) => {
    try {
        return repo.findOneBy({ uid: uid });
    } catch (err) {
        throw err;
    };
};

const findLastRound = async () => {
    try {
        return repo.findOne({
            where: {

            },
            order: {
                createdAt: 'DESC'
            }
        });
    } catch (err) {
        throw err;
    };
};

const saveRound = async (round: Round) => {
    try {
        return await repo.save(round);
    } catch (err) {
        throw err;
    };
};