import { EntitySchema } from 'typeorm';
import { IPlayer } from './player';
import { IRecord } from './record';

interface IRecordLoser {
    uid: string;
    player: IPlayer;
    record: IRecord;
};

const RecordLoser = new EntitySchema<IRecordLoser>({
    name: 'record_loser',
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
        },
        record: {
            type: 'many-to-one',
            target: 'record',
        },
    }
});

export { IRecordLoser };
export default RecordLoser;