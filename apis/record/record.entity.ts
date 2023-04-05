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
        winner: {
            type: 'enum',
            enum: EWind
        },
        loser: {
            type: 'simple-array',
            enum: EWind
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
        }
    }
});