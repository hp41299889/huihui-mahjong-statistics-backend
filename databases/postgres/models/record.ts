import postgres from '@postgres/postgres';
import { Record } from '@postgres/entities';

const repo = postgres.getRepository(Record);

interface ICreateOneRecordDto {

};

const createOne = async (record: Record) => {
    try {
        return await repo.save(record);
    } catch (err) {
        throw err;
    };
};

const readAll = async () => {
    try {
        return await repo.find();
    } catch (err) {
        throw err;
    };
};

const readLastByRoundUid = async (roundUid: string) => {
    try {
        return await repo.findOne({
            where: {
                round: {
                    uid: roundUid
                }
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
    readLastByRoundUid
};