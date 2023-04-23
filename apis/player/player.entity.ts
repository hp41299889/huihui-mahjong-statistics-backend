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
        win: {
            type: Number,
            default: 0
        },
        lose: {
            type: Number,
            default: 0
        },
        selfDrawn: {
            type: Number,
            default: 0
        },
        beSelfDrawn: {
            type: Number,
            default: 0
        },
        draw: {
            type: Number,
            default: 0
        },
        fake: {
            type: Number,
            default: 0
        },
        amount: {
            type: Number,
            default: 0
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
            type: 'one-to-many',
            target: 'record',
        },
    }
});