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
import { IRound } from './round';

enum EEndType {
    WINNING = 'winning',
    SELF_DRAWN = 'self-drawn',
    DRAW = 'draw',
    FAKE = 'fake'
};

interface IRecord {
    uid: string;
    winner: number;
    loser: number;
    circle: number;
    dealer: number;
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
        winner: {
            type: Number
        },
        loser: {
            type: Number
        },
        circle: {
            type: Number
        },
        dealer: {
            type: Number
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