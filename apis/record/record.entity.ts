import { EntitySchema } from 'typeorm';

import { EWind, EEndType } from './record.enum';
import { IRecord } from './record.interface';

export const Record = new EntitySchema<IRecord>({
    name: 'record',
    columns: {
        uid: {
            primary: true,
            type: 'uuid',
            generated: 'uuid'
        },
        circle: {
            type: 'enum',
            enum: EWind
        },
        dealer: {
            type: 'enum',
            enum: EWind
        },
        dealerCount: {
            type: Number
        },
        endType: {
            type: 'enum',
            enum: EEndType
        },
        point: {
            type: Number
        },
        createdAt: {
            name: 'created_at',
            type: 'timestamp',
            createDate: true
        },
    },
    relations: {
        round: {
            target: 'round',
            type: 'many-to-one',
            joinColumn: { name: 'roundUid' }
        },
        winner: {
            target: 'player',
            type: 'many-to-one',
            joinColumn: { name: 'winnerId' },
            eager: true
        },
        losers: {
            target: 'player',
            type: 'many-to-many',
            joinTable: {
                name: 'record_losers',
                joinColumn: {
                    name: 'recordUid'
                }
            },
            cascade: true
        },
    }
});