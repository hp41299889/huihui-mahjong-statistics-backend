import postgres from '@postgres/postgres';
import { Round } from '@postgres/entities';

const repo = postgres.getRepository(Round);

const createOne = async (round: Round) => {
    try {
        return await repo.save(round);
    } catch (err) {
        throw err;
    };
};

const readAll = async () => {
    try {
        return repo.find();
    } catch (err) {
        throw err;
    };
};


const readOneByUid = async (uid: string) => {
    try {
        return repo.findOneBy({ uid: uid });
    } catch (err) {
        throw err;
    };
};

const readLast = async () => {
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

export default {
    createOne,
    readAll,
    readLast,
    readOneByUid
};