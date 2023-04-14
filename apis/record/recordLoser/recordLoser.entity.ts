import { EntitySchema } from 'typeorm';
import { IRecordLoser } from './recordLoser.interface';

export const RecordLoser = new EntitySchema<IRecordLoser>({
    name: 'recordLoser',
    columns: {
        uid: {
            primary: true,
            type: 'uuid',
            generated: 'uuid'
        },
    },
    relations: {
        player: {
            type: 'many-to-one',
            target: 'player',
            joinColumn: { name: 'playerId' },
        },
        record: {
            type: 'many-to-one',
            target: 'record',
            joinColumn: { name: 'recordUid' },
        },
    }
});