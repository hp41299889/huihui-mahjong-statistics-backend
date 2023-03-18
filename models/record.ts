import { postgres } from "../services";
import { Record, Round } from "../entities";

export {
    findAllRecords,
    findLastRecordByRound,
    saveRecord
};

const repo = postgres.getRepository(Record);

const findAllRecords = async () => {
    try {
        return await repo.find();
    } catch (err) {
        throw err;
    };
};

const findLastRecordByRound = async (roundUid: string) => {
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

const saveRecord = async (record: Record) => {
    try {
        return await repo.save(record);
    } catch (err) {
        throw err;
    };
};