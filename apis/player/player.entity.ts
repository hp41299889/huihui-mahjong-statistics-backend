import { EntitySchema } from 'typeorm';

import { IPlayer } from './player.interface';

export const Player = new EntitySchema<IPlayer>({
    name: 'player',
    columns: {
        id: {
            primary: true,
            type: Number,
            generated: true
        },
        name: {
            type: String,
            unique: true
        },
        createdAt: {
            name: 'created_at',
            type: 'timestamp',
            createDate: true
        },
    },
    relations: {
        rounds: {
            target: 'round',
            type: 'one-to-many',
            joinColumn: { name: 'roundUid' }
        },
        winner: {
            type: 'many-to-many',
            target: 'record',
        },
        loser: {
            type: 'one-to-many',
            target: 'recordLoser'
        }
    }
});