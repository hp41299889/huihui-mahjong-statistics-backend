import { postgres } from "../services";
import { Record } from "../entities";

export {
    findAllRecords,
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

const saveRecord = async (record: Record) => {
    try {
        return await repo.save(record);
    } catch (err) {
        throw err;
    };
};