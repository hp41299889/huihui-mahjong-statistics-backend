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
            type: 'many-to-one',
            eager: true
        },
        south: {
            target: 'player',
            type: 'many-to-one',
            eager: true
        },
        west: {
            target: 'player',
            type: 'many-to-one',
            eager: true
        },
        north: {
            target: 'player',
            type: 'many-to-one',
            eager: true
        },
        records: {
            target: 'record',
            type: 'one-to-many',
            joinColumn: { name: 'roundUid' }
        }
    }
});