import { EntitySchema } from 'typeorm';

import { EDeskType } from './round.enum';
import { IRound } from './round.interface';

export const Round = new EntitySchema<IRound>({
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
    },
    relations: {
        east: {
            target: 'player',
            type: 'many-to-one'
        },
        south: {
            target: 'player',
            type: 'many-to-one'
        },
        west: {
            target: 'player',
            type: 'many-to-one'
        },
        north: {
            target: 'player',
            type: 'many-to-one'
        },
        records: {
            target: 'record',
            type: 'one-to-many',
            joinColumn: { name: 'recordUid' },
            inverseSide: 'round',
        }
    }
});