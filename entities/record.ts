import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
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
        type: 'enum',
        enum: WindEnum,
        nullable: true
    })
    winner: WindEnum | null;

    @Column({ nullable: true, })
    loser: string | null;

    @Column({
        type: 'enum',
        enum: WindEnum
    })
    dealer: WindEnum;

    @Column({ type: 'smallint' })
    dealerCount: number;

    @Column({
        type: 'enum',
        enum: WindEnum
    })
    circle: WindEnum;

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

    @ManyToOne(() => Round, round => round.record)
    round: Round;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
};