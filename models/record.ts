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

const findLastRecordByRound = async (round: Round) => {
    //TODO findLastRecordByRound
    try {
        return await repo.createQueryBuilder('record')
            .where('record.roundUid = :roundUid')
            .orderBy('record.createdAt', 'DESC')
            .take(1)
            .getOne();
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