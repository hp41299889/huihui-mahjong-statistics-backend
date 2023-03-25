// import {
//     Entity,
//     ManyToOne,
//     Column,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     JoinColumn,
// } from 'typeorm';

// import { Round } from './round';

// export {
//     WindEnum,
//     EndEnum,
//     Record
// };

// enum WindEnum {
//     EAST = 'east',
//     SOUTH = 'south',
//     WEST = 'west',
//     NORTH = 'north'
// };

// enum EndEnum {
//     WINNING = 'winning',
//     SELF_DRAWN = 'self-drawn',
//     DRAW = 'draw',
//     FAKE = 'fake'
// };

// @Entity()
// class Record {
//     @PrimaryGeneratedColumn('uuid')
//     uid: string;

//     @Column({
//         nullable: true, type: 'smallint'
//     })
//     winner: number | null;

//     @Column({ nullable: true })
//     loser: string | null;

//     @Column({
//         type: 'smallint'
//     })
//     dealer: number;

//     @Column({ type: 'smallint' })
//     dealerCount: number;

//     @Column({
//         type: 'smallint'
//     })
//     circle: number;

//     @Column({
//         type: 'enum',
//         enum: EndEnum
//     })
//     endType: EndEnum

//     @Column({
//         type: 'smallint',
//         nullable: true
//     })
//     point: number | null;

//     @ManyToOne(() => Round, round => round.records)
//     round: Round;

//     @CreateDateColumn({ type: 'timestamp' })
//     createdAt: Date;
// };

import { EntitySchema } from 'typeorm';
import { IPlayer } from './player';
import { IRound } from './round';

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
    loser: IPlayer[];
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    endType: EEndType;
    point: number;
    round: IRound;
    createdAt: Date;
    updatedAt: Date;
};

const Record = new EntitySchema<IRecord>({
    name: 'record',
    columns: {
        uid: {
            primary: true,
            type: String,
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
        updatedAt: {
            name: 'updated_at',
            type: 'timestamp',
            updateDate: true
        }
    },
    relations: {
        winner: {
            target: 'player',
            type: 'one-to-one',
            joinColumn: { name: 'playerId' },
            inverseSide: 'records'
        },
        loser: {
            target: 'player',
            type: 'one-to-one',
            joinColumn: { name: 'playerId' },
            inverseSide: 'records'
        },
        round: {
            target: 'round',
            type: 'many-to-one',
            joinColumn: { name: 'roundUid' },
            inverseSide: 'records',
        }
    }
});

export { IRecord, EEndType };
export default Record;