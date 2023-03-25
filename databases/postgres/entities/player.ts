import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';

import { IRound } from './round';
import { IRecordLoser } from './recordLoser';

interface IPlayer {
    id: number;
    name: string;
    rounds: IRound[];
    winners: IPlayer;
    losers: IRecordLoser[];
    createdAt: Date;
    updatedAt: Date;
};

const Player = new EntitySchema<IPlayer>({
    name: 'player',
    columns: {
        id: {
            primary: true,
            type: Number,
            generated: true
        } as EntitySchemaColumnOptions,
        name: {
            type: String,
            unique: true
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
        rounds: {
            target: 'round',
            type: 'one-to-many',
        },
        winners: {
            type: 'one-to-many',
            target: 'record',
        },
        losers: {
            type: 'one-to-many',
            target: 'record_loser'
        }
    }
});

export { IPlayer };
export default Player;