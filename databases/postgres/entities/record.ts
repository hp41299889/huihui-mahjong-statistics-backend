import { EntitySchema } from 'typeorm';
import { IPlayer } from './player';
import { IRound } from './round';
import { IRecordLoser } from './recordLoser';

enum EEndType {
    WINNING = 'winning',
    SELF_DRAWN = 'self-drawn',
    DRAW = 'draw',
    FAKE = 'fake'
};

enum EWind {
    EAST = 'east',
    SOUTH = 'south',
    WEST = 'west',
    NORTH = 'north',
};

interface IRecord {
    uid: string;
    winner: IPlayer;
    loser: IRecordLoser[];
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    endType: EEndType;
    point: number;
    round: IRound;
    createdAt: Date;
    // updatedAt: Date;
};

const Record = new EntitySchema<IRecord>({
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
        // updatedAt: {
        //     name: 'updated_at',
        //     type: 'timestamp',
        //     updateDate: true
        // }
    },
    relations: {
        winner: {
            target: 'player',
            type: 'many-to-one',
            joinColumn: { name: 'winnerId' }
        },
        loser: {
            target: 'player',
            type: 'one-to-many',
        },
        round: {
            target: 'round',
            type: 'many-to-one',
            joinColumn: { name: 'roundUid' }
        }
    }
});

export { IRecord, EEndType, EWind };
export default Record;