import { postgres } from "../services";
import { Record } from "../entities";

export {
    saveRecord
};

const repo = postgres.getRepository(Record);

const saveRecord = async (record: Record) => {
    try {

    } catch (err) {

    };
    await repo.save(record);
};