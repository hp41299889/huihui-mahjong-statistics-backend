import { loggerFactory } from '@utils';
import { Postgres } from '@databases';
import { Record } from './record.entity';
import { ICreateOneRecordDto } from './record.interface';

const logger = loggerFactory('Model Record');
const repo = Postgres.getRepository(Record);

// Create
const createOne = async (dto: ICreateOneRecordDto) => {
    try {
        logger.debug('create one record');
        return await repo.save(dto);
    } catch (err) {
        throw err;
    };
};

export default {
    createOne,
};