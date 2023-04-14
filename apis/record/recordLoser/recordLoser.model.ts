import { Postgres } from '@postgres';
import { RecordLoser } from './recordLoser.entity';
import { ICreateOneLoserByPlayerDto } from './recordLoser.interface';

import { loggerFactory } from '@utils';

const logger = loggerFactory('Model recordLoser');
const repo = Postgres.getRepository(RecordLoser);

const createLoserByPlayer = async (dto: ICreateOneLoserByPlayerDto) => {
    try {
        return await repo.save(dto);
    } catch (err) {
        throw err;
    }
};

const readLosersByRecordUid = async (uid: string) => {
    try {
        logger.debug('readLosersByRecordUid', uid);
        return repo.findBy({
            record: {
                uid: uid
            }
        });
    } catch (err) {
        throw err;
    };
};

export default {
    createLoserByPlayer,
    readLosersByRecordUid
}