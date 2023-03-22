import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn
} from 'typeorm';

import { Player } from './player';
import { Record } from './record';

export {
    DeskType,
    Round
};

enum DeskType {
    AUTO = 'auto',
    MANUAL = 'manual'
};

@Entity()
class Round {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column({
        type: 'enum',
        enum: DeskType,
        default: DeskType.AUTO
    })
    deskType: DeskType;

    @Column({ type: 'smallint' })
    base: number;

    @Column({ type: 'smallint' })
    point: number;

    @ManyToOne(() => Player, { eager: true })
    east: Player;

    @ManyToOne(() => Player, { eager: true })
    south: Player;

    @ManyToOne(() => Player, { eager: true })
    west: Player;

    @ManyToOne(() => Player, { eager: true })
    north: Player;

    @OneToMany(() => Record, (record) => record.round)
    records: Record[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
};