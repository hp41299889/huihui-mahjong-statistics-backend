import postgres from '@postgres/postgres';
import { RecordLoser, IRecordLoser, IPlayer, IRecord } from '@postgres/entities';

import loggerFactory from '@utils/logger';

const logger = loggerFactory('Model recordLoser');
const repo = postgres.getRepository(RecordLoser);

interface ICreateOneLoserByPlayerDto {
    player: IPlayer;
    record: IRecord;
}

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
export { ICreateOneLoserByPlayerDto };
export default {
    createLoserByPlayer,
    readLosersByRecordUid
};