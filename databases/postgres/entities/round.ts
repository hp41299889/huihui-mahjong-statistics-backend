import { EntitySchema } from 'typeorm';
import { IPlayer } from './player';
import { IRecord } from './record';

enum EDeskType {
    AUTO = 'auto',
    MANUAL = 'manual'
};

interface IRound {
    uid: string;
    deskType: EDeskType;
    base: number;
    point: number;
    east: IPlayer;
    south: IPlayer;
    west: IPlayer;
    north: IPlayer;
    records: IRecord[];
    createdAt: Date;
    updatedAt: Date;
};

const Round = new EntitySchema<IRound>({
    name: 'round',
    columns: {
        uid: {
            primary: true,
            type: 'uuid',
            generated: 'uuid'
        },
        deskType: {
            type: 'enum',
            enum: EDeskType,
            default: EDeskType.AUTO
        },
        base: {
            type: Number
        },
        point: {
            type: Number
        },
        createdAt: {
            name: 'created_at',
            type: 'timestamp',
            createDate: true
        },
        updatedAt: {
            name: 'updated_at',
            type: 'timestamp',
            updateDate: true
        }
    },
    relations: {
        east: {
            target: 'player',
            type: 'many-to-one',
        },
        south: {
            target: 'player',
            type: 'many-to-one',
        },
        west: {
            target: 'player',
            type: 'many-to-one',
        },
        north: {
            target: 'player',
            type: 'many-to-one',
        },
        records: {
            target: 'record',
            type: 'many-to-one',
        }
    }
});

export { IRound, EDeskType };
export default Round;