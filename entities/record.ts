import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';

import { Round } from './round';

export {
    WindEnum,
    EndEnum,
    Record
};

enum WindEnum {
    EAST = 'east',
    SOUTH = 'south',
    WEST = 'west',
    NORTH = 'north'
};

enum EndEnum {
    WINNING = 'winning',
    SELF_DRAWN = 'self-drawn',
    DRAW = 'draw',
    FAKE = 'fake'
};

@Entity()
class Record {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column({
        nullable: true, type: 'smallint'
    })
    winner: number | null;

    @Column({ nullable: true })
    loser: string | null;

    @Column({
        type: 'smallint'
    })
    dealer: number;

    @Column({ type: 'smallint' })
    dealerCount: number;

    @Column({
        type: 'smallint'
    })
    circle: number;

    @Column({
        type: 'enum',
        enum: EndEnum
    })
    endType: EndEnum

    @Column({
        type: 'smallint',
        nullable: true
    })
    point: number | null;

    @ManyToOne(() => Round, round => round.records)
    round: Round;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
};